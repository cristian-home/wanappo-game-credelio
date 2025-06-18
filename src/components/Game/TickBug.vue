<script setup lang="ts">
import type { Bug } from '@/stores/game'
import tickImg from '@/assets/img/tick.webp'
import deadTickImg from '@/assets/img/dead_tick.webp'
import { ref, watch } from 'vue'

interface Props {
  bug: Bug
}

const props = defineProps<Props>()

const emit = defineEmits<{
  bugClick: [bugId: string]
  splatted: [bugId: string]
}>()

const isAnimatingDeath = ref(false)
const showSplatter = ref(false)

const handleClick = () => {
  if (props.bug.isAlive) {
    emit('bugClick', props.bug.id)
  }
}

const rotation = computed(() => {
  return (Math.atan2(props.bug.velocityY, props.bug.velocityX) * 180) / Math.PI
})

// Watch for bug death to trigger splatter animation
watch(
  () => props.bug.isAlive,
  (newValue, oldValue) => {
    if (oldValue && !newValue) {
      // Bug just died
      isAnimatingDeath.value = true
      showSplatter.value = true

      // After 5 seconds, notify parent that splatter animation is complete
      setTimeout(() => {
        emit('splatted', props.bug.id)
        showSplatter.value = false
        isAnimatingDeath.value = false
      }, 5000)
    }
  },
)
</script>

<script lang="ts">
import { computed } from 'vue'
export default {
  name: 'TickBug',
}
</script>

<template>
  <!-- Live bug -->
  <div
    v-if="bug.isAlive"
    @click="handleClick"
    class="tick-bug flex h-32 w-32 cursor-none items-center justify-center rounded-full text-2xl transition-transform"
    :style="{
      left: bug.x + 'px',
      top: bug.y + 'px',
      transform: `rotate(${rotation + 90}deg)`,
    }"
  >
    <div
      class="h-24 w-24 bg-cover bg-center bg-no-repeat"
      :style="{
        'background-image': `url(${tickImg})`,
      }"
    ></div>
  </div>

  <!-- Splatter animation -->
  <div
    v-else-if="showSplatter"
    class="tick-bug-splatter flex h-32 w-32 items-center justify-center text-3xl"
    :class="{ 'animate-fade-out': isAnimatingDeath }"
    :style="{
      transform: `rotate(${rotation + 90}deg)`,
      left: bug.x + 'px',
      top: bug.y + 'px',
    }"
  >
    <div
      class="h-24 w-24 bg-cover bg-center bg-no-repeat"
      :style="{
        'background-image': `url(${deadTickImg})`,
      }"
    ></div>
  </div>
</template>

<style scoped>
.tick-bug {
  position: absolute;
  z-index: 10;
}

.tick-bug-splatter {
  position: absolute;
  z-index: 5;
  pointer-events: none;
}

.animate-fade-out {
  animation: fadeOut 5s ease-out forwards;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
    /* transform: scale(1); */
  }
  20% {
    opacity: 0.9;
    /* transform: scale(1.2); */
  }
  100% {
    opacity: 0;
    /* transform: scale(0.8); */
  }
}
</style>
