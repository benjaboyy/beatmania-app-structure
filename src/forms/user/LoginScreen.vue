<template>
  <div class="login-screen px-2 mx-auto">
    <div class="text-center mb-5">
      <img src="../../assets/svg/logo.svg" width="120" height="60" class="d-inline-block align-middle" alt="">
      <h1 class="mb-0">BMPT</h1>
    </div>
    <div class="card">
      <div class="card-body">
        <h1 class="text-primary">Login</h1>
        <div v-if="!formIsValid" class="alert alert-warning" role="alert">Something went wrong please try again</div>
        <div v-show="error" class="alert alert-warning" role="alert">Something went wrong please try again</div>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Email address</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="email">
            <div v-if="emailInvalid" class="text-warning" role="alert">Email address is not valid</div>
          </div>
          <div class="mb-4">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" v-model="password">
            <div v-if="passwordInvalid" class="text-warning" role="alert">Make sure the password is at least 6 characters long</div>

          </div>
          <button class="btn btn-primary">Login</button>
          <router-link to="/register" type="submit" class="btn btn-block btn-outline-primary ms-2">Register</router-link>
          <router-link to="/about" type="submit" class="btn btn-block btn-link">About app</router-link>
        </form>
      </div>
      <div class="card-footer text-end text-muted">
        Version 1.0.0
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['data'],
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      formIsValid: true,
      emailInvalid: false,
      passwordInvalid: false,
      error: null,
    };
  },
  methods: {
    async submitForm() {
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

</style>