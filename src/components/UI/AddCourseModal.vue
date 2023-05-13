<template>
  <div v-if="open" class="backdrop" @click="$emit('close')"></div>
  <transition name="modal">
    <dialog open v-if="open">
      TEST
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
  data() {
    return {
      scoreNormal: '',
      normalFC: false,
      normalClear: false,
      scoreHard: '',
      hardFC: false,
      hardClear: false,
      scoreAnother: '',
      anotherFC: false,
      anotherClear: false,
      scoreDoubleNormal: '',
      normalDoubleFC: false,
      normalDoubleClear: false,
      scoreDoubleHard: '',
      hardDoubleFC: false,
      hardDoubleClear: false,
      scoreDoubleAnother: '',
      anotherDoubleFC: false,
      anotherDoubleClear: false,
      favorite: false
    }
  },
  methods: {
    hideDialog() {
      this.$emit('close');
      this.$emit('addSongUser', {
        id: this.infoSong.id,
        artist: this.infoSong.artist,
        scoreNormal: this.scoreNormal,
        normalFC: this.normalFC,
        normalClear: this.normalClear,
        scoreHard: this.scoreHard,
        hardFC: this.hardFC,
        hardClear: this.hardClear,
        scoreAnother: this.scoreAnother,
        anotherFC: this.anotherFC,
        anotherClear: this.anotherClear,
        scoreDoubleNormal: this.scoreDoubleNormal,
        normalDoubleFC: this.normalDoubleFC,
        normalDoubleClear: this.normalDoubleClear,
        scoreDoubleHard: this.scoreDoubleHard,
        hardDoubleFC: this.hardDoubleFC,
        hardDoubleClear: this.hardDoubleClear,
        scoreDoubleAnother: this.scoreDoubleAnother,
        anotherDoubleFC: this.anotherDoubleFC,
        anotherDoubleClear: this.anotherDoubleClear,
        favorite: this.favorite
      });

    },
    toggleNormalFC() {
      this.normalFC = !this.normalFC;
    },
    toggleNormalClear() {
      this.normalClear = !this.normalClear;
    },
    toggleHardFC() {
      this.hardFC = !this.hardFC;
    },
    toggleHardClear() {
      this.hardClear = !this.hardClear;
    },
    toggleAnotherFC() {
      this.anotherFC = !this.anotherFC;
    },
    toggleAnotherClear() {
      this.anotherClear = !this.anotherClear;
    },
    toggleNormalDoubleFC() {
      this.normalDoubleFC = !this.normalDoubleFC;
    },
    toggleNormalDoubleClear() {
      this.normalDoubleClear = !this.normalDoubleClear;
    },
    toggleHardDoubleFC() {
      this.hardDoubleFC = !this.hardDoubleFC;
    },
    toggleHardDoubleClear() {
      this.hardDoubleClear = !this.hardDoubleClear;
    },
    toggleAnotherDoubleFC() {
      this.anotherDoubleFC = !this.anotherDoubleFC;
    },
    toggleAnotherDoubleClear() {
      this.anotherDoubleClear = !this.anotherDoubleClear;
    },
    toggleFavorite() {
      this.favorite = !this.favorite;
    }
  },
  watch: {
    open() {
      if (this.open) {
        this.scoreNormal = this.infoSong.normalScore
        this.normalFC = this.infoSong.normalFC;
        this.normalClear = this.infoSong.normalClear;
        this.scoreHard = this.infoSong.hardScore;
        this.hardFC = this.infoSong.hardFC;
        this.hardClear = this.infoSong.hardClear;
        this.scoreAnother = this.infoSong.anotherScore;
        this.anotherFC = this.infoSong.anotherFC;
        this.anotherClear = this.infoSong.anotherClear;
        this.scoreDoubleNormal = this.infoSong.scoreDoubleNormal;
        this.normalDoubleFC = this.infoSong.normalDoubleFC;
        this.normalDoubleClear = this.infoSong.normalDoubleClear;
        this.scoreDoubleHard = this.infoSong.scoreDoubleHard;
        this.hardDoubleFC = this.infoSong.hardDoubleFC;
        this.hardDoubleClear = this.infoSong.hardDoubleClear;
        this.scoreDoubleAnother = this.infoSong.scoreDoubleAnother;
        this.anotherDoubleFC = this.infoSong.anotherDoubleFC;
        this.anotherDoubleClear = this.infoSong.anotherDoubleClear;
        this.favorite = this.infoSong.favorite;
      }
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
  top: 20vh;
  width: 100%;
  margin: 0;
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