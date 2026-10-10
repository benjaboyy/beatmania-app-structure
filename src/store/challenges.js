import { randomKey, databaseRequest, updateDatabase, courseResult, challengeError, sendDiscordChallengeResult } from '@/util/helpers';

const RECEIPTS_KEY = 'challengeReceipts';
const GUEST_KEY = 'challengeGuestKey';
const AUTH_KEY = 'challengeGuestAuth';
const API_KEY = process.env.VUE_APP_FIREBASE_API_KEY;
const notifications = new Map();

function receipts() {
  try {
    const values = JSON.parse(localStorage.getItem(RECEIPTS_KEY) || '[]');
    return Array.isArray(values) ? values.filter(value => value && typeof value.entryId === 'string' && typeof value.challengeId === 'string') : [];
  } catch { return []; }
}

function guestKey() {
  let value = localStorage.getItem(GUEST_KEY);
  if (!value) {
    value = randomKey(32);
    localStorage.setItem(GUEST_KEY, value);
  }
  return value;
}

function remember(receipt) {
  const values = receipts();
  const current = values.find(value => value.entryId === receipt.entryId);
  const delivery = current?.discordSent ? { discordSent: true, discordPending: false, discordRetryAt: 0 } : {};
  localStorage.setItem(RECEIPTS_KEY, JSON.stringify([...values.filter(value => value.entryId !== receipt.entryId), { ...receipt, ...delivery }]));
}

