<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'

const gameStore = useGameStore()
const { t } = useI18n()
</script>

<template>
  <!-- Pause Overlay -->
  <div v-if="gameStore.isPaused" class="">
    <div
      class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/25 backdrop-blur-lg"
    >
      <div class="text-primary-green mb-4 text-6xl font-bold">⏸️</div>
      <div class="text-4xl font-bold text-white">{{ t('game.paused') }}</div>
    </div>
  </div>

  <!-- Loading Bugs Message -->
  <div
    v-if="gameStore.bugs.length === 0 && gameStore.isPlaying"
    class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/25 backdrop-blur-lg"
  >
    <div class="animate-pulse text-xl text-white">{{ t('game.loadingBugs') }}</div>
  </div>

  <!-- Get Ready Message -->
  <div v-if="!gameStore.isPlaying && !gameStore.isPaused" class="">
    <div
      class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/25 backdrop-blur-lg"
    >
      <div class="mb-4 text-6xl font-bold">🎯</div>
      <div class="mb-4 text-4xl font-bold text-white">{{ t('game.getReady') }}</div>
      <div class="text-lg text-white">
        {{ t('instructions.levelStarting', { level: gameStore.currentLevel }) }}
      </div>
    </div>
  </div>
</template>
