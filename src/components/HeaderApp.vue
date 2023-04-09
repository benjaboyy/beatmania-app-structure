<template>
  <nav class="navbar navbar-light bg-primary ">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand" href="#">
        <img src="./../assets/svg/logo.svg" width="60" height="30" class="d-inline-block align-top" alt="">
      </router-link>
      <div class="d-flex">
        <router-link to="/" class="btn btn-light border-primary" href="#" type="button" role="button"><i class="fa fa-home"></i></router-link>
        <router-link to="/settings" class="btn btn-light border-primary ms-2" href="#" type="button" role="button"><i class="fa fa-cog"></i></router-link>
        <button @click="logout" class="btn btn-light border-primary ms-2"><i class="fa fa-sign-out-alt"></i></button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "HeaderApp",
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.replace('/login');
    }
  }
}
</script>

<style scoped>

</style>