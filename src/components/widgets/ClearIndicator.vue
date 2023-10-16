<template>
  <i v-if="fc && clear" class="fas fa-plus-square text-primary ms-1"></i>
  <i v-else-if="clear" class="fas fa-square text-primary ms-1"></i>
  <i v-else class="far fa-square text-primary ms-1"></i>
</template>

<script>

export default {
  name: "ClearIndicator",
  props: {'clear': Boolean, 'fc': Boolean},
  data() {
    return {
    }
  },
}
</script>

<style scoped>
</style>
