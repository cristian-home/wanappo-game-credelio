<script setup lang="ts">
import type { Bug } from '@/stores/game'

interface Props {
  bug: Bug
}

const props = defineProps<Props>()

const emit = defineEmits<{
  bugClick: [bugId: string]
}>()

const handleClick = () => {
  emit('bugClick', props.bug.id)
}

const rotation = computed(() => {
  return (Math.atan2(props.bug.velocityY, props.bug.velocityX) * 180) / Math.PI
})
</script>

<script lang="ts">
import { computed } from 'vue'
export default {
  name: 'TickBug',
}
</script>

<template>
  <div
    v-show="bug.isAlive"
    @click="handleClick"
    class="tick-bug flex h-8 w-8 items-center justify-center text-2xl"
    :style="{
      left: bug.x + 'px',
      top: bug.y + 'px',
      transform: `rotate(${rotation}deg)`,
    }"
  >
    🐜
  </div>
</template>
