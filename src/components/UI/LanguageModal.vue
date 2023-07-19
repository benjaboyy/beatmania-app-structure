<template>
  <div v-if="open" class="backdrop" @click="hideDialog"></div>
  <transition name="modal">
    <dialog class="window" open v-if="open">
      <h3><i class="fas fa-globe"></i> {{ $t("login.selectLanguage") }}</h3>
      <div class="row g-3 pt-1">
        <div class="col-6">
          <button
              :class="$i18n.locale === 'en' ? 'btn-primary ' : 'btn-outline-primary'"
              class="btn py-4 w-100" @click="setLanguage('en')">English</button>
        </div>
        <div class="col-6">
          <button
              :class="$i18n.locale === 'ja' ? 'btn-primary ' : 'btn-outline-primary'"
              class="btn py-4 w-100" @click="setLanguage('ja')">日本語</button>
        </div>
        <div class="col-6 mt-3">
          <button
              :class="$i18n.locale === 'nl' ? 'btn-primary ' : 'btn-outline-primary'"
              class="btn py-4 w-100" @click="setLanguage('nl')">Nederlands</button>
        </div>
        <!--          <button-->
        <!--              :class="$i18n.locale === 'de' ? 'btn-primary ' : 'btn-outline-primary'"-->
        <!--              class="btn mt-2 w-100" @click="setLanguage('de')" disabled>Deutsch</button>-->
        <!--          <button-->
        <!--              :class="$i18n.locale === 'sp' ? 'btn-primary ' : 'btn-outline-primary'"-->
        <!--              class="btn mt-2 w-100" @click="setLanguage('sp')" disabled>Español</button>-->
      </div>
      <div class="d-grid mt-3 gap-2">
        <button class="btn btn-dark" @click="hideDialog">{{ $t("login.close") }}</button>
      </div>
    </dialog>
  </transition>
</template>

<script>
export default {
  props:
  {
    open: {
      type: Boolean,
      required: true
    },
    infoSong: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'addSongUser'],
  methods: {
    hideDialog() {
      this.$emit('close');
    },
    toggleLanguage() {
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'ja' : 'en';
      this.$store.dispatch('updateLanguage', {
        language: this.$i18n.locale
      });
    },
    setLanguage(language) {
      this.$i18n.locale = language;
      this.$store.dispatch('updateLanguage', {
        language: language
      });
    },
  },
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.75);
}

dialog {
  position: fixed;
  top: 10%;
  max-height: 80%;
  max-width: 600px;
  overflow: auto;
  width: 90%;
  margin: 0 auto;
  bottom: 20vh;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 0;
  padding: 1rem;
  background-color: white;
  z-index: 100;
  border: none;
  /*animation: modal 0.5s ease-out forwards;*/
}

.flash {
  animation: flash 0.6s infinite;
}
@keyframes flash {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.modal-enter-active {
  animation: modal 0.3s ease-out;
}

.modal-leave-active {
  animation: modal 0.3s ease-in reverse;
}

@keyframes modal {
  from {
    opacity: 0;
    transform: scale(0.75);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>