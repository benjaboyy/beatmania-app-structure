<template>
  <div v-if="open" class="backdrop" @click="$emit('close')"></div>
  <transition name="modal">
    <dialog open v-if="open">
      <h2 class="text-primary mb-3"><i class="fa fa-sliders-h"></i> {{ $t("filter.songFilters") }}</h2>
     <h6>{{ $t("filter.level") }} <span class="bold">{{ filteredLevel }}</span></h6>
      <div class="form-range">
        <input data- type="range" max="9" min="0" class="form-range col-12" id="formControlRangeN" v-model="filterLevel" />
      </div>
      <h6>{{ $t("filter.filterOnClear") }}</h6>
      <a class="btn btn-sm" :class="filteredClear === '' ? 'btn-primary' : 'btn-light'" @click="clearFil('')">{{ $t("filter.none") }}</a>
      <a class="btn btn-sm" :class="filteredClear === 'failed' ? 'btn-primary' : 'btn-light'" @click="clearFil('failed')"><i class="fa fa-times"></i> {{ $t("filter.failed") }}</a>
      <a class="btn btn-sm" :class="filteredClear === 'clear' ? 'btn-primary' : 'btn-light'" @click="clearFil('clear')"><i class="fa fa-check"></i> {{ $t("filter.clear") }}</a>
      <a class="btn btn-sm" :class="filteredClear === 'fullcombo' ? 'btn-primary' : 'btn-light'" @click="clearFil('fullcombo')"><i class="fa fa-star"></i> {{ $t("filter.fullCombo") }}</a>
      <div class="d-md-none">
        <h6>{{ $t("filter.playStyle") }}</h6>
        <div>
          <a class="btn btn-sm" :class="filterType === 'single' ? 'btn-primary' : 'btn-light'" @click="filterType = 'single'"><i class="fa fa-compact-disc"></i> {{ $t("filter.single") }}</a>
          <a class="btn btn-sm" :class="filterType === 'double' ? 'btn-primary' : 'btn-light'" @click="filterType = 'double'"><i class="fa fa-compact-disc"></i> <i class="fa fa-compact-disc"></i> {{ $t("filter.double") }}</a>
        </div>
      </div>
      <h6>{{ $t("filter.otherFilters") }}</h6>
      <a class="btn btn-sm btn-primary me-2" :class="filterFavorite ? 'btn-primary' : 'btn-light'" @click="favoriteFil"><i class="fa fa-heart" :class="filterFavorite ? 'text-white' : 'text-primary'"></i> {{ $t("filter.favorite") }}</a>
      <a class="btn btn-sm btn-primary" :class="filterTarget ? 'btn-primary' : 'btn-light'" @click="targetFil"><i class="fa fa-bullseye" :class="filterTarget ? 'text-white' : 'text-danger'"></i> {{ $t("filter.target") }}</a>
      <hr>
      <a class="btn-primary btn" @click="hideDialog">{{ $t("filter.applyFilters") }}</a>
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
      filterTarget: false,
      filterType: 'single',
    }
  },
  methods: {
    hideDialog() {
      this.$emit('close');
      this.$emit('addFilter', {
        filterLevel: this.filterLevel,
        filteredClear: this.filteredClear,
        filterFavorite: this.filterFavorite,
        filterType: this.filterType,
        filterTarget: this.filterTarget,
      });
    },
    clearFil(item) {
      this.filteredClear = item;
    },
    favoriteFil() {
      this.filterFavorite = !this.filterFavorite;
    },
    targetFil() {
      this.filterTarget = !this.filterTarget;
    },
  },
  computed: {
    filteredLevel() {
      if (this.filterLevel === 0) {
        return this.$t("filter.none");
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
  max-width: 600px;
  margin: auto;
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