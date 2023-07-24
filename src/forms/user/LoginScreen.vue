<template>
  <div class="login-screen px-2 mx-auto">
    <div class="text-center mb-5">
      <img src="../../assets/svg/logo-full.svg" class="d-inline-block align-middle logo-scale" alt="">
      <h1 class="mb-0 d-none">Beatmania {{ $t("login.progressTracker") }}</h1>
    </div>
    <div class="card">
      <div class="card-body">
        <h1 class="text-primary">{{ $t("login.login") }}</h1>
        <div v-if="!formIsValid || error" class="alert alert-warning" role="alert">Something went wrong please try again</div>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">{{ $t("login.email") }}</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="email">
            <div v-if="emailInvalid" class="text-warning" role="alert">Email address is not valid</div>
          </div>
          <div class="mb-4">
            <label for="exampleInputPassword1" class="form-label">{{ $t("login.password") }}</label>
            <input type="password" class="form-control" id="exampleInputPassword1" v-model="password">
            <div v-if="passwordInvalid" class="text-warning" role="alert">Make sure the password is at least 6 characters long</div>
            <router-link to="/reset" type="submit" class="link-primary">{{ $t("login.passwordReset") }}</router-link>
          </div>
          <button class="btn btn-primary">{{ $t("login.login") }}</button>
          <router-link to="/register" type="submit" class="btn btn-block btn-outline-primary ms-2">{{ $t("login.register") }}</router-link>
          <router-link to="/about" type="submit" class="btn btn-block btn-link">{{ $t("login.aboutApp") }}</router-link>
        </form>
      </div>
      <div class="card-footer d-flex text-muted">
        <div class="select-lang" @click="showDialog"><i class="fas fa-globe"></i> {{ $t("login.selectLanguage") }}</div>
        <div class="ms-auto">{{ $t("login.version") }} 1.0.5</div>
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
        await this.$store.dispatch('games/fetchGameSongs');
        await this.$store.dispatch('loadUser');
        await this.$store.dispatch('songs/loadSongs');
        await this.$store.dispatch('courses/loadCourses');
        await this.$store.dispatch('loadUserSongs');
        await this.$store.dispatch('loadUserCourses');
        this.$emit('data', true);
        this.$router.replace('/welcome');
      } catch (error) {
        this.error = error.message || 'Something went wrong'
        this.formIsValid = false;
      }
    },
  },
}
</script>

<style scoped>
.logo-scale {
  width: 80%;
  max-width: 300px;
  height: auto;
}
.select-lang {
  cursor: pointer;
}
</style>