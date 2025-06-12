<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/UI/LanguageSwitcher.vue'

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
  <div class="min-h-screen flex items-center justify-center bg-green-50">
    <!-- Language Switcher -->
    <div class="absolute top-4 right-4">
      <LanguageSwitcher />
    </div>

    <div class="text-center max-w-md mx-auto p-8">
      <div class="text-8xl mb-6">🎉</div>
      <h1 class="text-6xl font-bold text-green-600 mb-4">{{ t('game.victory') }}</h1>
      <p class="text-xl text-gray-700 mb-6">
        {{ t('game.congratulations', { maxLevel: gameStore.maxLevel }) }}
      </p>

      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ t('stats.victoryStats') }}</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">{{ t('stats.levelsCompleted') }}:</span>
            <span class="font-bold text-green-600"
              >{{ gameStore.maxLevel }}/{{ gameStore.maxLevel }}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">{{ t('stats.finalScore') }}:</span>
            <span class="font-bold text-green-600">{{ gameStore.score }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">{{ t('stats.status') }}:</span>
            <span class="font-bold text-yellow-600">{{ t('game.bugMaster') }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <button
          @click="playAgain"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
        >
          {{ t('game.playAgain') }}
        </button>

        <button
          @click="goHome"
          class="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
        >
          {{ t('game.backToHome') }}
        </button>
      </div>

      <div class="mt-8 text-sm text-gray-500">
        <p>{{ t('game.champion') }}</p>
        <p>{{ t('game.shareScore', { score: gameStore.score }) }}</p>
      </div>
    </div>
  </div>
</template>
