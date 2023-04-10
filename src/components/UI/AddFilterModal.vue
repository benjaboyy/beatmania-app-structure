<template>
  <div v-if="open" class="backdrop" @click="$emit('close')"></div>
  <transition name="modal">
    <dialog open v-if="open">
      <h2 class="text-primary mb-3"><i class="fa fa-sliders-h"></i> Song filters</h2>
     <h6>Level <span class="bold">{{ filteredLevel }}</span></h6>
      <div class="form-range">
        <input data- type="range" max="9" min="0" class="form-range col-12" id="formControlRangeN" v-model="filterLevel" />
      </div>
      <h6>Filter on clear</h6>
      <a class="btn btn-sm" :class="filteredClear === '' ? 'btn-primary' : 'btn-light'" @click="clearFil('')">None</a>
      <a class="btn btn-sm" :class="filteredClear === 'failed' ? 'btn-primary' : 'btn-light'" @click="clearFil('failed')">Failed</a>
      <a class="btn btn-sm" :class="filteredClear === 'clear' ? 'btn-primary' : 'btn-light'" @click="clearFil('clear')">Clear</a>
      <a class="btn btn-sm" :class="filteredClear === 'fullcombo' ? 'btn-primary' : 'btn-light'" @click="clearFil('fullcombo')">Full-combo</a>
      <h6>Play style</h6>
      <div>
        <a class="btn btn-sm btn-primary">NONE</a>
        <a class="btn btn-sm btn-light disabled"><i class="fa fa-compact-disc"></i> Single</a>
        <a class="btn btn-sm btn-light disabled me-2" ><i class="fa fa-compact-disc"></i> <i class="fa fa-compact-disc"></i> Double</a> Not yet supported
      </div>
      <h6>Other filters</h6>
      <a class="btn btn-sm btn-primary" :class="filterFavorite ? 'btn-primary' : 'btn-light'" @click="favoriteFil"><i class="fa fa-heart" :class="filterFavorite ? 'text-white' : 'text-primary'"></i> Favorite</a>
      <hr>
      <a class="btn-primary btn" @click="hideDialog">Apply filter</a>
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
      filterLevel: 0,
      filteredClear: '',
      filterFavorite: false,
    }
  },
  methods: {
    hideDialog() {
      this.$emit('close');
      this.$emit('addFilter', {
        filterLevel: this.filterLevel,
        filteredClear: this.filteredClear,
        filterFavorite: this.filterFavorite,
      });
    },
    clearFil(item) {
      this.filteredClear = item;
    },
    favoriteFil() {
      this.filterFavorite = !this.filterFavorite;
    },
  },
  computed: {
    filteredLevel() {
      if (this.filterLevel === 0) {
        return 'None';
      }
      return this.filterLevel;
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