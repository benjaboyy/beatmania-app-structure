<template>
  <div v-if="open" class="backdrop" @click="hideDialog"></div>
  <transition name="modal">
    <dialog class="window" open v-if="open">
      <h4><i class="fas fa-cog"></i> Edit modes <br> <small>{{ info.name }}</small></h4>
      <div class="my-4">
        <div class="form-check form-switch d-flex justify-content-between p-0 py-2">
          <label class="form-check-label" for="singlesSet">Single Player</label>
          <input class="form-check-input" type="checkbox" id="singlesSet" v-model="localModeInfo.singlesSet" @change="updateTrackGames(localModeInfo.id, 'singlesSet', localModeInfo.singlesSet)">
        </div>
        <div v-if="info.hasDoubleCharts" class="form-check form-switch d-flex justify-content-between p-0 py-2">
          <label class="form-check-label" for="doublesSet">Double Player</label>
          <input class="form-check-input" type="checkbox" id="doublesSet" v-model="localModeInfo.doublesSet" @change="updateTrackGames(localModeInfo.id, 'doublesSet', localModeInfo.doublesSet)">
        </div>
        <div v-if="info.hasCourseMode" class="form-check form-switch d-flex justify-content-between p-0 py-2">
          <label class="form-check-label" for="singleCourse">Single Course</label>
          <input class="form-check-input" type="checkbox" id="singleCourse" v-model="localModeInfo.singleCourse" @change="updateTrackGames(localModeInfo.id, 'singleCourse', localModeInfo.singleCourse)">
        </div>
        <div v-if="info.hasDoubleCharts && info.hasCourseMode" class="form-check form-switch d-flex justify-content-between p-0 py-2">
          <label class="form-check-label" for="doubleCourse">Double Course</label>
          <input class="form-check-input" type="checkbox" id="doubleCourse" v-model="localModeInfo.doubleCourse" @change="updateTrackGames(localModeInfo.id, 'doubleCourse', localModeInfo.doubleCourse)">
        </div>
      </div>
      <!--          remove filters, toggle them off-->
      <div class="row g-3">
        <div class="col-6">
          <button class="btn btn-danger w-100" @click="removeFilters"><i class="fa fa-times"></i> {{ $t("filter.removeFilters") }}</button>
        </div>
        <div class="col-6">
          <button class="btn btn-success w-100" @click="toggleAllFilters"><i class="fa fa-check"></i> {{ $t("filter.trackAll") }}</button>
        </div>
      </div>
      <div class="d-grid mt-3 gap-2">
        <button class="btn btn-dark" @click="hideDialog">{{ $t("login.close") }}</button>
      </div>
    </dialog>
  </transition>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true
    },
    info: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localModeInfo: { ...this.info },
      modes: ['singlesSet', 'doublesSet', 'singleCourse', 'doubleCourse']
    };
  },
  watch: {
    info: {
      handler(newVal) {
        this.localModeInfo = { ...newVal };
      },
      deep: true
    }
  },
  emits: ['close', 'updateTrackGames', 'removeFilters', 'toggleAllFilters'],
  methods: {
    removeFilters() {
      this.$emit('removeFilters', this.localModeInfo.id);
      for (const mode of this.modes) {
        this.localModeInfo[mode] = false;
      }
    },
    toggleAllFilters() {
      this.$emit('toggleAllFilters', this.localModeInfo.id);
      for (const mode of this.modes) {
        this.localModeInfo[mode] = true;
      }
    },
    hideDialog() {
      this.$emit('close');
    },
    updateTrackGames(id, option, value) {
      this.$emit('updateTrackGames', id, option, value);
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
  max-width: 600px;
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