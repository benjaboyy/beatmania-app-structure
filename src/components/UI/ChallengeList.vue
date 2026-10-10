<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex align-items-center mb-3">
        <h3 class="mb-0">{{ $t('challenges.challenges') }}</h3>
        <button type="button" class="btn btn-secondary ms-auto" :disabled="loading" @click="load" :aria-label="$t('welcomeScreen.reload')"><i class="fa fa-sync-alt"></i></button>
      </div>
      <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
      <p v-if="loading" role="status">{{ $t('challenges.loading') }}</p>
      <p v-else-if="!challenges.length" class="mb-0">{{ $t('challenges.noChallenges') }}</p>
      <router-link v-for="challenge in challenges" :key="challenge.id" :to="'/challenge/' + challenge.id" class="btn btn-light w-100 text-start mt-2">
        <span class="d-flex align-items-center gap-2"><strong class="me-auto">{{ challenge.title }}</strong><span class="badge" :class="challenge.status === 'open' ? 'bg-primary' : 'bg-secondary'">{{ $t('challenges.status.' + challenge.status) }}</span></span>
        <small>{{ challenge.gameName }} · {{ challenge.course.name }} · {{ $t('filter.' + challenge.course.type) }}</small>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: { arcadeId: { type: String, required: true }, gameId: { type: String, default: '' } },
  data() { return { challenges: [], loading: false, error: '' }; },
  created() { this.load(); },
  methods: {
    async load() {
      const arcadeId = this.arcadeId;
      const gameId = this.gameId;
      this.loading = true;
      this.error = '';
      try {
        const challenges = await this.$store.dispatch('challenges/list', { arcadeId, gameId });
        if (this.arcadeId === arcadeId && this.gameId === gameId) this.challenges = challenges;
      } catch (error) { this.error = this.$t('challenges.errors.' + (error.code || 'requestFailed')); }
      finally { this.loading = false; }
    }
  },
  watch: { arcadeId() { this.load(); }, gameId() { this.load(); } }
};
</script>
