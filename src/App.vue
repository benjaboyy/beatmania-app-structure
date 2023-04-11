<template>
  <header-app v-if="isAuthenticated"></header-app>
  <div v-if="!isLoaded" class="login-screen mt-5 px-2 mx-auto text-center">
      <h2>Loading...</h2>
  </div>
  <router-view v-if="isLoaded" @loaded="loaded" @data="dataGetter"></router-view>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      isLoaded: false,
    }
  },
  async created() {
    this.isLoaded = false;
    await this.$store.dispatch('tryLogin');
    if (this.isAuthenticated) {
      await this.dataGetter();
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
      await this.$store.dispatch('loadUserSongs');
      await this.$store.dispatch('loadTrackedGames');
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['isAuthenticated'];
    },
    didAutoLogout() {
      return this.$store.getters['didAutoLogout'];
    }
  },
  watch: {
    didAutoLogout(curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        this.$router.replace('/login');
      }
    }
  }
}
</script>
