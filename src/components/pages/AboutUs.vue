<template>
  <div class="stats-screen px-2 px-md-5 m-auto mb-5">
    <h1 class="text-center my-4">About the app</h1>
    <div class="card">
      <div class="card-body">
        <h3>Beatmania Progress Tracker App</h3>
        <p>Welcome to the Beatmania Progress Tracker App,<br>
          A app is designed to enhance your arcade experience by providing a simple way to track your progress and scores in multiple rhythm games which do not support tracking native.
          This app is to help you stay organized and motivated while playing older rhythm games.
          I have developed this app free and open-source, to provide a tool at first for Beatmania players and i will keep adding titles in the future.
        </p>
          <h5>Key Features:</h5>
        <ul>
          <li>Progress Tracking: Keep track of your scores, progress and achievements.</li>
          <li>Arcade high scores: Keep track of your high scores in your local arcade.</li>
          <li>Translations: Available in English and Japanese.</li>
        </ul>

        <h5>Games supported:</h5>
        <ul>
          <li v-for="game in games" :key="game.id">
            {{ game.name }} <br>
          </li>
        </ul>

        <div class="accordion my-4" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingFour">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseHow" aria-expanded="false" aria-controls="collapseHow">
                How to submit
              </button>
            </h2>
            <div id="collapseHow" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <img src="../../assets/img/howto.png" class="w-100" alt="">
              </div>
            </div>
          </div>
        </div>

        <h5>Info:</h5>
        <p>Set the app to your home screen or use the website and start tracking your progress in Beatmania!</p>
        <div class="mb-2">
          <a href="https://github.com/benjaboyy/beatmania-app-structure" class="btn btn-outline-primary me-2 mt-2"><i class="fab fa-github me-2"></i> Github</a>
          <router-link to="/arcade" class="btn btn-outline-primary me-2 mt-2"><i class="fas fa-trophy me-2"></i> Arcade Ranking</router-link>
          <router-link to="/tips" class="btn btn-outline-primary me-2 mt-2"><i class="fas fa-lightbulb me-2"></i> Tips & Tricks</router-link>
        </div>
        <p>For any questions or feedback, <br>please reach out to us at <a href="mailto:benjaboyy@hotmail.nl">benjaboyy@hotmail.nl</a>.
          <br>We value your input and are continuously working to improve the app for the community. <br><br>
            Brought you by <a href="https://deschuurr.nl/?lang=en">deschuurr.nl</a>
          </p>
        <p>
          The app is not affiliated with Konami or any other company.
        </p>
        <router-link to="/" class="btn btn-primary mb-2" href="#" type="button" role="button" exact><i class="fa fa-home me-2"></i> {{ $t("menu.back") }}</router-link>
      </div>
      <div class="card-footer d-flex text-muted">
        <div class="select-lang" @click="toggleLanguage"><i class="fas fa-globe"></i> {{ $t("login.selectLanguage") }}</div>
        <div class="ms-auto">{{ $t("login.version") }} 1.0.9</div>
      </div>
    </div>
  </div>
</template>

<script>
import info from '@/assets/locales/info.js' // import common locale messages
export default {
  name: 'AdminUs',
  props: {
    msg: String,
  },
  emits: ['select-view'],
  methods: {
    toggleLanguage() {
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'ja' : 'en';
    },
  },
  computed: {
    games() {
      return this.$store.getters['games/getGames'];
    },
  },
  i18n: {
    sharedMessages: info
  }
};
</script>

<style scoped>
  .select-lang {
    cursor: pointer;
  }
</style>
