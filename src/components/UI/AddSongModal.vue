<template>
  <div v-if="open" class="backdrop" @click="hideDialog"></div>
  <transition name="modal" class="front">
    <dialog class="window" open v-if="open">
      <h4>{{ infoSong.name }} <a :href="`https://remywiki.com/${infoSong.name}`" target="_blank" class="btn btn-link float-end btn-sm"><i class="fa fa-info-circle"></i> Song info</a></h4>
      <p>{{ infoSong.artist }}</p>
      <ul class="nav nav-tabs d-lg-none" v-if="infoSong.difficultyDoubleNormal > 0 || infoSong.difficultyDoubleHard > 0 || infoSong.difficultyDoubleAnother > 0">
        <li class="nav-item">
          <a @click="toggleTypeselected" class="nav-link" aria-current="page" :class="typeSelected === 'single' ? 'active' : ''">Singles
            <clear-indicator v-if="infoSong.difficultyNormal > 0" :clear="normalClear" :fc="normalFC" />
            <clear-indicator v-if="infoSong.difficultyHard > 0" :clear="hardClear" :fc="hardFC" />
            <clear-indicator v-if="infoSong.difficultyAnother > 0" :clear="anotherClear" :fc="anotherFC" />
          </a>
        </li>
        <li class="nav-item">
          <a @click="toggleTypeselected" class="nav-link" :class="typeSelected === 'double' ? 'active' : ''">Doubles
            <clear-indicator v-if="infoSong.difficultyDoubleNormal > 0" :clear="normalDoubleClear" :fc="normalDoubleFC" />
            <clear-indicator v-if="infoSong.difficultyDoubleHard > 0" :clear="hardDoubleClear" :fc="hardDoubleFC" />
            <clear-indicator v-if="infoSong.difficultyDoubleAnother > 0" :clear="anotherDoubleClear" :fc="anotherDoubleFC" />
          </a>
        </li>
      </ul>
      <div class="row">
        <div class="col-12 col-lg-6" :class="typeSelected === 'single' ? '' : ' d-none d-lg-block'">
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
        <div class="col-12 col-lg-6" :class="typeSelected === 'double' ? '' : ' d-none d-lg-block'">
          <p class="my-2">{{ $t("filter.doubles") }}</p>
          <div class="input-group mb-2  input-group-lg" v-if="infoSong.difficultyDoubleEasy > 0">
            <span class="input-group-text text-white bg-theme-4 border-0">{{ infoSong.difficultyDoubleEasy }}</span>
            <input placeholder="Score" type="text" class="form-control" id="scoreDoubleEasy" v-model="scoreDoubleEasy" />
            <a class="btn" type="button" :class="easyDoubleClear ? 'bg-primary text-white' : 'bg-light text-primary'" @click="toggleEasyDoubleClear">{{ $t("filter.cleared") }}</a>
            <a class="btn" type="button" :class="easyDoubleFC ? 'bg-primary text-white flash' : 'bg-light text-primary'" @click="toggleEasyDoubleFC">{{ $t("filter.fullComboShort") }}</a>
          </div>
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
        <div class="row g-2">
          <div class="col-6">
            <button class="btn btn-sm py-2 w-100" @click="toggleTarget" :class="target ? 'btn-danger' : 'bg-light'"><i class="fas fa-bullseye me-1" :class="target ? 'text-white' : 'text-primary'"></i> {{ $t("filter.setTarget") }}</button>
          </div>
          <div class="col-6">
            <button class="btn btn-sm py-2 w-100" @click="toggleFavorite" :class="favorite ? 'btn-primary' : 'bg-light'"><i class="fa fa-heart me-1" :class="favorite ? 'text-white' : 'text-primary'"></i> {{ $t("filter.setFavorite") }}</button>
          </div>
        </div>
<!--        <div v-for="(code, index) in userCodes" :key="index" class="input-group mb-1  input-group-lg">-->
<!--          <div v-if="code">-->
<!--            &lt;!&ndash; /leaderboard/{arcadeID}}/{gameID}/{songID}&ndash;&gt;-->
<!--            <router-link to="/leaderboard/573300/1/1" class="input-group-text text-white bg-theme-1 border-0">{{ code }}</router-link>-->
<!--          </div>-->
<!--        </div>-->
        <hr>
        <button class="btn btn-dark" @click="hideDialog"><i class="fas fa-save text-white me-1"></i> {{ $t("filter.save") }}</button>
      </div>
    </dialog>
  </transition>
