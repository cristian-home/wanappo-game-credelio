<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: 'Click Me',
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'control'].includes(value),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    :class="[
      {
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary',
        'control-btn': variant === 'control',
        'px-3 py-2 text-sm': size === 'small',
        'px-6 py-3 text-base': size === 'medium',
        'px-8 py-4 text-lg': size === 'large',
      },
    ]"
    :disabled="disabled"
  >
    <slot>
      {{ text }}
    </slot>
  </button>
</template>

<style scoped lang="css"></style>
