<template>
  <div class="login-screen px-2 mx-auto">
    <div class="text-center mb-5">
      <img src="../../assets/svg/logo-full.svg" class="d-inline-block align-middle logo-scale" alt="">
      <h1 class="mb-0 d-none">Beatmania {{ $t("login.progressTracker") }}</h1>
    </div>
    <div class="card">
      <div class="card-body">
        <h1 class="text-primary">{{ $t("login.register") }}</h1>
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
            <div v-else id="emailHelp" class="form-text">{{ $t("login.emailIsSave") }}</div>
          </div>
          <div :class="!formIsValid && nameInvalid ? 'red' : ''" class="form-group">
            <label for="name">{{ $t("login.gametagName") }}</label>
            <input class="form-control" type="text" id="name" v-model="name" />
            <div v-if="nameInvalid" id="nameInvalid" class="form-text red">Please fill this field.</div>
            <div v-else id="nameHelp" class="form-text">{{ $t("login.nameInProfile") }}</div>
          </div>
          <div :class="!formIsValid && passwordInvalid ? 'red' : ''" class="form-group">
            <label for="password">{{ $t("login.password") }}</label>
            <input class="form-control" type="password" id="password" v-model="password" />
          </div>
          <div :class="!formIsValid && passwordInvalid ? 'red' : ''" class="form-group">
            <label for="confirmPassword">{{ $t("login.confirmPassword") }}</label>
            <input class="form-control" type="password" id="confirmPassword" v-model="confirmPassword" />
          </div>
          <div class="form-group mt-3">
            <button class="btn btn-primary"><i class="fa fa-paper-plane"></i> {{ $t("login.register") }}</button>
            <router-link to="/login" class="btn btn-outline-primary ms-2">{{ $t("login.goLogin") }}</router-link>
          </div>
        </form>
      </div>
      <div class="card-footer d-flex text-muted">
        <div class="select-lang" @click="showDialog"><i class="fas fa-globe"></i> {{ $t("login.selectLanguage") }}</div>
        <div class="ms-auto">{{ $t("login.version") }} 1.0.9</div>
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
  name: "RegisterUser",
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
      this.nameInvalid = false;
      this.passwordInvalid = false;

      const formData = {
        email: this.email,
        name: this.name,
        password: this.password,
      };
      if (this.email.trim().length === 0 || !this.email.includes('@')) {
        this.formIsValid = false;
        this.emailInvalid = true;
        return;
      }
      if (this.name.trim().length === 0) {
        this.formIsValid = false;
        this.nameInvalid = true;
        return;
      }
      if (this.password !== this.confirmPassword || this.password.trim().length < 6) {
        this.formIsValid = false;
        this.passwordInvalid = true;
        return;
      }
      try {
        if (this.formIsValid) {
          await this.$store.dispatch('registerUser', formData);
          this.$router.replace('/login');
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