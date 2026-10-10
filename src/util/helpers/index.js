import english from '@/assets/locales/en';

export function findUserCourse(courses, gameId, courseId) {
  return courses.find(course => course.id === courseId && course.gameId === gameId)
    || courses.find(course => course.id === courseId && !course.gameId);
}

export function challengeReturnPath(value) {
  return typeof value === 'string' && /^\/challenge\/[a-zA-Z0-9_-]+$/.test(value) ? value : null;
}

export function randomKey(bytes = 16) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), value => value.toString(16).padStart(2, '0')).join('');
}

export function courseChartLabel(song, translate) {
  const labels = { difficultyEasy: 'easy', difficultyNormal: 'normal', difficultyHard: 'hard', difficultyAnother: 'another', difficultyDoubleEasy: 'easy', difficultyDoubleNormal: 'normal', difficultyDoubleHard: 'hard', difficultyDoubleAnother: 'another' };
  return (labels[song.diff] ? translate('listScreen.' + labels[song.diff]) + ' ' : '') + (song.value || '');
}

export function challengeError(code) {
  return Object.assign(new Error(code), { code });
}

export function discordChallengeMessage(challengeId, challenge, entry) {
  const text = english.challenges.discord;
  const escape = value => Array.from(String(value), character => {
    if (character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127) return ' ';
    return '\\*_`~|<>[]'.includes(character) ? '\\' + character : character;
  }).join('');
  const clear = entry.FC ? text.fullCombo : entry.clear ? text.cleared : text.failed;
  return {
    content: `${text.newResult} — ${escape(challenge.arcadeName)}\n`
      + `**${text.player}:** ${escape(entry.nickname)}\n`
      + `**${text.challenge}:** ${escape(challenge.title)}\n`
      + `**${text.score}:** ${Number(entry.score).toLocaleString('en-US')} · **${text.grade}:** ${escape(entry.grade)} · **${text.clear}:** ${clear}\n`
      + `${text.leaderboard}: https://bmgress.app/challenge/${encodeURIComponent(challengeId)}`,
    allowed_mentions: { parse: [] }
  };
}

export async function sendDiscordChallengeResult(challengeId, challenge, entry) {
  const webhook = process.env.VUE_APP_DISCORD_WEBHOOK_URL;
  const arcadeId = process.env.VUE_APP_DISCORD_ARCADE_ID;
  if (!webhook || !arcadeId || challenge.arcadeId !== arcadeId) return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const url = new URL(webhook);
    url.searchParams.set('wait', 'true');
    const response = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordChallengeMessage(challengeId, challenge, entry)),
      keepalive: true, signal: controller.signal
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function databaseRequest(path, { token, method = 'GET', body, headers = {}, query = {} } = {}) {
  const params = new URLSearchParams(query);
  if (token) params.set('auth', token);
  const base = process.env.VUE_APP_FIREBASE_BASE_URL.replace(/\/$/, '');
  const response = await fetch(`${base}/${path}.json?${params}`, {
    method, headers: { 'Content-Type': 'application/json', ...headers },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw Object.assign(challengeError('requestFailed'), { status: response.status });
  return { data, etag: response.headers.get('ETag') };
}

export async function updateDatabase(path, token, update) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, etag } = await databaseRequest(path, { token, headers: { 'X-Firebase-ETag': 'true' } });
    const next = update(data);
    try {
      return (await databaseRequest(path, { token, method: 'PUT', body: next, headers: { 'If-Match': etag } })).data;
    } catch (error) {
      if (error.status !== 412) throw error;
    }
  }
  throw challengeError('requestFailed');
}

export function courseResult(input, required = true) {
  const supplied = input.score !== '' && input.score != null;
  const score = supplied && ['number', 'string'].includes(typeof input.score) && String(input.score).trim() ? Number(input.score) : null;
  if ((required || supplied) && (!Number.isSafeInteger(score) || score < 0)) throw challengeError('invalidInput');
  const grade = typeof input.grade === 'string' ? input.grade.trim() : '';
  if (grade.length > 20 || (score !== null && !grade)) throw challengeError('invalidInput');
  return {
    ...(score !== null ? { score, grade } : {}),
    clear: input.clear === true || input.FC === true, FC: input.FC === true,
    ...(typeof input.favorite === 'boolean' ? { favorite: input.favorite } : {}),
    ...(input.sourceEntryId ? { sourceEntryId: input.sourceEntryId } : {})
  };
}

export function mergeCourseProgress(user, definitions, gameId, courseId, result) {
  if (!user) throw challengeError('accountNotFound');
  const definition = definitions?.[courseId];
  if (!definition) throw challengeError('courseNotFound');
  const courses = { ...user.courses };
  const current = findUserCourse(Object.values(courses), gameId, courseId) || {};
  const previous = current.score === '' || current.score == null ? null : Number(current.score);
  const improved = result.score !== undefined && (previous === null || result.score > previous);
  const fillGrade = result.score !== undefined && result.score === previous && !current.grade;
  const courseKey = [gameId, courseId].map(id => id.replace(/%/g, '%25').replace(/~/g, '%7E')).join('~');
  courses[courseKey] = {
    ...current, id: courseId, gameId,
    ...(improved || fillGrade ? { score: result.score, normal: result.score, grade: result.grade, ...(result.sourceEntryId ? { sourceEntryId: result.sourceEntryId } : {}) } : {}),
    clear: Boolean(current.clear || current.FC || result.clear || result.FC),
    FC: Boolean(current.FC || result.FC),
    ...(typeof result.favorite === 'boolean' ? { favorite: result.favorite } : {})
  };
  const settings = { ...user.accountSettings };
  const trackedGames = { ...settings.trackedGames };
  const tracked = { singlesSet: false, doublesSet: false, singleCourse: false, doubleCourse: false, ...trackedGames[gameId] };
  tracked[definition.type === 'doubles' ? 'doubleCourse' : 'singleCourse'] = true;
  tracked.courses = Object.keys(definitions).filter(id => findUserCourse(Object.values(courses), gameId, id)?.clear).length * 5;
  tracked.total = (Number(tracked.singles) || 0) + (Number(tracked.doubles) || 0) + tracked.courses;
  trackedGames[gameId] = tracked;
  return { ...user, courses, accountSettings: { ...settings, trackedGames } };
}
