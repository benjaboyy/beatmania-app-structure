<template>
  <div v-if="open" class="backdrop" @click="$emit('close')"></div>
  <transition name="modal" class="front">
    <dialog open v-if="open">
      <h2 class="text-primary mb-3"><i class="fa fa-sliders-h"></i> {{ $t("filter.songFilters") }}</h2>
     <h6>{{ $t("filter.level") }} <span class="bold">{{ filteredLevel }}</span></h6>

        <button-row :value="filterLevel" :min="0" :max="9" @update:value="updateFilterLevel" />
      <h6>{{ $t("filter.filterOnClear") }}</h6>
      <div class="row g-3">
        <div class="col-6">
          <a class="btn w-100 py-3" :class="filteredClear === '' ? 'btn-primary' : 'btn-light'" @click="clearFil('')">{{ $t("filter.none") }}</a>
        </div>
        <div class="col-6">
          <a class="btn w-100 py-3" :class="filteredClear === 'failed' ? 'btn-primary' : 'btn-light'" @click="clearFil('failed')"><i class="fa fa-times text-danger"></i> {{ $t("filter.failed") }}</a>
        </div>
        <div class="col-6">
          <a class="btn w-100 py-3" :class="filteredClear === 'clear' ? 'btn-primary' : 'btn-light'" @click="clearFil('clear')"><i class="fa fa-check text-success"></i> {{ $t("filter.clear") }}</a>
        </div>
        <div class="col-6">
          <a class="btn w-100 py-3" :class="filteredClear === 'fullcombo' ? 'btn-primary' : 'btn-light'" @click="clearFil('fullcombo')"><i class="fa fa-star text-theme-1"></i> {{ $t("filter.fullCombo") }}</a>
        </div>
      </div>
      <h6>{{ $t("filter.otherFilters") }}</h6>
      <div class="row g-3">
        <div class="col-6">
          <a class="btn btn-sm btn-primary w-100 py-3 me-2" :class="filterFavorite ? 'btn-primary' : 'btn-light'" @click="favoriteFil"><i class="fa fa-heart" :class="filterFavorite ? 'text-white' : 'text-primary'"></i> {{ $t("filter.favorite") }}</a>
        </div>
        <div class="col-6">
          <a class="btn btn-sm btn-primary w-100 py-3" :class="filterTarget ? 'btn-primary' : 'btn-light'" @click="targetFil"><i class="fa fa-bullseye" :class="filterTarget ? 'text-white' : 'text-danger'"></i> {{ $t("filter.target") }}</a>
        </div>
      </div>
      <hr>
      <a class="btn-primary btn w-100 py-3" @click="hideDialog">{{ $t("filter.applyFilters") }}</a>
    </dialog>
  </transition>
</template>


<script>
import ButtonRow from "./ButtonRow.vue";
export default {
  components: {
    ButtonRow,
  },
  props:
      {
        open: {
          type: Boolean,
          required: true
        },
        currentFilters: {
          type: Object,
          required: true
        }
      },
  emits: ['close', 'addSongUser'],
  data() {
    return {
      filterLevel: 0,
      filteredClear: '',
      filterFavorite: false,
      filterTarget: false,
    }
  },
  methods: {
    updateFilterLevel(newValue) {
      this.filterLevel = newValue;
    },
    hideDialog() {
      this.$emit('close');
      this.$emit('addFilter', {
        filterLevel: this.filterLevel,
        filteredClear: this.filteredClear,
        filterFavorite: this.filterFavorite,
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
    },
    currentFilters: {
      deep: true,
      handler(newFilters) {
        this.filterLevel = newFilters.filterLevel;
        this.filteredClear = newFilters.filteredClear;
        this.filterFavorite = newFilters.filterFavorite;
        this.filterTarget = newFilters.filterTarget;
      }
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
  z-index: 1050;
  background-color: rgba(0, 0, 0, 0.75);
}
.front {
  z-index: 1051;
}

dialog {
  position: fixed;
  top: 10%;
  max-height: 85%;
  max-width: 600px;
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