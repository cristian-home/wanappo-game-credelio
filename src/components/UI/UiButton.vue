<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: 'Click Me',
  },
})
</script>

<template>
  <button>
    <slot>
      {{ text }}
    </slot>
  </button>
</template>

<style scoped lang="css"></style>
