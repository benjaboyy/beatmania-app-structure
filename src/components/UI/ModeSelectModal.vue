<template>
  <div v-if="open" class="backdrop" @click="hideDialog"></div>
  <transition name="modal">
    <dialog class="window" open v-if="open">
      <h3><i class="fas fa-globe"></i> Edit {{ localModeInfo.name }}</h3>
      <div class="form-check form-switch d-flex justify-content-between p-0 py-2">
        <label class="form-check-label" for="singlesSet">Single Player</label>
        <input class="form-check-input" type="checkbox" id="singlesSet" v-model="localModeInfo.singlesSet" @change="updateTrackGames(localModeInfo.id, 'singlesSet', localModeInfo.singlesSet)">
      </div>
      <div v-if="localModeInfo.hasDoubleCharts" class="form-check form-switch d-flex justify-content-between p-0 py-2">
        <label class="form-check-label" for="doublesSet">Double Player</label>
        <input class="form-check-input" type="checkbox" id="doublesSet" v-model="localModeInfo.doublesSet" @change="updateTrackGames(localModeInfo.id, 'doublesSet', localModeInfo.doublesSet)">
      </div>
      <div v-if="localModeInfo.hasCourseMode" class="form-check form-switch d-flex justify-content-between p-0 py-2">
        <label class="form-check-label" for="singleCourse">Single Course</label>
        <input class="form-check-input" type="checkbox" id="singleCourse" v-model="localModeInfo.singleCourse" @change="updateTrackGames(localModeInfo.id, 'singleCourse', localModeInfo.singleCourse)">
      </div>
      <div v-if="localModeInfo.hasDoubleCharts && localModeInfo.hasCourseMode" class="form-check form-switch d-flex justify-content-between p-0 py-2">
        <label class="form-check-label" for="doubleCourse">Double Course</label>
        <input class="form-check-input" type="checkbox" id="doubleCourse" v-model="localModeInfo.doubleCourse" @change="updateTrackGames(localModeInfo.id, 'doubleCourse', localModeInfo.doubleCourse)">
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
    modeInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localModeInfo: { ...this.modeInfo }
    };
  },
  watch: {
    modeInfo: {
      handler(newVal) {
        this.localModeInfo = { ...newVal };
      },
      deep: true
    }
  },
  emits: ['close', 'updateTrackGames'],
  methods: {
    hideDialog() {
      this.$emit('close');
    },
    updateTrackGames(gameId, option, value) {
      this.$emit('updateTrackGames', gameId, option, value);
    }
  }
};
</script>