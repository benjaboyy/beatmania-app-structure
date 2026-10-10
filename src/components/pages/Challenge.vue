<template>
  <div class="login-screen px-2 mx-auto pb-4">
    <img v-if="!isAuthenticated" src="../../assets/svg/logo-full.svg" width="160" class="d-block mx-auto mb-4" alt="BMGress">
    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
    <p v-if="loading" class="text-white text-center" role="status">{{ $t('challenges.loading') }}</p>
    <template v-else-if="challenge">
      <div class="card mb-3">
        <div class="card-body">
          <span class="badge mb-2" :class="challenge.status === 'open' ? 'bg-primary' : 'bg-secondary'">{{ $t('challenges.status.' + challenge.status) }}</span>
          <h1 class="text-primary h3">{{ challenge.title }}</h1>
          <p class="mb-2">{{ challenge.arcadeName }} · {{ challenge.gameName }}</p>
          <strong>{{ challenge.course.name }} · {{ $t('filter.' + challenge.course.type) }}</strong>
          <details class="mt-2 mb-3">
            <summary>{{ $t('challenges.courseSongs') }}</summary>
            <ol class="mt-2 ps-3"><li v-for="(song, index) in challenge.course.songIDs" :key="index">{{ song.name }} <small class="text-muted">{{ chartLabel(song) }}</small></li></ol>
            <p v-if="challenge.course.onlySinglePlayer">{{ $t('filter.onlySinglePlayerInfo') }}</p>
          </details>
          <p v-if="challenge.instructions" class="text-break">{{ challenge.instructions }}</p>
          <div v-if="submission" class="alert alert-success" role="status">
            <strong>{{ $t('challenges.submitted') }}</strong><br>
            {{ submission.score }} · {{ $t('filter.grade') }}: {{ submission.grade }}
          </div>
          <div v-if="linked" class="alert alert-success" role="status">{{ $t('challenges.progressSaved') }}</div>
          <div v-if="pendingClaims.length && !linked" class="mb-3">
            <template v-if="isAuthenticated"><button class="btn btn-primary w-100" :disabled="busy" @click="claim">{{ $t('challenges.saveToProgress') }}</button></template>
            <template v-else>
              <p>{{ $t('challenges.keepScore') }}</p>
              <router-link :to="loginRoute" class="btn btn-primary w-100 mb-2">{{ $t('challenges.loginSave') }}</router-link>
              <router-link :to="registerRoute" class="btn btn-outline-primary w-100">{{ $t('challenges.registerSave') }}</router-link>
              <small class="d-block mt-2 text-muted">{{ $t('challenges.claimHint') }}</small>
            </template>
          </div>
          <template v-if="showForm && (challenge.status === 'open' || retrying)">
            <form @submit.prevent="submit">
              <label for="challenge-name" class="form-label">{{ $t('challenges.nickname') }}</label>
              <input id="challenge-name" v-model="form.nickname" class="form-control mb-3" maxlength="30" required autocomplete="nickname" :disabled="busy || retrying">
              <div class="row g-3 mb-3">
                <div class="col-6"><label for="challenge-score" class="form-label">{{ $t('filter.score') }}</label><input id="challenge-score" v-model="form.score" class="form-control" type="number" min="0" step="1" required inputmode="numeric" :disabled="busy || retrying"></div>
                <div class="col-6"><label for="challenge-grade" class="form-label">{{ $t('filter.grade') }}</label><input id="challenge-grade" v-model="form.grade" class="form-control" maxlength="20" required :disabled="busy || retrying"></div>
              </div>
              <p class="text-muted small">{{ $t('challenges.resultHint') }}</p>
              <label for="challenge-clear" class="form-label">{{ $t('challenges.clearStatus') }}</label>
              <select id="challenge-clear" v-model="form.clearStatus" class="form-select mb-3" :disabled="busy || retrying">
                <option value="failed">{{ $t('filter.failed') }}</option><option value="cleared">{{ $t('filter.cleared') }}</option><option value="fullCombo">{{ $t('filter.fullCombo') }}</option>
              </select>
              <button class="btn btn-primary w-100" :disabled="busy">{{ $t(busy ? 'challenges.saving' : retrying ? 'challenges.retry' : 'challenges.submitScore') }}</button>
              <small class="d-block text-muted mt-2">{{ $t(isAuthenticated ? 'challenges.accountHint' : 'challenges.guestHint') }}</small>
            </form>
          </template>
          <button v-else-if="challenge.status === 'open' && submission" type="button" class="btn btn-secondary w-100" :disabled="busy" @click="newAttempt">{{ $t('challenges.anotherAttempt') }}</button>
          <p v-else-if="challenge.status === 'closed'" class="mb-0">{{ $t('challenges.closedHint') }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h2 class="h4 text-primary">{{ $t('challenges.leaderboard') }}</h2>
          <p class="text-muted small">{{ $t('challenges.bestAttempt') }}</p>
          <p v-if="!entries.length" class="mb-0">{{ $t('challenges.noScores') }}</p>
          <div v-else class="table-responsive">
            <table class="table table-sm table-striped mb-0">
              <thead><tr><th scope="col" class="px-1">{{ $t('challenges.rank') }}</th><th scope="col" class="px-1">{{ $t('listScreen.player', 1) }}</th><th scope="col" class="px-1">{{ $t('filter.score') }}</th><th scope="col" class="px-1">{{ $t('filter.grade') }}</th></tr></thead>
              <tbody><tr v-for="(entry, index) in entries" :key="entry.id" :class="{ 'table-primary': submission && submission.id === entry.id }"><th scope="row" class="px-1">{{ index + 1 }}</th><td class="text-break px-1">{{ entry.nickname }} <small v-if="entry.FC">{{ $t('filter.fullComboShort') }}</small><i v-else-if="entry.clear" class="fa fa-check text-success" :aria-label="$t('filter.cleared')"></i></td><td class="px-1">{{ entry.score }}</td><td class="text-break px-1">{{ entry.grade }}</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="d-flex flex-wrap gap-2 mt-3"><router-link :to="{ path: '/arcade/' + challenge.arcadeId, query: { tab: 'challenges' } }" class="btn btn-secondary">{{ $t('challenges.arcadeChallenges') }}</router-link><button v-if="!isAuthenticated" class="btn btn-secondary" @click="languageVisible = true"><i class="fa fa-globe me-1"></i>{{ $t('login.selectLanguage') }}</button></div>
    </template>
    <LanguageModal :open="languageVisible" @close="languageVisible = false" />
  </div>
</template>

<script>
import LanguageModal from '@/components/UI/LanguageModal.vue';
import { randomKey, courseChartLabel } from '@/util/helpers';

export default {
  name: 'CourseChallenge',
  components: { LanguageModal },
  data() {
    return { challenge: null, entries: [], loading: true, busy: false, error: '', submission: null, linked: false, showForm: true, retrying: false, entryId: '', receipts: [], languageVisible: false, form: { nickname: '', score: '', grade: '', clearStatus: 'failed' } };
  },
  computed: {
    challengeId() { return this.$route.params.challengeId; },
    isAuthenticated() { return this.$store.getters.isAuthenticated; },
    pendingClaims() { return this.receipts.filter(receipt => !receipt.linked); },
    loginRoute() { return { path: '/login', query: { redirect: '/challenge/' + this.challengeId } }; },
    registerRoute() { return { path: '/register', query: { redirect: '/challenge/' + this.challengeId } }; }
  },
  created() { this.load(); },
  methods: {
    chartLabel(song) { return courseChartLabel(song, key => this.$t(key)); },
    showError(error) { this.error = this.$t('challenges.errors.' + (error.code || 'requestFailed')); },
    async reload() {
      const data = await this.$store.dispatch('challenges/get', this.challengeId);
      this.challenge = data.challenge;
      this.entries = data.entries;
      this.receipts = await this.$store.dispatch('challenges/getReceipts', this.challengeId);
      this.$store.dispatch('challenges/retryNotifications', this.challengeId);
    },
    async load() {
      this.loading = true;
      this.error = '';
      this.submission = null;
      this.linked = false;
      this.showForm = true;
      this.retrying = false;
      this.entryId = '';
      try {
        if (this.isAuthenticated && !this.$store.getters.userName) await this.$store.dispatch('loadUser');
        this.form = { nickname: this.$store.getters.userName || '', score: '', grade: '', clearStatus: 'failed' };
        await this.reload();
        const last = this.receipts[this.receipts.length - 1];
        if (last) {
          this.entryId = last.entryId;
          this.form = { nickname: last.nickname, score: last.score, grade: last.grade, clearStatus: last.FC ? 'fullCombo' : last.clear ? 'cleared' : 'failed' };
          this.retrying = !last.confirmed;
          this.submission = last.confirmed ? { ...last, id: last.entryId } : null;
          this.showForm = !last.confirmed;
          this.linked = last.linked;
        }
        if (this.isAuthenticated && this.pendingClaims.length) await this.claim();
      } catch (error) { this.showError(error); }
      finally { this.loading = false; }
    },
    newAttempt() {
      this.submission = null;
      this.linked = false;
      this.entryId = '';
      this.showForm = true;
      this.retrying = false;
      this.error = '';
      this.form.score = '';
      this.form.grade = '';
      this.form.clearStatus = 'failed';
    },
    async submit() {
      if (this.busy) return;
      if (!this.form.nickname.trim() || !String(this.form.grade).trim()) {
        this.showError({ code: 'invalidInput' });
        return;
      }
      this.busy = true;
      this.error = '';
      try {
        this.entryId = this.entryId || randomKey();
        const result = await this.$store.dispatch('challenges/submit', { challengeId: this.challengeId, entryId: this.entryId, nickname: this.form.nickname.trim(), score: this.form.score, grade: this.form.grade.trim(), clear: this.form.clearStatus !== 'failed', FC: this.form.clearStatus === 'fullCombo' });
        this.submission = result.entry;
        this.linked = result.linked;
        this.showForm = false;
        this.retrying = false;
        await this.reload();
      } catch (error) {
        this.showError(error);
        this.receipts = await this.$store.dispatch('challenges/getReceipts', this.challengeId);
        this.retrying = this.receipts.some(receipt => receipt.entryId === this.entryId && !receipt.confirmed);
      } finally { this.busy = false; }
    },
    async claim() {
      this.busy = true;
      this.error = '';
      try {
        const count = await this.$store.dispatch('challenges/claim', this.challengeId);
        if (count) {
          this.linked = true;
          this.retrying = false;
          this.showForm = false;
        }
        await this.reload();
        const last = this.receipts[this.receipts.length - 1];
        if (last) this.submission = { ...last, id: last.entryId };
      } catch (error) { this.showError(error); }
      finally { this.busy = false; }
    }
  },
  watch: { challengeId() { this.load(); } }
};
</script>
