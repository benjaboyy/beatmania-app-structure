<template>
  <div class="login-screen px-2 mx-auto">
    <div class="text-center my-5">
      <img src="../../assets/svg/logo.svg" width="120" height="60" class="d-inline-block align-middle" alt="">
      <h1 class="mb-0">BMPT</h1>
    </div>
    <div class="card">
      <div class="card-body">
        <h1 class="text-primary">register</h1>
        <form @submit.prevent="submitForm">
          <div v-if="!formIsValid" class="alert alert-danger" role="alert">
            Form is not valid
          </div>
          <div v-show="!!error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>
          <div :class="!formIsValid && emailInvalid ? 'red' : ''" class="form-group">
            <label for="email">Email</label>
            <input class="form-control" type="text" id="email" v-model="email" />
            <div v-if="emailInvalid" id="emailInvalid" class="form-text red">Pick a valid email address.</div>
            <div v-else id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div :class="!formIsValid && nameInvalid ? 'red' : ''" class="form-group">
            <label for="name">Game tag / name</label>
            <input class="form-control" type="text" id="name" v-model="name" />
            <div v-if="nameInvalid" id="nameInvalid" class="form-text red">Please fill this field.</div>
            <div v-else id="nameHelp" class="form-text">Will be displayed in your profile.</div>
          </div>
          <div :class="!formIsValid && passwordInvalid ? 'red' : ''" class="form-group">
            <label for="password">Password</label>
            <input class="form-control" type="password" id="password" v-model="password" />
            <div id="passwordHelp" class="form-text">Will be displayed in your profile.</div>
          </div>
          <div :class="!formIsValid && passwordInvalid ? 'red' : ''" class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input class="form-control" type="password" id="confirmPassword" v-model="confirmPassword" />
          </div>
          <div class="form-group mt-3">
            <button class="btn btn-primary"><i class="fa fa-star"></i> Make account</button>
            <router-link to="/login" class="btn btn-outline-primary ms-2">Go to Login</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      formIsValid: true,
      emailInvalid: false,
      nameInvalid: false,
      passwordInvalid: false,
      error: null,
      name: '',
    };
  },
  methods: {
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
</style>