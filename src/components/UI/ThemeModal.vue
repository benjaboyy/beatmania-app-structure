<template>
  <div v-if="open" class="backdrop" @click="hideDialog"></div>
  <transition name="modal">
    <dialog class="window" open v-if="open">
      <h3><i class="fas fa-globe"></i> {{ $t("settings.selectTheme") }}</h3>
      <div class="row g-3 pt-1">
        <div class="col-6">
          <button
              :class="currentTheme === '1' ? 'btn-primary ' : 'btn-outline-primary'"
              class="btn py-4 w-100" @click="setTheme('1')">Lumen</button>
        </div>
        <div class="col-6">
          <button
              :class="currentTheme === '2' ? 'btn-primary ' : 'btn-outline-primary'"
              class="btn py-4 w-100" @click="setTheme('2')">Space</button>
        </div>
        <div class="col-6">
          <button
              :class="currentTheme === '3' ? 'btn-primary ' : 'btn-outline-primary'"
              class="btn py-4 w-100" @click="setTheme('3')">Scrapbook</button>
        </div>
        <div class="col-6">
          <button
              :class="currentTheme === '4' ? 'btn-primary ' : 'btn-outline-primary'"
              class="btn py-4 w-100" @click="setTheme('4')">Bloom</button>
        </div>
      </div>
      <div class="d-grid mt-3 gap-2">
        <button class="btn btn-dark" @click="hideDialog">Save & {{ $t("login.close") }}</button>
      </div>
    </dialog>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      currentTheme: '1',
    };
  },
  props:
  {
    open: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  methods: {
    hideDialog() {
      this.$emit('close');
    },
    setTheme(theme) {
      this.currentTheme = theme;
      this.$store.dispatch('updateTheme', {
        theme: theme
      });
    },
  },
  watch: {
    open() {
      this.currentTheme = this.$store.getters['getTheme'];
    }
  }
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