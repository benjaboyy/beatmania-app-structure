<template>
  <div v-if="open" class="backdrop" @click="hideDialog"></div>
  <transition name="modal">
    <dialog class="window" open v-if="open">
      <h4><i class="fas fa-cog"></i> Edit modes <br> <small>{{ info.name }}</small></h4>
      <div class="my-4">
        <input class="form-control form-control-lg" type="text" placeholder="Arcade Code" v-model="arcadeCode" @input="updateArcadeCode(arcadeCode)">
      </div>
      <div class="d-grid mt-3 gap-2">
        <button class="btn btn-dark" @click="hideDialog">{{ $t("login.close") }}</button>
      </div>
    </dialog>
  </transition>
</template>

<script>
export default {
  name: 'ArcadeCodeSelectModal',
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {

    };
  },
  emits: ['close', 'updateTrackGames'],
  methods: {
    hideDialog() {
      this.$emit('close');
    },
    updateArcadeCode() {

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