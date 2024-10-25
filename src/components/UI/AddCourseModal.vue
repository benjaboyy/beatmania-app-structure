<template>
  <div v-if="open" class="backdrop" @click="hideDialog"></div>
  <transition name="modal" class="front">
    <dialog open v-if="open">
      <h3>{{ infoSong.name }}</h3>
      <span v-for="n in 5" :key="n"><i class="fa fa-star h3" :class="n <= infoSong.rating ? 'text-primary' : 'text-dark'"></i></span>
      <br>
      <span>{{ $t("filter."+infoSong.type) }}</span>
      <hr>
      <div class="row g-3">
        <div class="col-6">
            <input placeholder="Score" type="text" class="form-control form-control-lg" id="scoreNormal" v-model="score" />
        </div>
        <div class="col-6">
            <input placeholder="Grade" type="text" class="form-control form-control-lg" id="scoreNormal" v-model="grade" />
        </div>
        <div class="col-6">
            <a class="btn py-2 btn-block w-100" :class="clear ? 'bg-primary text-white' : 'bg-light text-primary'" @click="toggleClear"><i class="fa fa-check " :class="clear ? 'text-white' : 'text-success'"></i> {{ $t("filter.cleared") }}</a>
        </div>
        <div class="col-6">
            <a class="btn py-2 btn-block w-100" :class="FC ? 'bg-primary text-white flash' : 'bg-light text-primary'" @click="toggleFC"><i class="fa fa-star" :class="FC ? 'text-white' : 'text-theme-1'"></i> {{ $t("filter.fullCombo") }}</a>
        </div>
      </div>
      <div class="d-grid mt-3 gap-2">
        <button class="btn py-2" @click="toggleFavorite" :class="favorite ? 'btn-primary' : 'bg-light text-primary'"><i class="fa fa-heart" :class="favorite ? 'text-white' : 'text-primary'"></i> {{ $t("filter.setFavorite") }}</button>
        <hr>
        <button class="btn btn-dark" @click="hideDialog"><i class="fa fa-save text-white me-1"></i> {{ $t("filter.save") }}</button>
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
  emits: ['close', 'addCourseToUser'],
  data() {
    return {
      FC: false,
      clear: false,
      score: '',
      grade: '',
      favorite: false
    }
  },
  methods: {
    hideDialog() {
      this.$emit('close');
      this.$emit('addCourseToUser', {
        id: this.infoSong.id,
        score: this.score,
        FC: this.FC,
        clear: this.clear,
        grade: this.grade,
        favorite: this.favorite
      });

    },
    toggleFC() {
      this.FC = !this.FC;
    },
    toggleClear() {
      this.clear = !this.clear;
    },
    toggleFavorite() {
      this.favorite = !this.favorite;
    }
  },
  watch: {
    open() {
      if (this.open) {
        this.FC = this.infoSong.FC;
        this.clear = this.infoSong.clear;
        this.favorite = this.infoSong.favorite;
        this.grade = this.infoSong.grade;
        this.score = this.infoSong.score;
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
}

dialog {
  position: fixed;
  top: 20vh;
  width: 90%;
  max-width: 40rem;
  margin: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 0;
  padding: 1rem;
  overflow: auto;
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

.fa-check, .fa-star {
  transition: all 1s;
}
</style>