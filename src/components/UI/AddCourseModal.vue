<template>
  <div v-if="open" class="backdrop" @click="hideDialog"></div>
  <transition name="modal">
    <dialog open v-if="open">
      <h3>{{ infoSong.name }}</h3>
      <span v-for="n in 5" :key="n"><i class="fa fa-star h3" :class="n <= infoSong.rating ? 'text-primary' : 'text-dark'"></i></span>
      <br>
      <span>{{ infoSong.type }}</span>
      <hr>
      <div class="input-group mb-3  input-group-lg">
        <input placeholder="Score" type="text" class="form-control" id="scoreNormal" v-model="score" />
        <input placeholder="Grade" type="text" class="form-control" id="scoreNormal" v-model="grade" />
        <a class="btn" :class="clear ? 'bg-primary text-white' : 'bg-light text-primary'" @click="toggleClear">Clear</a>
        <a class="btn" :class="FC ? 'bg-primary text-white flash' : 'bg-light text-primary'" @click="toggleFC">FC</a>
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
        this.score = this.infoSong.normal;
        this.FC = this.infoSong.FC;
        this.clear = this.infoSong.clear;
        this.favorite = this.infoSong.favorite;
        this.grade = this.infoSong.grade;
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