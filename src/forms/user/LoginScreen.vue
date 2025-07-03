<template>
  <div class="w-100">
    <div class="container">
      <div class="row">
        <div class="col-md-5 pb-4 text-white">
          <img src="../../assets/svg/logo-full.svg" class="d-inline-block align-middle logo-scale" alt="">
          <h1 class="display-5 my-4">{{ $t("login.progressTracker") }}</h1>
          <p class="text-white">Providing a simple way to track your progress and scores in multiple rhythm games which do not support tracking native</p>
          <p class="text-white i">{{ $t("login.version") }} {{ $t("version") }} - <a href="#games" class="text-white">Supported games</a></p>
          <a class="btn btn-light px-4 me-1" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">{{ $t("login.login") }}</a> or
          <router-link to="/register" type="submit" class="btn btn-block  px-4 btn-outline-light ms-1">{{ $t("login.register") }}</router-link>
        </div>
        <div class="col-md-7">
          <div class="nav nav-pills justify-content-end mb-3 d-none d-md-flex">
            <div class="nav-item">
              <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">
                <i class="fas fa-sign-in-alt me-1"></i>
                {{ $t("login.login") }}
              </a>
            </div>
            <div class="nav-item">
              <div class="nav-link" @click="showDialog">
                <i class="fas fa-globe me-1"></i>
                {{ $t("login.selectLanguage") }}
              </div>
            </div>
          </div>

          <div id="carouselExampleIndicators" class="carousel slide">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="https://deschuurr.nl/wp-content/uploads/2025/03/Scherm­afbeelding-2025-03-23-om-19.13.53.png" class="d-block w-100" alt="...">
              </div>
              <div class="carousel-item">
                <img src="https://deschuurr.nl/wp-content/uploads/2025/03/Scherm­afbeelding-2025-03-23-om-19.16.23.png" class="d-block w-100" alt="...">
              </div>
              <div class="carousel-item">
                <img src="https://deschuurr.nl/wp-content/uploads/2025/03/Scherm­afbeelding-2025-03-23-om-19.12.15.png" class="d-block w-100" alt="...">
              </div>
              <div class="carousel-item">
                <img src="https://deschuurr.nl/wp-content/uploads/2025/03/Scherm­afbeelding-2025-03-23-om-19.17.29.png" class="d-block w-100" alt="...">
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>

        </div>
      </div>
    </div>
    <div class="bg-white">
      <div class="container py-5">
        <h2 class="my-4 text-black display-6">Key Features:</h2>
        <div class="row">
          <div class="col-md-4 my-md-3">
            <h4><i class="fas fa-chart-line me-2 text-theme-2"></i>Progress Tracking</h4>
            <p>Keep track of your scores, progress and achievements. Set goals, favorites and use multiple filters to find your songs.</p>
          </div>
          <div class="col-md-4 my-md-3">
            <h4><i class="fas fa-trophy me-2 text-theme-1"></i>Arcade rankings</h4>
            <p>Keep track of your high scores in your local arcade. Add locations and compare your scores with others.</p>
          </div>
          <div class="col-md-4 my-md-3">
            <h4><i class="fas fa-code me-2 text-theme-4"></i>Open Source</h4>
            <p>Free and open-source, to provide a tool at first for Beatmania players and i will keep adding titles in the future.</p>
          </div>
          <div class="col-md-4 my-md-3">
            <h4><i class="fas fa-language me-2 text-theme-3"></i>Translations</h4>
            <p>Available in English and Japanese.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="container py-5" id="games">
      <h2 class="mb-4 text-white display-6">Supported games:</h2>
      <div class="row">
        <div class="col-lg-3 col-md-4 col-6" v-for="game in games" :key="game.id">
          <div class="card h-100">
            <img v-if="game.url" :src="game.url" class="card-img-top" :alt="game.url">
            <div v-else class="card-img-top bg-info"></div>
            <div class="card-body text-center">
              <h5 class="card-title mb-0">{{ game.name }}</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="text-white">
        Copyright © {{ new Date().getFullYear() }} - <a href="https://deschuurr.nl/?lang=en" class="text-white">deschuurr.nl</a>
      </div>
    </div>
    <div class="modal" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
          <h1 class="text-primary">{{ $t("login.login") }}</h1>
          <div v-if="!formIsValid || error" class="alert alert-warning" role="alert">Something went wrong please try again</div>
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="email" class="form-label">{{ $t("login.email") }}</label>
              <input type="email" class="form-control" id="email" aria-describedby="emailHelp" v-model="email">
              <div v-if="emailInvalid" class="text-warning" role="alert">Email address is not valid</div>
            </div>
            <div class="mb-4">
              <label for="password" class="form-label">{{ $t("login.password") }}</label>
              <input type="password" class="form-control" id="password" v-model="password">
              <div v-if="passwordInvalid" class="text-warning" role="alert">Make sure the password is at least 6 characters long</div>
              <router-link to="/reset" type="submit" class="link-primary">{{ $t("login.passwordReset") }}</router-link>
            </div>
            <button class="btn btn-primary">{{ $t("login.login") }}</button>
          </form>
        </div>
      </div>
    </div>
      <LanguageModal
          @close="hideDialog"
          :open="dialogIsVisible"
      />
  </div>
</template>

<script>
import LanguageModal from "@/components/UI/LanguageModal";
export default {
  emits: ['data'],
  components: {
    LanguageModal,
  },
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      formIsValid: true,
      emailInvalid: false,
      passwordInvalid: false,
      dialogIsVisible: false,
      error: null,
    };
  },
  methods: {
    appendLogoUrl(url) {
      if (url.includes('http')) {
        return url;
      }
      return require(`@/assets/img/banners/${url}`);
    },
    showDialog() {
      this.dialogIsVisible = true;
    },
    hideDialog() {
      this.dialogIsVisible = false;
    },
    async submitForm() {
      this.formIsValid = true;
      const formData = {
        email: this.email,
        password: this.password,
      };
      if (this.email.trim().length < 1 || !this.email.includes('@')) {
        this.formIsValid = false;
        this.emailInvalid = true;
        return;
      }
      try {
        if (this.formIsValid) {
          await this.$store.dispatch('login', formData);
        }
        // hide loginModal via javascript (remove modal-backdrop show)
        document.querySelector('.modal-backdrop').remove();
        document.querySelector('body').style = '';
        this.$router.replace('/welcome');
      } catch (error) {
        this.error = error.message || 'Something went wrong'
        this.formIsValid = false;
      }
    },
  },
  computed: {
    games() {
      return this.$store.getters['games/getGames'];
    },
  },
}
</script>

<style>
html, body {
  background-color: #0d5470 !important;
}
* {
  scroll-behavior: smooth;
}
</style>

<style scoped>
.card-img-top {
  aspect-ratio: 2/1;
  object-fit: cover;
}
.logo-scale {
  width: 80%;
  max-width: 200px;
  height: auto;
}
.nav-link {
  color: white !important;
}
.carousel {
  margin-bottom: -3rem;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(0, 0, 0, 0.225);
}
.col-md-4 {
  margin-bottom: 1rem;
}
.select-lang {
  cursor: pointer;
}
</style>