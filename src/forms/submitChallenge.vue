<template>
  <div class="login-screen px-2 mx-auto">
    <h1 class="text-center my-4">{{ $t('challenges.manage') }}
      <router-link to="/admin" class="btn btn-secondary ms-3"><i class="fa fa-arrow-left"></i> {{ $t('menu.back') }}</router-link>
    </h1>
    <div class="card">
      <div class="card-body">
        <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
        <div v-if="saved" class="alert alert-success" role="status">{{ $t('challenges.saved') }}</div>
        <div v-if="loading" class="text-center py-3">{{ $t('challenges.loading') }}</div>
        <template v-else>
          <label for="challenge-select" class="form-label">{{ $t('challenges.chooseChallenge') }}</label>
          <select id="challenge-select" v-model="selectedId" class="form-select mb-3" @change="selectChallenge">
            <option value="">{{ $t('challenges.new') }}</option>
            <option v-for="challenge in challenges" :key="challenge.id" :value="challenge.id">{{ challenge.title }} · {{ $t('challenges.status.' + challenge.status) }}</option>
          </select>
          <form @submit.prevent="save">
            <label for="challenge-title" class="form-label">{{ $t('challenges.title') }}</label>
            <input id="challenge-title" v-model="form.title" class="form-control mb-3" maxlength="100" required>
            <label for="challenge-arcade" class="form-label">{{ $t('arcade.selectArcade') }}</label>
            <select id="challenge-arcade" v-model="form.arcadeId" class="form-select mb-3" required :disabled="locked" @change="form.gameId = ''; form.courseId = ''">
              <option value="" disabled>{{ $t('arcade.selectArcade') }}</option>
              <option v-for="arcade in arcades" :key="arcade.id" :value="arcade.id">{{ arcade.name }}</option>
            </select>
            <label for="challenge-game" class="form-label">{{ $t('arcade.selectGame') }}</label>
            <select id="challenge-game" v-model="form.gameId" class="form-select mb-3" required :disabled="locked || !form.arcadeId" @change="form.courseId = ''">
              <option value="" disabled>{{ $t('arcade.selectGame') }}</option>
              <option v-for="game in games" :key="game.id" :value="game.id">{{ game.name }}</option>
            </select>
            <label for="challenge-course" class="form-label">{{ $t('challenges.chooseCourse') }}</label>
            <select id="challenge-course" v-model="form.courseId" class="form-select mb-3" required :disabled="locked || !form.gameId">
              <option value="" disabled>{{ $t('challenges.chooseCourse') }}</option>
              <option v-for="course in courses" :key="course.id" :value="course.id">{{ course.name }} · {{ $t('filter.' + course.type) }}</option>
            </select>
            <div v-if="selectedCourse" class="mb-3">
              <strong>{{ selectedCourse.name }} · {{ $t('filter.' + selectedCourse.type) }}</strong>
              <ol class="mb-2 mt-2 ps-3"><li v-for="(song, index) in selectedCourse.songIDs" :key="index">{{ song.name }} <small class="text-muted">{{ chartLabel(song) }}</small></li></ol>
              <p v-if="selectedCourse.onlySinglePlayer" class="text-muted mb-0">{{ $t('filter.onlySinglePlayerInfo') }}</p>
            </div>
            <p v-if="locked" class="text-muted">{{ $t('challenges.courseLocked') }}</p>
            <label for="challenge-instructions" class="form-label">{{ $t('challenges.instructions') }}</label>
            <textarea id="challenge-instructions" v-model="form.instructions" class="form-control mb-3" maxlength="1000" rows="3"></textarea>
            <label for="challenge-status" class="form-label">{{ $t('challenges.state') }}</label>
            <select id="challenge-status" v-model="form.status" class="form-select mb-3">
              <option value="draft" :disabled="locked">{{ $t('challenges.status.draft') }}</option>
              <option value="open">{{ $t('challenges.status.open') }}</option>
              <option value="closed">{{ $t('challenges.status.closed') }}</option>
            </select>
            <button class="btn btn-primary" :disabled="saving"><i class="fa fa-save me-1"></i> {{ $t(saving ? 'challenges.saving' : 'filter.save') }}</button>
            <button v-if="selectedId" type="button" class="btn btn-secondary ms-2" :disabled="form.status === 'draft' || saving || !savedChallenge || savedChallenge.status === 'draft'" @click="shareVisible = true"><i class="fa fa-qrcode me-1"></i> {{ $t('challenges.shareQr') }}</button>
          </form>
        </template>
      </div>
    </div>
    <ShareModal :open="shareVisible" :url="shareUrl" :title="savedChallenge ? savedChallenge.title : $t('challenges.shareQr')" :view-path="'/challenge/' + selectedId" :view-label="$t('challenges.view')" :allow-download="true" @close="shareVisible = false" />
  </div>
</template>

<script>
import ShareModal from '@/components/UI/ShareModal.vue';
import { randomKey, courseChartLabel } from '@/util/helpers';

const emptyForm = () => ({ title: '', arcadeId: '', gameId: '', courseId: '', instructions: '', status: 'draft' });

export default {
  components: { ShareModal },
  data() {
    return { challenges: [], selectedId: '', draftId: '', form: emptyForm(), loading: true, saving: false, saved: false, error: '', shareVisible: false };
  },
  computed: {
    arcades() { return this.$store.getters['arcades/getArcades']; },
    games() {
      const arcade = this.arcades.find(value => value.id === this.form.arcadeId);
      return this.$store.getters['games/getGames'].filter(game => game.hasCourseMode && Object.values(arcade?.games || {}).includes(game.id));
    },
    courses() { return this.$store.getters['courses/getCourseByGame'](this.form.gameId); },
    savedChallenge() { return this.challenges.find(value => value.id === this.selectedId); },
    locked() { return Boolean(this.savedChallenge?.entryCount); },
    selectedCourse() { return this.locked ? this.savedChallenge.course : this.courses.find(value => value.id === this.form.courseId); },
    shareUrl() { return window.location.origin + '/challenge/' + this.selectedId; }
  },
  async created() {
    try {
      await Promise.all([this.$store.dispatch('arcades/loadArcades'), this.$store.dispatch('games/fetchGameSongs'), this.$store.dispatch('courses/loadCourses')]);
      this.challenges = await this.$store.dispatch('challenges/list', { admin: true });
    } catch (error) { this.showError(error); }
    finally { this.loading = false; }
  },
  methods: {
    showError(error) { this.error = this.$t('challenges.errors.' + (error.code || 'requestFailed')); },
    chartLabel(song) { return courseChartLabel(song, key => this.$t(key)); },
    selectChallenge() {
      this.form = this.savedChallenge ? { ...this.savedChallenge } : emptyForm();
      this.draftId = '';
      this.saved = false;
      this.error = '';
    },
    async save() {
      this.saving = true;
      this.error = '';
      this.saved = false;
      try {
        const id = this.selectedId || (this.draftId ||= randomKey());
        const challenge = await this.$store.dispatch('challenges/save', { id, title: this.form.title, arcadeId: this.form.arcadeId, gameId: this.form.gameId, courseId: this.form.courseId, instructions: this.form.instructions, status: this.form.status });
        this.challenges = [challenge, ...this.challenges.filter(value => value.id !== id)];
        this.selectedId = id;
        this.saved = true;
      } catch (error) { this.showError(error); }
      finally { this.saving = false; }
    }
  }
};
</script>
