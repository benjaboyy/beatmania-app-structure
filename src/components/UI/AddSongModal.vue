<template>
  <div v-if="open" class="backdrop" @click="$emit('close')"></div>
  <transition name="modal">
    <dialog open v-if="open">
      <h3>{{ infoSong.name }}</h3>
      <p>{{ infoSong.artist }}</p>
      <div class="input-group mb-3  input-group-lg" v-if="infoSong.difficultyNormal > 0">
        <span class="input-group-text text-white bg-theme-1 border-0">{{ infoSong.difficultyNormal }}</span>
        <input placeholder="Score" type="text" class="form-control" id="scoreNormal" v-model="scoreNormal" />
        <a class="btn" :class="normalClear ? 'bg-primary text-white' : 'bg-light text-primary'" @click="toggleNormalClear">Clear</a>
        <a class="btn" :class="normalFC ? 'bg-primary text-white flash' : 'bg-light text-primary'" @click="toggleNormalFC">FC</a>
      </div>
      <div class="input-group mb-3  input-group-lg" v-if="infoSong.difficultyHard > 0">
        <span class="input-group-text text-white bg-theme-2 border-0">{{ infoSong.difficultyHard }}</span>
        <input placeholder="Score" type="text" class="form-control" id="scoreHard" v-model="scoreHard" />
        <a class="btn" type="button" :class="hardClear ? 'bg-primary text-white' : 'bg-light text-primary'" @click="toggleHardClear">Clear</a>
        <a class="btn" type="button" :class="hardFC ? 'bg-primary text-white flash' : 'bg-light text-primary'" @click="toggleHardFC">FC</a>
      </div>
      <div class="input-group mb-3  input-group-lg" v-if="infoSong.difficultyAnother > 0">
        <span class="input-group-text text-white bg-theme-3 border-0">{{ infoSong.difficultyAnother }}</span>
        <input placeholder="Score" type="text" class="form-control" id="scoreAnother" v-model="scoreAnother" />
        <a class="btn" type="button" :class="anotherClear ? 'bg-primary text-white' : 'bg-light text-primary'" @click="toggleAnotherClear">Clear</a>
        <a class="btn" type="button" :class="anotherFC ? 'bg-primary text-white flash' : 'bg-light text-primary'" @click="toggleAnotherFC">FC</a>
      </div>
      <div class="d-grid gap-2">
        <button class="btn" @click="toggleFavorite" :class="favorite ? 'btn-primary' : 'bg-outline-primary'"><i class="fa fa-heart" :class="favorite ? 'text-white' : 'text-primary'"></i> Favorite</button>
        <button class="btn btn-dark" @click="hideDialog"><i class="fa fa-save text-white"></i> Save song</button>
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