<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import TickBug from './TickBug.vue'
import GameOverlay from './GameOverlay.vue'

const gameStore = useGameStore()
const gameBoardRef = ref<HTMLElement>()

const emit = defineEmits<{
  bugClick: [bugId: string]
  boardReady: [width: number, height: number]
}>()

const handleBugClick = (bugId: string) => {
  if (gameStore.isPlaying && !gameStore.isPaused) {
    emit('bugClick', bugId)
  }
}

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
    ref="gameBoardRef"
    class="bg-white rounded-lg shadow-md relative overflow-hidden"
    style="height: 600px"
  >
    <GameOverlay />

    <!-- Bugs -->
    <TickBug v-for="bug in gameStore.bugs" :key="bug.id" :bug="bug" @bug-click="handleBugClick" />
  </div>
</template>
