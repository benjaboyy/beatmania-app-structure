<template>
  <div class="stats-screen px-2 px-md-5 m-auto mb-5">
    <h1 class="text-center my-4">{{ $t('about.aboutApp') }}</h1>
    <div class="card">
      <div class="card-body">
        <h3>{{ $t('about.trackerApp') }}</h3>
        <p>{{ $t('about.trackerApp') }},<br>
          {{ $t('about.progressTracking') }}<br>
          {{ $t('about.arcadeHighScores') }}<br>
          {{ $t('about.translations') }}
        </p>
        <h5>{{ $t('about.keyFeatures') }}</h5>
        <ul>
          <li>{{ $t('about.progressTracking') }}</li>
          <li>{{ $t('about.arcadeHighScores') }}</li>
          <li>{{ $t('about.translations') }}</li>
        </ul>
        <h5>{{ $t('about.gamesSupported') }}</h5>
        <ul>
          <li v-for="game in games" :key="game.id">
            {{ game.name }} <br>
          </li>
        </ul>
        <div class="accordion my-4" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingFour">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseHow" aria-expanded="false" aria-controls="collapseHow">
                {{ $t('about.howToSubmit') }}
              </button>
            </h2>
            <div id="collapseHow" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <img src="../../assets/img/howto.png" class="w-100" alt="">
              </div>
            </div>
          </div>
        </div>
        <h5>{{ $t('about.info') }}:</h5>
        <p>{{ $t('about.setHomeScreen') }}</p>
        <div class="mb-2">
          <a href="https://github.com/benjaboyy/beatmania-app-structure" class="btn btn-outline-primary me-2 mt-2"><i class="fab fa-github me-2"></i> {{ $t('about.github') }}</a>
          <router-link to="/arcade" class="btn btn-outline-primary me-2 mt-2"><i class="fas fa-trophy me-2"></i> {{ $t('menu.arcadeRanking') }}</router-link>
          <router-link to="/tips" class="btn btn-outline-primary me-2 mt-2"><i class="fas fa-lightbulb me-2"></i> {{ $t('about.tipsTricks') }}</router-link>
        </div>
        <p>{{ $t('about.questionsFeedback') }} <a href="mailto:benjaboyy@hotmail.nl">benjaboyy@hotmail.nl</a>.<br>{{ $t('about.valueInput') }}<br><br>{{ $t('about.broughtBy') }} <a href="https://deschuurr.nl/?lang=en">deschuurr.nl</a></p>
        <p>{{ $t('about.notAffiliated') }}</p>
        <router-link to="/" class="btn btn-primary mb-2" href="#" type="button" role="button" exact><i class="fa fa-home me-2"></i> {{ $t("menu.back") }}</router-link>
      </div>
      <div class="card-footer d-flex text-muted">
        <div class="select-lang" @click="toggleLanguage"><i class="fas fa-globe"></i> {{ $t("login.selectLanguage") }}</div>
        <div class="ms-auto">{{ $t("login.version") }} 1.3.3</div>
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
