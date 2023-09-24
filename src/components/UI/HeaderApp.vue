<template>
  <nav class="navbar navbar-dark bg-primary fixed-top">
    <div class="container-fluid">
<!--      check if current page is the home page, if so, don't show the back button-->
      <router-link v-if="$route.path !== '/welcome'" to="/" class="btn-menu text-white" href="#" type="button" role="button" exact><i class="fa fa-arrow-left me-2"></i></router-link>
      <router-link v-else to="/" class="navbar-brand" href="#">
        <img src="../../assets/svg/logo.svg" width="60" height="30" class="d-inline-block align-top" alt="">
      </router-link>
      <span class="d-none d-md-block me-auto weight-600 text-white">BMGRESS</span>

      <div class="d-flex">
        <button class="btn-lang p-0 me-3" type="button">
          <i @click="showDialog" class="fas fa-language fa-2x text-white"></i>
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
              <router-link @click="closeMenu" to="/" class="btn w-100 btn-light mb-2" href="#" type="button" role="button" exact>
                <i class="fa fa-home me-1"></i> {{ $t("menu.overview") }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link @click="closeMenu" to="/settings" class="btn w-100 btn-light mb-2" href="#" type="button" role="button" exact>
                <i class="fa fa-cogs me-1"></i> {{ $t("menu.settings") }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link @click="closeMenu" to="/arcade"  class="btn w-100 btn-light mb-2" href="#" type="button" role="button">
                <i class="fas fa-trophy me-1"></i> {{ $t("menu.arcadeRanking") }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link @click="closeMenu" to="/about" class="btn w-100 btn-light mb-2" href="#" type="button" role="button">
                <i class="fa fa-question me-1"></i> {{ $t("menu.aboutAndInfo") }}
              </router-link>
            </li>
            <li v-if="isAdmin" class="nav-item">
              <router-link @click="closeMenu" to="/admin" class="btn w-100 btn-light mb-2" href="#" type="button" role="button">
                <i class="fa fa-server me-1"></i> {{ $t("menu.admin") }}
              </router-link>
            </li>
            <li class="nav-item">
              <a @click="logout" class="w-100 btn btn-light text-danger mb-2">
                <i class="fa fa-sign-out-alt me-1"></i> {{ $t("menu.logout") }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <LanguageModal
        @close="hideDialog"
        :open="dialogIsVisible"
    />
  </nav>
</template>

<script>
import LanguageModal from "@/components/UI/LanguageModal";
export default {
  name: "HeaderApp",
  components: {
    LanguageModal
  },
  data() {
    return {
      isMenuOpen: false,
      dialogIsVisible: false,
    };
  },
  methods: {
    hideDialog() {
      this.dialogIsVisible = false;
    },
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
    showDialog() {
      this.dialogIsVisible = true;
    },
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
.btn-light {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.weight-600 {
  font-weight: 600;
  letter-spacing: .06em;
}
</style>