</template>


<script>
import ClearIndicator from "@/components/widgets/ClearIndicator";
export default {
  components: {ClearIndicator},
  props:
  {
    open: {
      type: Boolean,
      required: true
    },
    infoSong: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'addSongUser', 'number'],
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
      scoreDoubleEasy: '',
      easyDoubleFC: false,
      easyDoubleClear: false,
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
      typeSelected: 'single',
      userCodes: [],

      pointsOnOpen: 0,
      pointsOnClose: 0,
    }
  },
  methods: {
    countPointsOnOpen () {
      this.pointsOnOpen = 0
      if (this.normalClear) {
        this.pointsOnOpen++
      }
      if (this.hardClear) {
        this.pointsOnOpen++
      }
      if (this.anotherClear) {
        this.pointsOnOpen++
      }
      if (this.normalDoubleClear) {
        this.pointsOnOpen++
      }
      if (this.hardDoubleClear) {
        this.pointsOnOpen++
      }
      if (this.anotherDoubleClear) {
        this.pointsOnOpen++
      }
      this.pointsOnClose = this.pointsOnOpen
    },
    hideDialog() {
      this.$emit('close');
      this.$emit('number', this.pointsOnClose - this.pointsOnOpen);
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
        scoreDoubleEasy: this.scoreDoubleEasy,
        easyDoubleFC: this.easyDoubleFC,
        easyDoubleClear: this.easyDoubleClear,
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
      this.typeSelected = this.typeSelected == 'single' ? 'double' : 'single';
    },
    toggleNormalFC() {
      this.normalFC = !this.normalFC;
    },
    toggleNormalClear() {
      this.normalClear = !this.normalClear;
      if (this.normalClear) {
        this.pointsOnClose++
      } else {
        this.pointsOnClose--
      }
    },
    toggleHardFC() {
      this.hardFC = !this.hardFC;
    },
    toggleHardClear() {
      this.hardClear = !this.hardClear;
      if (this.hardClear) {
        this.pointsOnClose++
      } else {
        this.pointsOnClose--
      }
    },
    toggleAnotherFC() {
      this.anotherFC = !this.anotherFC;
    },
    toggleAnotherClear() {
      this.anotherClear = !this.anotherClear;
      if (this.anotherClear) {
        this.pointsOnClose++
      } else {
        this.pointsOnClose--
      }
    },
    toggleNormalDoubleFC() {
      this.normalDoubleFC = !this.normalDoubleFC;
    },
    toggleNormalDoubleClear() {
      this.normalDoubleClear = !this.normalDoubleClear;
      if (this.normalDoubleClear) {
        this.pointsOnClose++
      } else {
        this.pointsOnClose--
      }
    },
    toggleHardDoubleFC() {
      this.hardDoubleFC = !this.hardDoubleFC;
    },
    toggleHardDoubleClear() {
      this.hardDoubleClear = !this.hardDoubleClear;
      if (this.hardDoubleClear) {
        this.pointsOnClose++
      } else {
        this.pointsOnClose--
      }
    },
    toggleAnotherDoubleFC() {
      this.anotherDoubleFC = !this.anotherDoubleFC;
    },
    toggleAnotherDoubleClear() {
      this.anotherDoubleClear = !this.anotherDoubleClear;
      if (this.anotherDoubleClear) {
        this.pointsOnClose++
      } else {
        this.pointsOnClose--
      }
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
        this.scoreDoubleEasy = this.infoSong.scoreDoubleEasy;
        this.easyDoubleFC = this.infoSong.easyDoubleFC;
        this.easyDoubleClear = this.infoSong.easyDoubleClear;
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
        this.typeSelected = this.type;
        this.countPointsOnOpen()
        this.userCodes = this.$store.getters['getUserArcadeCodes'];
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
  z-index: 1050;
  background-color: rgba(0, 0, 0, 0.75);
}
.front {
  z-index: 1051;
  max-width: 900px;
}

dialog {
  position: fixed;
  top: 10%;
  max-height: 85%;
  overflow: auto;
  width: 90%;
  margin: 0 auto;
  bottom: 15vh;
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