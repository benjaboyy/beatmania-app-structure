<template>
  <div class="stats-screen px-2 px-md-5 m-auto mb-5">
    <div class="text-center py-4 mb-2">
      <img src="@/assets/svg/logo-full.svg" alt="App Logo" class="about-logo mb-2" />
      <h1 class="about-title">{{ $t('about.aboutApp') }}</h1>
    </div>
    <div class="card shadow-lg rounded-4 border-0">
      <div class="card-body p-4">
        <h3 class="mb-3 text-primary"><i class="fas fa-chart-line me-2"></i>{{ $t('about.trackerApp') }}</h3>
        <p class="lead mb-4">
          {{ $t('about.trackerApp') }},<br>
          {{ $t('about.progressTracking') }}<br>
          {{ $t('about.arcadeHighScores') }}<br>
          {{ $t('about.translations') }}
        </p>
        <hr>
        <h5 class="mt-4 text-success"><i class="fas fa-star me-2"></i>{{ $t('about.keyFeatures') }}</h5>
        <ul class="list-group list-group-flush mb-4">
          <li class="list-group-item bg-transparent border-0"><i class="fas fa-tasks me-2 text-info"></i>{{ $t('about.progressTracking') }}</li>
          <li class="list-group-item bg-transparent border-0"><i class="fas fa-trophy me-2 text-warning"></i>{{ $t('about.arcadeHighScores') }}</li>
          <li class="list-group-item bg-transparent border-0"><i class="fas fa-language me-2 text-secondary"></i>{{ $t('about.translations') }}</li>
        </ul>
        <hr>
        <h5 class="mt-4 text-primary"><i class="fas fa-gamepad me-2"></i>{{ $t('about.gamesSupported') }}</h5>
        <ul class="games-list d-flex flex-wrap gap-2 mb-4">
          <li v-for="game in games" :key="game.id" class="badge bg-gradient bg-info text-dark px-3 py-2 fs-6 shadow-sm">
            <i class="fas fa-music me-1"></i>{{ game.name }}
          </li>
        </ul>
        <div class="accordion my-4" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingFour">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseHow" aria-expanded="false" aria-controls="collapseHow">
                <i class="fas fa-question-circle me-2"></i>{{ $t('about.howToSubmit') }}
              </button>
            </h2>
            <div id="collapseHow" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
              <div class="accordion-body text-center">
                <img src="../../assets/img/howto.png" class="w-75 rounded-3 shadow-sm" alt="How to submit">
              </div>
            </div>
          </div>
        </div>
        <h5 class="mt-4 text-secondary"><i class="fas fa-info-circle me-2"></i>{{ $t('about.info') }}:</h5>
        <p>{{ $t('about.setHomeScreen') }}</p>
        <div class="mb-3 d-flex flex-wrap gap-2">
          <a href="https://github.com/benjaboyy/beatmania-app-structure" class="btn btn-outline-primary"><i class="fab fa-github me-2"></i>{{ $t('about.github') }}</a>
          <router-link to="/arcade" class="btn btn-outline-warning"><i class="fas fa-trophy me-2"></i>{{ $t('menu.arcadeRanking') }}</router-link>
          <router-link to="/tips" class="btn btn-outline-success"><i class="fas fa-lightbulb me-2"></i>{{ $t('about.tipsTricks') }}</router-link>
        </div>
        <p class="mt-3">{{ $t('about.questionsFeedback') }} <a href="mailto:benjaboyy@hotmail.nl">benjaboyy@hotmail.nl</a>.<br>{{ $t('about.valueInput') }}<br><br>{{ $t('about.broughtBy') }} <a href="https://deschuurr.nl/?lang=en">deschuurr.nl</a></p>
        <p class="text-danger fw-bold">{{ $t('about.notAffiliated') }}</p>
        <router-link to="/" class="btn btn-primary mb-2" type="button" role="button" exact><i class="fa fa-home me-2"></i>{{ $t("menu.back") }}</router-link>
      </div>
      <div class="card-footer d-flex text-muted align-items-center bg-light rounded-bottom-4">
        <div class="me-auto px-3 py-2">DeSchuurr &copy; {{ new Date().getFullYear() }}</div>
        <div class="ms-auto px-3 py-2">{{ $t("login.version") }} <span class="fw-bold">1.3.3</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import info from '@/assets/locales/info.js'
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
  },
};
</script>

<style scoped>
  .about-logo {
    height: 130px;
    object-fit: contain;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.12));
  }
  .about-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-top: 0.8rem;
    color: #589de1;
  }
  .games-list {
    list-style: none;
    padding-left: 0;
  }
  .card {
    animation: fadeIn 0.7s;
  }
  .accordion {
    max-width: 600px;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: none; }
  }
</style>
