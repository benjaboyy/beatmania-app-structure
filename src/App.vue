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
import '@/assets/main1.css'; // Load the default theme (lumen) CSS file

export default {
  name: 'App',
  data() {
    return {
      isLoaded: false,
      currentTheme: '1', // Default theme
      currentThemeLink: null, // Store the current theme link
    };
  },
  async created() {
    this.isLoaded = false;
    await this.$store.dispatch('tryLogin');
    if (this.isAuthenticated) {
      await this.dataGetter();
    } else {
      await this.$store.dispatch('games/fetchGameSongs');
    }
    this.isLoaded = true;
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
      this.$i18n.locale = await this.$store.getters['getLanguage'];
      this.currentTheme = await this.$store.getters['getTheme'];
      this.switchTheme(this.currentTheme);
    },
    switchTheme(themeName) {
      // Dynamically load the CSS file for the selected theme
      import(`@/assets/main${themeName}.css`)
          .then(() => {
            this.currentTheme = themeName;
          })
          .catch(error => {
            console.error(`Error loading theme CSS: ${error}`);
          });
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
