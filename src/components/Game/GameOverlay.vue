<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'

const gameStore = useGameStore()
const { t } = useI18n()
</script>

<template>
  <!-- Pause Overlay -->
  <div
    v-if="gameStore.isPaused"
    class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
  >
    <div class="text-white text-6xl font-bold">{{ t('game.paused') }}</div>
  </div>

  <!-- Loading Bugs Message -->
  <div
    v-if="gameStore.bugs.length === 0 && gameStore.isPlaying"
    class="absolute inset-0 flex items-center justify-center"
  >
    <div class="text-gray-500 text-xl">{{ t('game.loadingBugs') }}</div>
  </div>

  <!-- Get Ready Message -->
  <div
    v-if="!gameStore.isPlaying && !gameStore.isPaused"
    class="absolute inset-0 flex items-center justify-center"
  >
    <div class="text-center">
      <div class="text-4xl text-gray-600 mb-4">{{ t('game.getReady') }}</div>
      <div class="text-lg text-gray-500">
        {{ t('instructions.levelStarting', { level: gameStore.currentLevel }) }}
      </div>
    </div>
  </div>
</template>
