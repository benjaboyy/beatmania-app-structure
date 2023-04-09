<template>
  <div class="login-screen px-2 mx-auto">
    <h1 class="text-center my-4">// LOGO //</h1>
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
          </div>
          <div :class="!formIsValid && nameInvalid ? 'red' : ''" class="form-group">
            <label for="name">Name</label>
            <input class="form-control" type="text" id="name" v-model="name" />
          </div>
          <div :class="!formIsValid && passwordInvalid ? 'red' : ''" class="form-group">
            <label for="password">Password</label>
            <input class="form-control" type="password" id="password" v-model="password" />
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
      const formData = {
        email: this.email,
        name: this.name,
        password: this.password,
      };
      if (this.password !== this.confirmPassword || this.password.trim().length < 6) {
        this.formIsValid = false;
        this.passwordInvalid = true;
        return;
      }
      if (this.email.trim().length === 0 || !this.email.includes('@')) {
        this.formIsValid = false;
        this.emailInvalid = true;
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