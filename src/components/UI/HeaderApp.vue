<template>
      <nav class="navbar navbar-dark bg-primary fixed-top">
        <div class="container-fluid">
          <router-link to="/" class="navbar-brand" href="#">
            <img src="../../assets/svg/logo.svg" width="60" height="30" class="d-inline-block align-top" alt="">
          </router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="offcanvas offcanvas-end text-bg-primary" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">BMGress app</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end flex-grow-1">
                <li class="nav-item">
                  <router-link to="/" class="nav-link btn btn-dark mb-2" href="#" type="button" role="button" exact><i class="fa fa-home"></i> Overview</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/settings" class="nav-link btn btn-dark mb-2" href="#" type="button" role="button" exact><i class="fa fa-cog"></i> Settings</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/about" class="nav-link btn btn-dark mb-2" href="#" type="button" role="button"><i class="fa fa-question"></i> About & Info</router-link>
                </li>
                <li class="nav-item">
                  <a @click="logout" class="nav-link btn btn-dark mb-2"><i class="fa fa-sign-out-alt"></i> Logout</a>
                </li>
              </ul>
            </div>
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