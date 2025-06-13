<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'

const gameStore = useGameStore()
const { t } = useI18n()
</script>

<template>
  <!-- Pause Overlay -->
  <div v-if="gameStore.isPaused" class="game-overlay">
    <div class="overlay-content">
      <div class="text-primary-green mb-4 text-6xl font-bold">⏸️</div>
      <div class="text-4xl font-bold text-gray-700">{{ t('game.paused') }}</div>
    </div>
  </div>

  <!-- Loading Bugs Message -->
  <div
    v-if="gameStore.bugs.length === 0 && gameStore.isPlaying"
    class="absolute inset-0 flex items-center justify-center"
  >
    <div class="animate-pulse text-xl text-gray-500">{{ t('game.loadingBugs') }}</div>
  </div>

  <!-- Get Ready Message -->
  <div v-if="!gameStore.isPlaying && !gameStore.isPaused" class="game-overlay">
    <div class="overlay-content">
      <div class="text-primary-green mb-4 text-6xl font-bold">🎯</div>
      <div class="mb-4 text-4xl font-bold text-gray-700">{{ t('game.getReady') }}</div>
      <div class="text-lg text-gray-600">
        {{ t('instructions.levelStarting', { level: gameStore.currentLevel }) }}
      </div>
    </div>
  </div>
</template>
