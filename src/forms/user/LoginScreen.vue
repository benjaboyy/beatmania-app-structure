<template>
  <div class="login-screen px-2 mx-auto">
    <h1 class="text-center my-4">// LOGO //</h1>
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
            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div class="mb-4">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" v-model="password">
            <div v-if="passwordInvalid" class="text-warning" role="alert">Make sure the password is at least 6 characters long</div>

          </div>
          <button class="btn btn-primary">Login</button>
          <router-link to="/register" type="submit" class="btn btn-block btn-outline-primary ms-2"><i class="fa fa-sign-in-alt"></i> Register</router-link>
        </form>
      </div>
      <div class="card-footer text-end text-muted">
        Version 0.1
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
        this.$emit('data', true);
        await this.$store.dispatch('games/fetchGameSongs');
        await this.$store.dispatch('loadUser');
        await this.$store.dispatch('songs/loadSongs');
        await this.$store.dispatch('loadUserSongs');
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