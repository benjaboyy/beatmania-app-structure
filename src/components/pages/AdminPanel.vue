<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 class="text-center my-4">{{ $t('admin.adminPanel') }}</h1>
    <div class="container">
      <div class="row d-flex">
        <div class="col-12 col-md-5 mx-auto">
          <router-link to="/submitSong" class="btn w-100 btn-light me-2 mb-2" href="#" type="button" role="button">{{ $t('admin.updateSongs') }}</router-link>
          <router-link to="/submitGame" class="btn w-100 btn-light me-2 mb-2" href="#" type="button" role="button">{{ $t('admin.updateGames') }}</router-link>
          <router-link to="/submitCourse" class="btn w-100 btn-light me-2 mb-2" href="#" type="button" role="button">{{ $t('admin.updateCourses') }}</router-link>
          <router-link to="/submitArcade" class="btn w-100 btn-light me-2 mb-2" href="#" type="button" role="button">{{ $t('admin.updateArcades') }}</router-link>
          <router-link to="/submitAchievement" class="btn w-100 btn-light me-2 mb-2" href="#" type="button" role="button">{{ $t('admin.updateAchievements') }}</router-link>
          <router-link to="/users" class="btn w-100 btn-theme-1 me-2 mb-2" href="#" type="button" role="button"><i class="fas fa-user-friends me-2"></i> {{ $t('admin.userList') }}</router-link>
          <router-link to="/import" class="btn w-100 btn-theme-1 me-2 mb-2" href="#" type="button" role="button"><i class="fas fa-exchange-alt me-2"></i> {{ $t('admin.songToJson') }}</router-link>
          <a class="btn w-100 btn-primary me-2 mb-2" @click="testToken" href="#" type="button" role="button"><i class="fas fa-redo"></i> {{ $t('admin.updateStats') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPanel',
  props: {
    msg: String,
  },
  emits: ['select-view'],
  methods: {
    testToken() {
      this.$store.dispatch('refreshToken');
    }
  }
};
</script>
