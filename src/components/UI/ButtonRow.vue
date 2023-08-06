<template>
  <div class="button-row">
    <a
        v-for="value in values"
        :key="value"
        class=" btn py-2 py-lg-3 btn-sm w-100"
        :class="{ 'btn-primary': value == currentValue, 'btn-light': value != currentValue }"
        @click="handleButtonClick(value)"
    >
      {{ value }}
    </a>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 9,
    },
  },
  computed: {
    values() {
      return Array.from({ length: this.max - this.min + 1 }, (_, i) => this.min + i);
    },
    currentValue: {
      get() {
        return this.value;
      },
    },
  },
  methods: {
    handleButtonClick(value) {
      //make value a string
      value = value.toString();
      this.$emit("update:value", value);
    },
  },
};
</script>

<style scoped>
.button-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

button {
  flex: 1;
  border: none;
  padding: 8px 12px;
  background-color: #f1f1f1;
  cursor: pointer;
}

button.active {
  background-color: #007bff;
  color: #fff;
}
</style>