function validKey(value) {
  if (typeof value !== 'string' || !value || value.length > 160 || Array.from(value).some(character => '.#$[]/'.includes(character) || character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) throw challengeError('invalidInput');
  return value;
}

function leaderboard(entries) {
  const best = new Map();
  for (const [id, entry] of Object.entries(entries || {})) {
    const previous = best.get(entry.participantId);
    if (!previous || entry.score > previous.score || (entry.score === previous.score && entry.submittedAt < previous.submittedAt)) best.set(entry.participantId, { ...entry, id });
  }
  return [...best.values()].sort((a, b) => b.score - a.score || a.submittedAt - b.submittedAt || a.id.localeCompare(b.id));
}

async function publish(challengeId, entryId, attempt, auth) {
  const participantId = await updateDatabase(`challengeParticipants/${auth.uid}`, auth.token, current => current || randomKey());
  const { nickname, score, grade, clear, FC, submittedAt } = attempt;
  const entry = { participantId, nickname, score, grade, clear, FC, submittedAt };
  await databaseRequest(`challengeEntries/${challengeId}/${entryId}`, { token: auth.token, method: 'PUT', body: entry });
  return { ...entry, id: entryId };
}

export default {
  namespaced: true,
  actions: {
    async authentication({ rootGetters, dispatch }, requireAccount = false) {
      if (rootGetters.isAuthenticated) {
        await dispatch('checkTokenExpiration', null, { root: true });
        if (rootGetters.isAuthenticated) return { token: rootGetters.token, uid: rootGetters.userId, account: true };
      }
      if (requireAccount) throw challengeError('signInRequired');
      let saved;
      try { saved = JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { saved = null; }
      if (saved?.token && saved.expiresAt > Date.now() + 60000) return saved;
      let response;
      if (saved?.refreshToken) {
        response = await fetch('https://securetoken.googleapis.com/v1/token?key=' + API_KEY, {
          method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: saved.refreshToken })
        });
        const value = await response.json();
        if (!response.ok) throw challengeError('requestFailed');
        saved = { token: value.id_token, uid: value.user_id, refreshToken: value.refresh_token, expiresAt: Date.now() + Number(value.expires_in) * 1000 };
      } else {
        response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + API_KEY, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true })
        });
        const value = await response.json();
        if (!response.ok) throw challengeError('requestFailed');
        saved = { token: value.idToken, uid: value.localId, refreshToken: value.refreshToken, expiresAt: Date.now() + Number(value.expiresIn) * 1000 };
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(saved));
      return saved;
    },
    async list({ rootGetters, dispatch }, input = {}) {
      let values;
      if (input.admin) {
        const auth = await dispatch('authentication', true);
        values = (await databaseRequest('challenges', { token: auth.token })).data;
      } else {
        const results = await Promise.all(['open', 'closed'].map(status => databaseRequest('challenges', { query: { orderBy: JSON.stringify('status'), equalTo: JSON.stringify(status) } })));
        values = Object.assign({}, ...results.map(result => result.data));
      }
      const token = rootGetters.token;
      return Promise.all(Object.entries(values || {}).filter(([, value]) => (!input.arcadeId || value.arcadeId === input.arcadeId) && (!input.gameId || value.gameId === input.gameId))
        .sort((a, b) => b[1].createdAt - a[1].createdAt || a[0].localeCompare(b[0]))
        .map(async ([id, value]) => {
          const path = input.admin ? `challengeAttempts/${id}` : `challengeEntries/${id}`;
          const { data } = await databaseRequest(path, { token, query: { shallow: 'true' } });
          return { ...value, id, entryCount: Object.keys(data || {}).length };
        }));
    },
    async get({ rootGetters }, challengeId) {
      validKey(challengeId);
      try {
        const { data } = await databaseRequest(`challenges/${challengeId}`, { token: rootGetters.token });
        if (!data) throw challengeError('challengeNotFound');
        const { data: entries } = await databaseRequest(`challengeEntries/${challengeId}`, { token: rootGetters.token });
        return { challenge: { ...data, id: challengeId, entryCount: Object.keys(entries || {}).length }, entries: leaderboard(entries) };
      } catch (error) {
        if (error.status === 401 || error.status === 403) throw challengeError('challengeNotFound');
        throw error;
      }
    },
    async save({ dispatch }, input) {
      const auth = await dispatch('authentication', true);
      const id = validKey(input.id);
      const arcadeId = validKey(input.arcadeId);
      const gameId = validKey(input.gameId);
      const courseId = validKey(input.courseId);
      const title = input.title?.trim();
      const instructions = (input.instructions || '').trim();
      if (!title || title.length > 100 || instructions.length > 1000 || !['draft', 'open', 'closed'].includes(input.status)) throw challengeError('invalidInput');
      const [arcade, game, course, attempts] = (await Promise.all([
        databaseRequest(`arcades/${arcadeId}`), databaseRequest(`games/${gameId}`), databaseRequest(`courses/${gameId}/${courseId}`),
        databaseRequest(`challengeAttempts/${id}`, { token: auth.token, query: { shallow: 'true' } })
      ])).map(result => result.data);
      if (!arcade || !game || !course || !['singles', 'doubles'].includes(course.type) || !Object.values(arcade.games || {}).includes(gameId)) throw challengeError('invalidCourse');
      const hasEntries = Boolean(Object.keys(attempts || {}).length);
      let saved;
      try {
        saved = await updateDatabase(`challenges/${id}`, auth.token, current => {
          if (hasEntries && (current.arcadeId !== arcadeId || current.gameId !== gameId || current.courseId !== courseId || input.status === 'draft')) throw challengeError('challengeLocked');
          return {
            title, instructions, arcadeId, arcadeName: arcade.name, gameId, gameName: game.name, courseId,
            course: hasEntries ? current.course : {
              id: courseId, name: course.name, type: course.type, onlySinglePlayer: course.onlySinglePlayer === true,
              songIDs: Object.values(course.songIDs || {}).map(song => ({ id: song.id, name: song.name || '', diff: song.diff || '', value: song.value || '' }))
            },
            status: input.status, createdAt: current?.createdAt || Date.now()
          };
        });
      } catch (error) {
        if (error.status === 401 || error.status === 403) throw challengeError('challengeLocked');
        throw error;
      }
      return { ...saved, id, entryCount: Object.keys(attempts || {}).length };
    },
    getReceipts(_, challengeId) {
      return receipts().filter(receipt => receipt.challengeId === challengeId);
    },
    async notify(_, { challengeId, entryId }) {
      if (!process.env.VUE_APP_DISCORD_WEBHOOK_URL) return;
      const key = `${challengeId}/${entryId}`;
      if (notifications.has(key)) return notifications.get(key);
      const notification = (async () => {
        const receipt = receipts().find(value => value.challengeId === challengeId && value.entryId === entryId);
        if (!receipt?.confirmed || !receipt.discordPending || receipt.discordSent || receipt.discordRetryAt > Date.now()) return;
        try {
          const { data: challenge } = await databaseRequest(`challenges/${validKey(challengeId)}`);
          if (!challenge) return;
          if (challenge.arcadeId !== process.env.VUE_APP_DISCORD_ARCADE_ID) {
            const current = receipts().find(value => value.challengeId === challengeId && value.entryId === entryId);
            if (current) remember({ ...current, discordPending: false });
            return;
          }
          const { data: entry } = await databaseRequest(`challengeEntries/${challengeId}/${validKey(entryId)}`);
          if (!entry) return;
          const sent = await sendDiscordChallengeResult(challengeId, challenge, entry);
          const current = receipts().find(value => value.challengeId === challengeId && value.entryId === entryId);
          if (current) remember({ ...current, discordSent: sent, discordPending: !sent, discordRetryAt: sent ? 0 : Date.now() + 60000 });
        } catch { /* Discord delivery must not fail a saved score. */ }
      })();
      notifications.set(key, notification);
      try { await notification; }
      finally { notifications.delete(key); }
    },
    async retryNotifications({ dispatch }, challengeId) {
      for (const receipt of receipts().filter(value => value.challengeId === challengeId && value.confirmed && value.discordPending && !value.discordSent)) {
        await dispatch('notify', receipt);
      }
    },
    async submit({ dispatch }, payload) {
      const challengeId = validKey(payload.challengeId);
      const entryId = validKey(payload.entryId);
      const existing = receipts().find(receipt => receipt.entryId === entryId);
      const receipt = existing || { ...payload, confirmed: false, linked: false, discordPending: Boolean(process.env.VUE_APP_DISCORD_WEBHOOK_URL) };
      const result = courseResult(receipt);
      if (!receipt.nickname?.trim() || receipt.nickname.trim().length > 30) throw challengeError('invalidInput');
      remember(receipt);
      const auth = await dispatch('authentication');
      const path = `challengeAttempts/${challengeId}/${entryId}`;
      let attempt;
      try {
        attempt = (await databaseRequest(path, { token: auth.token })).data;
      } catch (error) {
        if (auth.account && existing) {
          await dispatch('link', receipt);
          await dispatch('notify', { challengeId, entryId });
          return { entry: { ...receipt, id: entryId }, linked: true };
        }
        throw error;
      }
      if (!attempt) {
        const { challenge } = await dispatch('get', challengeId);
        if (challenge.status !== 'open') {
          localStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts().filter(value => value.entryId !== entryId)));
          throw challengeError('challengeClosed');
        }
        const body = { ...result, nickname: receipt.nickname.trim(), claimKey: guestKey(), ownerUid: auth.uid, submittedAt: { '.sv': 'timestamp' } };
        delete body.favorite;
        try {
          await databaseRequest(path, { token: auth.token, method: 'PUT', body, headers: { 'If-Match': 'null_etag' } });
        } catch (error) {
          if (error.status !== 412) throw error;
        }
        attempt = (await databaseRequest(path, { token: auth.token })).data;
      }
      if (attempt.claimKey !== guestKey()) throw challengeError('cannotClaim');
      let entry;
      if (auth.account) {
        entry = await dispatch('link', receipt);
      } else {
        entry = await publish(challengeId, entryId, attempt, auth);
        remember({ ...receipt, confirmed: true, linked: false });
      }
      await dispatch('notify', { challengeId, entryId });
      return { entry, linked: Boolean(auth.account) };
    },
    async link({ dispatch }, receipt) {
      const auth = await dispatch('authentication', true);
      const path = `challengeAttempts/${validKey(receipt.challengeId)}/${validKey(receipt.entryId)}`;
      try {
        await databaseRequest(`${path}/claim`, { token: auth.token, method: 'PUT', body: { uid: auth.uid, key: guestKey() } });
      } catch (error) {
        if (error.status === 401 || error.status === 403) throw challengeError('cannotClaim');
        throw error;
      }
      const { data: attempt } = await databaseRequest(path, { token: auth.token });
      const { challenge } = await dispatch('get', receipt.challengeId);
      const entry = await publish(receipt.challengeId, receipt.entryId, attempt, auth);
      await databaseRequest(`challengeAccountEntries/${auth.uid}/${receipt.challengeId}/${receipt.entryId}`, { token: auth.token, method: 'PUT', body: true });
      await dispatch('addCourseToUser', { ...attempt, id: challenge.courseId, gameId: challenge.gameId, sourceEntryId: receipt.entryId }, { root: true });
      remember({ ...receipt, confirmed: true, linked: true });
      return entry;
    },
    async claim({ dispatch }, challengeId) {
      let count = 0;
      for (const receipt of receipts().filter(value => value.challengeId === challengeId && !value.linked)) {
        if (!receipt.confirmed) await dispatch('submit', receipt);
        else await dispatch('link', receipt);
        count++;
      }
      if (count) await dispatch('refreshProgress');
      return count;
    },
    async refreshProgress({ dispatch }) {
      await Promise.all([dispatch('loadUserCourses', null, { root: true }), dispatch('loadTrackedGames', null, { root: true })]);
    }
  }
};
