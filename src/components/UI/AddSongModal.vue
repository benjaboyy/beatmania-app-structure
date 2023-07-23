<template>
  <div v-if="open" class="backdrop" @click="hideDialog"></div>
  <transition name="modal">
    <dialog class="window" open v-if="open">
      <h3>{{ infoSong.name }}</h3>
      <p>{{ infoSong.artist }}</p>
      <ul class="nav nav-tabs d-lg-none">
        <li class="nav-item">
          <a @click="toggleTypeselected" class="nav-link" aria-current="page" :class="typeSelected === 'singles' ? 'active' : ''">Singles</a>
        </li>
        <li class="nav-item">
          <a @click="toggleTypeselected" class="nav-link" :class="typeSelected === 'doubles' ? 'active' : ''">Doubles</a>
        </li>
      </ul>
      <div class="row">
        <div class="col-12 col-lg-6" :class="typeSelected === 'singles' ? '' : ' d-none d-lg-block'">
          <p class="my-2">{{ $t("filter.singles") }}</p>
          <div class="input-group mb-2  input-group-lg" v-if="infoSong.difficultyNormal > 0">
            <span class="input-group-text text-white bg-theme-1 border-0">{{ infoSong.difficultyNormal }}</span>
            <input placeholder="Score" type="text" class="form-control" id="scoreNormal" v-model="scoreNormal" />
            <a class="btn" :class="normalClear ? 'bg-primary text-white' : 'bg-light text-primary'" @click="toggleNormalClear">{{ $t("filter.cleared") }}</a>
            <a class="btn" :class="normalFC ? 'bg-primary text-white flash' : 'bg-light text-primary'" @click="toggleNormalFC">{{ $t("filter.fullComboShort") }}</a>
          </div>
          <div class="input-group mb-2  input-group-lg" v-if="infoSong.difficultyHard > 0">
            <span class="input-group-text text-white bg-theme-2 border-0">{{ infoSong.difficultyHard }}</span>
            <input placeholder="Score" type="text" class="form-control" id="scoreHard" v-model="scoreHard" />
            <a class="btn" type="button" :class="hardClear ? 'bg-primary text-white' : 'bg-light text-primary'" @click="toggleHardClear">{{ $t("filter.cleared") }}</a>
            <a class="btn" type="button" :class="hardFC ? 'bg-primary text-white flash' : 'bg-light text-primary'" @click="toggleHardFC">{{ $t("filter.fullComboShort") }}</a>
          </div>
          <div class="input-group mb-2  input-group-lg" v-if="infoSong.difficultyAnother > 0">
            <span class="input-group-text text-white bg-theme-3 border-0">{{ infoSong.difficultyAnother }}</span>
            <input placeholder="Score" type="text" class="form-control" id="scoreAnother" v-model="scoreAnother" />
            <a class="btn" type="button" :class="anotherClear ? 'bg-primary text-white' : 'bg-light text-primary'" @click="toggleAnotherClear">{{ $t("filter.cleared") }}</a>
            <a class="btn" type="button" :class="anotherFC ? 'bg-primary text-white flash' : 'bg-light text-primary'" @click="toggleAnotherFC">{{ $t("filter.fullComboShort") }}</a>
          </div>
        </div>
        <div class="col-12 col-lg-6" :class="typeSelected === 'doubles' ? '' : ' d-none d-lg-block'">
          <p class="my-2">{{ $t("filter.doubles") }}</p>
          <div class="input-group mb-2  input-group-lg" v-if="infoSong.difficultyDoubleNormal > 0">
            <span class="input-group-text text-white bg-theme-1 border-0">{{ infoSong.difficultyDoubleNormal }}</span>
            <input placeholder="Score" type="text" class="form-control" id="scoreDoubleNormal" v-model="scoreDoubleNormal" />
            <a class="btn" type="button" :class="normalDoubleClear ? 'bg-primary text-white' : 'bg-light text-primary'" @click="toggleNormalDoubleClear">{{ $t("filter.cleared") }}</a>
            <a class="btn" type="button" :class="normalDoubleFC ? 'bg-primary text-white flash' : 'bg-light text-primary'" @click="toggleNormalDoubleFC">{{ $t("filter.fullComboShort") }}</a>
          </div>
          <div class="input-group mb-2  input-group-lg" v-if="infoSong.difficultyDoubleHard > 0">
            <span class="input-group-text text-white bg-theme-2 border-0">{{ infoSong.difficultyDoubleHard }}</span>
            <input placeholder="Score" type="text" class="form-control" id="scoreDoubleHard" v-model="scoreDoubleHard" />
            <a class="btn" type="button" :class="hardDoubleClear ? 'bg-primary text-white' : 'bg-light text-primary'" @click="toggleHardDoubleClear">{{ $t("filter.cleared") }}</a>
            <a class="btn" type="button" :class="hardDoubleFC ? 'bg-primary text-white flash' : 'bg-light text-primary'" @click="toggleHardDoubleFC">{{ $t("filter.fullComboShort") }}</a>
          </div>
          <div class="input-group mb-2  input-group-lg" v-if="infoSong.difficultyDoubleAnother > 0">
            <span class="input-group-text text-white bg-theme-3 border-0">{{ infoSong.difficultyDoubleAnother }}</span>
            <input placeholder="Score" type="text" class="form-control" id="scoreDoubleAnother" v-model="scoreDoubleAnother" />
            <a class="btn" type="button" :class="anotherDoubleClear ? 'bg-primary text-white' : 'bg-light text-primary'" @click="toggleAnotherDoubleClear">{{ $t("filter.cleared") }}</a>
            <a class="btn" type="button" :class="anotherDoubleFC ? 'bg-primary text-white flash' : 'bg-light text-primary'" @click="toggleAnotherDoubleFC">{{ $t("filter.fullComboShort") }}</a>
          </div>
        </div>
      </div>
      <div class="d-grid mt-2 gap-2">
        <button class="btn" @click="toggleTarget" :class="target ? 'btn-danger' : 'bg-light'"><i class="fas fa-bullseye me-1" :class="target ? 'text-white' : 'text-primary'"></i> {{ $t("filter.setTarget") }}</button>
        <button class="btn" @click="toggleFavorite" :class="favorite ? 'btn-primary' : 'bg-light'"><i class="fa fa-heart me-1" :class="favorite ? 'text-white' : 'text-primary'"></i> {{ $t("filter.setFavorite") }}</button>
        <hr>
        <button class="btn btn-dark" @click="hideDialog"><i class="fas fa-save text-white me-1"></i> {{ $t("filter.save") }}</button>
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
      scoreDoubleNormal: '',
      normalDoubleFC: false,
      normalDoubleClear: false,
      scoreDoubleHard: '',
      hardDoubleFC: false,
      hardDoubleClear: false,
      scoreDoubleAnother: '',
      anotherDoubleFC: false,
      anotherDoubleClear: false,
      favorite: false,
      target: false,
      typeSelected: 'singles',
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
        favorite: this.favorite,
        target: this.target
      });

    },
    toggleTypeselected() {
      this.typeSelected = this.typeSelected == 'singles' ? 'doubles' : 'singles';
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
    },
    toggleTarget() {
      this.target = !this.target;
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
        this.target = this.infoSong.target;
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
  top: 10%;
  max-height: 80%;
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