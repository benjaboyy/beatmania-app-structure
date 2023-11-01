<template>
  <div class="alert--div px-3">
    <div v-if="showAlert" class="alert text-center" :class="{'alert-success': counterChange > 0, 'alert-danger': counterChange < 0}" role="alert">
      <strong>{{ counterChangeHumanized }}</strong> Points
    </div>
  </div>
</template>

<script>
export default {
  name: "PointAlert",
  props: {'number': Number, open: {type: Boolean, default: false}},
  emits: ['close'],
  data() {
    return {
      counterChange: 0,
      showAlert: false
    }
  },
  methods: {
    updateCounter() {
      this.counterChange = this.number;
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 2500);
      this.$emit('close');
    }
  },
  computed: {
    counterChangeHumanized() {
      if (this.counterChange > 0) {
        return `+${this.counterChange}`;
      }
      return this.counterChange;
    }
  },
  watch: {
    open() {
      if (this.number !== 0) {
        this.updateCounter();
      } else {
        this.$emit('close');
      }
    }
  },
}
</script>

<style scoped>
  .alert--div {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }
  .alert {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 500px;
    padding: 0.75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    transition: all 0.5s ease-in-out;
  }
  /*animate the alert*/
  .alert-enter-active {
    animation: slideIn 0.5s ease-in-out;
  }
  .alert-leave-active {
    animation: slideOut 0.5s ease-in-out;
  }
  @keyframes slideIn {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0);
    }
  }
  @keyframes slideOut {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(100%);
    }
  }
</style>
