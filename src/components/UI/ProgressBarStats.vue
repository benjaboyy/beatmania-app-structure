<template>
  <div class="progress">
    <div class="progress-bar progress-bar-striped" :class="setClass(this.name)" role="progressbar" :style="{width: calcProcent(this.clear, this.total)}" :aria-valuenow="this.clear" aria-valuemin="0" :aria-valuemax="this.total">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id', 'name', 'clear', 'total'],
  name: "ProgressBarStats",
  methods: {
    setClass(set) {
      return set === 'beginner' ? 'bg-theme-1' : set === 'normal' ? 'bg-theme-2' : set === 'hyper' ? 'bg-theme-3' : set === 'primary' ? 'bg-primary' : 'bg-secondary';
    },
    calcProcent(clear, total) {
      return (clear / total) * 100 + '%';
    }
  }
}
</script>

<style scoped>

</style>