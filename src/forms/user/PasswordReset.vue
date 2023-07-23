<template>
  <div class="login-screen px-2 mx-auto">
    <div class="text-center mb-5">
      <img src="../../assets/svg/logo-full.svg" class="d-inline-block align-middle logo-scale" alt="">
      <h1 class="mb-0 d-none">Beatmania {{ $t("login.progressTracker") }}</h1>
    </div>
    <div class="card">
      <div class="card-body">
        <h1 class="text-primary">{{ $t("login.resetUser") }}</h1>
        <form @submit.prevent="submitForm">
          <div v-if="!formIsValid" class="alert alert-danger" role="alert">
            {{ $t("login.formInvalid") }}
          </div>
          <div v-show="!!error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>
          <div :class="!formIsValid && emailInvalid ? 'red' : ''" class="form-group">
            <label for="email">{{ $t("login.email") }}</label>
            <input class="form-control" type="text" id="email" v-model="email" />
            <div v-if="emailInvalid" id="emailInvalid" class="form-text red">Pick a valid email address.</div>
            <div v-else id="emailHelp" class="form-text">{{ $t("login.emailWillBeSendToReset") }}</div>
          </div>
          <div class="form-group mt-3">
            <button class="btn btn-primary"><i class="fa fa-paper-plane"></i> {{ $t("login.sendReset") }}</button>
            <router-link to="/login" class="btn btn-outline-primary ms-2">{{ $t("login.goLogin") }}</router-link>
          </div>
        </form>
      </div>
      <div class="card-footer d-flex text-muted">
        <div class="select-lang" @click="showDialog"><i class="fas fa-globe"></i> {{ $t("login.selectLanguage") }}</div>
        <div class="ms-auto">{{ $t("login.version") }} 1.0.3</div>
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
  name: 'LoginScreen',
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
      nameInvalid: false,
      passwordInvalid: false,
      dialogIsVisible: false,
      error: null,
      name: '',
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
      this.emailInvalid = false;

      const formData = {
        email: this.email,
      };
      if (this.email.trim().length === 0 || !this.email.includes('@')) {
        this.formIsValid = false;
        this.emailInvalid = true;
        return;
      }
      try {
        if (this.formIsValid) {
          await this.$store.dispatch('passwordMailRequest', formData);
        }
      } catch (error) {
        this.error = error.message || 'Something went wrong'
      }
    }
  },
}
</script>

<style scoped>
  .red {
    color: red;
  }
  .logo-scale {
    width: 80%;
    max-width: 300px;
    height: auto;
  }
  .select-lang {
    cursor: pointer;
  }
</style>