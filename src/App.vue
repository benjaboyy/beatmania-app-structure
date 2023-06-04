<template>
  <header-app v-if="isAuthenticated"></header-app>
  <div v-if="!isLoaded" class="login-screen mt-5 pt-5 px-2 mx-auto text-center">
    <h1 class="display-2"><i class="fa fa-compact-disc fa-spin"></i></h1>
    <h2>Loading...</h2>
  </div>
  <div class="mt-5 pt-3">
    <router-view v-if="isLoaded" @loaded="loaded" @data="dataGetter"></router-view>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import icon192 from '@/assets/img/icon-192.png';
// eslint-disable-next-line no-unused-vars
import icon512 from '@/assets/img/icon-512.png';
export default {
  name: 'App',
  data() {
    return {
      isLoaded: false,
    };
  },
  async created() {
    this.isLoaded = false;
    await this.$store.dispatch('tryLogin');
    if (this.isAuthenticated) {
      await this.dataGetter();
    }
    this.isLoaded = true;

    // Prevent the screen from going dark
    document.addEventListener('DOMContentLoaded', () => {
      if (document.visibilityState === 'visible') {
        this.keepScreenOn(true);
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.keepScreenOn(true);
      } else {
        this.keepScreenOn(false);
      }
    });
  },
  methods: {
    loaded() {
      this.isLoaded = true;
    },
    async dataGetter() {
      await this.$store.dispatch('games/fetchGameSongs');
      await this.$store.dispatch('loadUser');
      await this.$store.dispatch('songs/loadSongs');
      await this.$store.dispatch('courses/loadCourses');
      await this.$store.dispatch('loadUserSongs');
      await this.$store.dispatch('loadTrackedGames');
      await this.$store.dispatch('loadUserCourses');
    },
    keepScreenOn(shouldKeepOn) {
      if (shouldKeepOn) {
        // Prevent the screen from going dark
        document.defaultView?.wakeLock?.request('screen');
      } else {
        // Allow the screen to go dark
        document.defaultView?.wakeLock?.release();
      }
    },
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['isAuthenticated'];
    },
    didAutoLogout() {
      return this.$store.getters['didAutoLogout'];
    },
  },
  watch: {
    didAutoLogout(curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        this.$router.replace('/login');
      }
    },
  },
};
</script>
