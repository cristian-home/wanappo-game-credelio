<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGameStore } from '@/stores/game'
import TickBug from './TickBug.vue'
import GameOverlay from './GameOverlay.vue'
import LogoElanco from '@/assets/img/logo-elanco-color.svg?skipsvgo'

// Import images or use URLs
import bgImg1 from '@/assets/img/fur1.webp'
import bgImg2 from '@/assets/img/fur2.webp'
import bgImg3 from '@/assets/img/fur2.webp'
import bgImg4 from '@/assets/img/fur4.webp'

const gameStore = useGameStore()
const gameBoardRef = ref<HTMLElement>()

const emit = defineEmits<{
  bugClick: [bugId: string]
  boardReady: [width: number, height: number]
  bugSplatted: [bugId: string]
}>()

const handleBugClick = (bugId: string) => {
  if (gameStore.isPlaying && !gameStore.isPaused) {
    emit('bugClick', bugId)
  }
}

const handleBugSplatted = (bugId: string) => {
  emit('bugSplatted', bugId)
}

const bgImage = computed(() => {
  switch (gameStore.currentLevel) {
    case 1:
      return bgImg1
    case 2:
      return bgImg2
    case 3:
      return bgImg3
    case 4:
      return bgImg4
    default:
      return bgImg1
  }
})

onMounted(() => {
  if (gameBoardRef.value) {
    const width = gameBoardRef.value.clientWidth || 800
    const height = gameBoardRef.value.clientHeight || 600
    emit('boardReady', width, height)
  }
})

defineExpose({
  getBoardDimensions: () => {
    if (gameBoardRef.value) {
      return {
        width: gameBoardRef.value.clientWidth || 800,
        height: gameBoardRef.value.clientHeight || 600,
      }
    }
    return { width: 800, height: 600 }
  },
})
</script>

<template>
  <div
    class="outline-yellow relative cursor-none overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat outline-8 outline-solid"
    :style="{
      'background-image': `url(${bgImage})`,
    }"
    ref="gameBoardRef"
  >
    <GameOverlay />

    <!-- Bugs -->
    <TickBug
      v-for="bug in gameStore.bugs"
      :key="bug.id"
      :bug="bug"
      @bug-click="handleBugClick"
      @splatted="handleBugSplatted"
    />
    <LogoElanco class="absolute right-4 bottom-4 z-0 w-24" />
  </div>
</template>
