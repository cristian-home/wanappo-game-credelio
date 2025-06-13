<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'
// import LanguageSwitcher from '@/components/UI/LanguageSwitcher.vue'

const router = useRouter()
const gameStore = useGameStore()
const { t } = useI18n()

const playAgain = () => {
  gameStore.startNewGame()
  router.push('/game-play')
}

const goHome = () => {
  gameStore.resetGame()
  router.push('/')
}

// Protect against direct navigation
onMounted(() => {
  if (!gameStore.isGameOver) {
    // If not in game over state, redirect to appropriate screen
    if (gameStore.isPlaying || gameStore.isPaused) {
      router.replace('/game-play')
    } else if (gameStore.isGameWon) {
      router.replace('/game-won')
    } else {
      router.replace('/')
    }
  }
})
</script>

<template>
  <div class="game-background flex min-h-screen items-center justify-center p-4">
    <!-- Language Switcher -->
    <!-- <div class="absolute top-4 right-4 z-10">
      <LanguageSwitcher />
    </div> -->

    <div class="game-card mx-auto max-w-md text-center">
      <div class="mb-6 text-8xl">💀</div>
      <h1 class="mb-4 text-6xl font-bold text-red-600">{{ t('game.gameOver') }}</h1>
      <p class="mb-6 text-xl text-gray-700">{{ t('game.timeUp') }}</p>

      <div class="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h2 class="mb-4 text-2xl font-bold text-gray-800">{{ t('stats.finalStats') }}</h2>
        <div class="space-y-3">
          <div class="stats-item flex justify-between">
            <span class="stats-label">{{ t('stats.levelReached') }}:</span>
            <span class="stats-value text-blue-600">{{ gameStore.currentLevel }}</span>
          </div>
          <div class="stats-item flex justify-between">
            <span class="stats-label">{{ t('stats.finalScore') }}:</span>
            <span class="stats-value text-green-600">{{ gameStore.score }}</span>
          </div>
          <div class="stats-item flex justify-between">
            <span class="stats-label">{{ t('stats.bugsRemaining') }}:</span>
            <span class="stats-value text-red-600">{{ gameStore.bugsRemaining }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <button @click="playAgain" class="btn-primary w-full">
          {{ t('game.tryAgain') }}
        </button>

        <button @click="goHome" class="btn-secondary w-full">
          {{ t('game.backToHome') }}
        </button>
      </div>
    </div>
  </div>
</template>
