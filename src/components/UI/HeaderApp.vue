<template>
  <nav class="navbar navbar-dark bg-primary fixed-top">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand" href="#">
        <img src="../../assets/svg/logo.svg" width="60" height="30" class="d-inline-block align-top" alt="">
      </router-link>

      <div class="d-flex">
        <button class="btn-lang p-0 me-3" type="button">
          <i @click="toggleLanguage" class="fas fa-language fa-2x text-white"></i>
        </button>

        <button class="btn-menu text-white" type="button" @click="toggleMenu" aria-controls="offcanvasDarkNavbar">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <div class="offcanvas offcanvas-end text-bg-primary" :class="{ 'show': isMenuOpen }" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">BMGress {{ $t("menu.app") }}</h5>
          <button type="button" class="btn-close btn-close-white" @click="toggleMenu" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1">
            <li class="nav-item">
              <router-link @click="closeMenu" to="/" class="nav-link btn btn-dark mb-2" href="#" type="button" role="button" exact>
                <i class="fa fa-home me-1"></i> {{ $t("menu.overview") }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link @click="closeMenu" to="/settings" class="nav-link btn btn-dark mb-2" href="#" type="button" role="button" exact>
                <i class="fa fa-cogs me-1"></i> {{ $t("menu.settings") }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link @click="closeMenu" to="/about" class="nav-link btn btn-dark mb-2" href="#" type="button" role="button">
                <i class="fa fa-question me-1"></i> {{ $t("menu.aboutAndInfo") }}
              </router-link>
            </li>
            <li v-if="isAdmin" class="nav-item">
              <router-link @click="closeMenu" to="/admin" class="nav-link btn btn-dark mb-2" href="#" type="button" role="button">
                <i class="fa fa-server me-1"></i> {{ $t("menu.admin") }}
              </router-link>
            </li>
            <li class="nav-item">
              <a @click="logout" class="nav-link btn btn-dark mb-2">
                <i class="fa fa-sign-out-alt me-1"></i> {{ $t("menu.logout") }}
              </a>
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
  data() {
    return {
      isMenuOpen: false
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.replace('/login');
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    toggleLanguage() {
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'ja' : 'en';
      this.$store.dispatch('updateLanguage', {
        language: this.$i18n.locale
      });
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters['isAdmin'];
    },
    isJapanese() {
      return this.$store.getters['getLanguage'];
    }
  }
}
</script>

<style scoped>
.btn-lang {
  background-color: rgba(0,0,0,0);
  border: none;
}
.btn-lang i {
  font-size: 2.5em;
  opacity: 0.7;
}
.btn-menu {
  background-color: rgba(0,0,0,0);
  border: none;
}
.btn-menu i {
  font-size: 1.9em;
  opacity: 0.7;
}
</style>
