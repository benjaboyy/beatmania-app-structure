<template>
  <div v-if="open" class="backdrop" @click="$emit('close')"></div>
  <transition name="modal">
    <dialog open v-if="open">
      <h2 class="text-primary"><i class="fa fa-sliders-h"></i> Song filters</h2>
     <h6>Level</h6>
      <a class="btn btn-sm" :class="levelNone ? 'btn-primary' : 'btn-light'" @click="resetLevelsFil">None</a>
      <a class="btn btn-sm" :class="filterLevel1 ? 'btn-primary' : 'btn-light'" @click="levelsFil1">1</a>
      <a class="btn btn-sm" :class="filterLevel2 ? 'btn-primary' : 'btn-light'" @click="levelsFil2">2</a>
      <a class="btn btn-sm" :class="filterLevel3 ? 'btn-primary' : 'btn-light'" @click="levelsFil3">3</a>
      <a class="btn btn-sm" :class="filterLevel4 ? 'btn-primary' : 'btn-light'" @click="levelsFil4">4</a>
      <a class="btn btn-sm" :class="filterLevel5 ? 'btn-primary' : 'btn-light'" @click="levelsFil5">5</a>
      <a class="btn btn-sm" :class="filterLevel6 ? 'btn-primary' : 'btn-light'" @click="levelsFil6">6</a>
      <a class="btn btn-sm" :class="filterLevel7 ? 'btn-primary' : 'btn-light'" @click="levelsFil7">7</a>
      <a class="btn btn-sm" :class="filterLevel8 ? 'btn-primary' : 'btn-light'" @click="levelsFil8">8</a>
      <a class="btn btn-sm" :class="filterLevel9 ? 'btn-primary' : 'btn-light'" @click="levelsFil9">9</a>
      <h6>Filter on clear</h6>
      <a class="btn btn-sm" :class="filteredClear === '' ? 'btn-primary' : 'btn-light'" @click="clearFil('')">None</a>
      <a class="btn btn-sm" :class="filteredClear === 'failed' ? 'btn-primary' : 'btn-light'" @click="clearFil('failed')">Failed</a>
      <a class="btn btn-sm" :class="filteredClear === 'clear' ? 'btn-primary' : 'btn-light'" @click="clearFil('clear')">Clear</a>
      <a class="btn btn-sm" :class="filteredClear === 'fullcombo' ? 'btn-primary' : 'btn-light'" @click="clearFil('fullcombo')">Full-combo</a>
      <h6>Other filters</h6>
      <div class="mb-2">
        <a class="btn btn-sm btn-primary">Single</a>
        <a class="btn btn-sm btn-light disabled me-2" >Double</a> Not yet supported
      </div>
      <a class="btn btn-sm btn-primary" :class="filterFavorite ? 'btn-primary' : 'btn-light'" @click="favoriteFil">Favorites</a>
      <hr>
      <a class="btn-primary btn" @click="hideDialog">Close</a>
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
        currentFilters: {
          type: Array,
        }
      },
  emits: ['close', 'addSongUser'],
  data() {
    return {
      levelNone: true,
      filterLevel1: false,
      filterLevel2: false,
      filterLevel3: false,
      filterLevel4: false,
      filterLevel5: false,
      filterLevel6: false,
      filterLevel7: false,
      filterLevel8: false,
      filterLevel9: false,
      filteredClear: '',
      filterFavorite: false,
    }
  },
  methods: {
    hideDialog() {
      this.$emit('close');
      this.$emit('addFilter', {
        levelNone: this.levelNone,
        levels: this.levelFilters,
        filteredClear: this.filteredClear,
        filterFavorite: this.filterFavorite,
      });
    },
    levelsFil1() {
      this.filterLevel1 = !this.filterLevel1;
      this.levelNone = false;
    },
    levelsFil2() {
      this.filterLevel2 = !this.filterLevel2;
      this.levelNone = false;
    },
    levelsFil3() {
      this.filterLevel3 = !this.filterLevel3;
      this.levelNone = false;
    },
    levelsFil4() {
      this.filterLevel4 = !this.filterLevel4;
      this.levelNone = false;
    },
    levelsFil5() {
      this.filterLevel5 = !this.filterLevel5;
      this.levelNone = false;
    },
    levelsFil6() {
      this.filterLevel6 = !this.filterLevel6;
      this.levelNone = false;
    },
    levelsFil7() {
      this.filterLevel7 = !this.filterLevel7;
      this.levelNone = false;
    },
    levelsFil8() {
      this.filterLevel8 = !this.filterLevel8;
      this.levelNone = false;
    },
    levelsFil9() {
      this.filterLevel9 = !this.filterLevel9;
      this.levelNone = false;
    },
    resetLevelsFil() {
      this.filterLevel1 = false;
      this.filterLevel2 = false;
      this.filterLevel3 = false;
      this.filterLevel4 = false;
      this.filterLevel5 = false;
      this.filterLevel6 = false;
      this.filterLevel7 = false;
      this.filterLevel8 = false;
      this.filterLevel9 = false;
      this.levelNone = true;
    },
    clearFil(item) {
      this.filteredClear = item;
    },
    favoriteFil() {
      this.filterFavorite = !this.filterFavorite;
    },
  },
  computed: {
    levelFilters() {
      let levels = [];
      if (this.filterLevel1) {
        levels.push(1);
      }
      if (this.filterLevel2) {
        levels.push(2);
      }
      if (this.filterLevel3) {
        levels.push(3);
      }
      if (this.filterLevel4) {
        levels.push(4);
      }
      if (this.filterLevel5) {
        levels.push(5);
      }
      if (this.filterLevel6) {
        levels.push(6);
      }
      if (this.filterLevel7) {
        levels.push(7);
      }
      if (this.filterLevel8) {
        levels.push(8);
      }
      if (this.filterLevel9) {
        levels.push(9);
      }
      return levels;
    }
  },
  watch: {
    open() {
    }
  }
};
</script>

<style scoped>
h6 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

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
  /*animation: modal 0.3s ease-out forwards;*/
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