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
  if (!gameStore.isGameWon) {
    // If not in game won state, redirect to appropriate screen
    if (gameStore.isPlaying || gameStore.isPaused) {
      router.replace('/game-play')
    } else if (gameStore.isGameOver) {
      router.replace('/game-over')
    } else {
      router.replace('/')
    }
  }
})
</script>

<template>
  <div class="game-background flex min-h-screen items-center justify-center p-4">
    <!-- Confetti and celebration effects -->
    <div class="absolute top-10 left-10 animate-bounce text-6xl text-yellow-400">🎊</div>
    <div class="absolute top-20 right-20 animate-pulse text-5xl text-yellow-400">✨</div>
    <div class="animate-float absolute bottom-20 left-20 text-4xl text-yellow-400">🎈</div>
    <div class="animate-bounce-gentle absolute right-10 bottom-10 text-6xl text-yellow-400">🏆</div>

    <!-- Language Switcher -->
    <!-- <div class="absolute top-4 right-4 z-10">
      <LanguageSwitcher />
    </div> -->

    <div class="game-card glow-yellow mx-auto max-w-md text-center">
      <div class="animate-bounce-gentle mb-6 text-8xl">🎉</div>
      <h1 class="animate-pulse-slow mb-4 text-6xl font-bold text-green-600">
        {{ t('game.victory') }}
      </h1>
      <p class="mb-6 text-xl text-gray-700">
        {{ t('game.congratulations', { maxLevel: gameStore.maxLevel }) }}
      </p>

      <div
        class="mb-8 rounded-lg border-2 border-yellow-400 bg-gradient-to-br from-green-50 to-yellow-50 p-6"
      >
        <h2 class="mb-4 text-2xl font-bold text-gray-800">{{ t('stats.victoryStats') }}</h2>
        <div class="space-y-3">
          <div class="stats-item flex justify-between">
            <span class="stats-label">{{ t('stats.levelsCompleted') }}:</span>
            <span class="stats-value text-green-600"
              >{{ gameStore.maxLevel }}/{{ gameStore.maxLevel }}</span
            >
          </div>
          <div class="stats-item flex justify-between">
            <span class="stats-label">{{ t('stats.finalScore') }}:</span>
            <span class="stats-value text-green-600">{{ gameStore.score }}</span>
          </div>
          <div class="stats-item flex justify-between">
            <span class="stats-label">{{ t('stats.status') }}:</span>
            <span class="stats-value text-yellow-600">{{ t('game.bugMaster') }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <button @click="playAgain" class="btn-primary glow-green w-full">
          {{ t('game.playAgain') }}
        </button>

        <button @click="goHome" class="btn-secondary w-full">
          {{ t('game.backToHome') }}
        </button>
      </div>

      <div class="bg-opacity-60 mt-8 rounded-lg bg-white p-4 text-sm text-gray-600">
        <p class="font-semibold">{{ t('game.champion') }}</p>
        <p>{{ t('game.shareScore', { score: gameStore.score }) }}</p>
      </div>
    </div>
  </div>
</template>
