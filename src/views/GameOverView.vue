<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

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
  <div class="min-h-screen flex items-center justify-center bg-red-50">
    <div class="text-center max-w-md mx-auto p-8">
      <div class="text-8xl mb-6">💀</div>
      <h1 class="text-6xl font-bold text-red-600 mb-4">Game Over</h1>
      <p class="text-xl text-gray-700 mb-6">Time ran out! Better luck next time.</p>

      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Final Stats</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">Level Reached:</span>
            <span class="font-bold text-blue-600">{{ gameStore.currentLevel }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Final Score:</span>
            <span class="font-bold text-green-600">{{ gameStore.score }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Bugs Remaining:</span>
            <span class="font-bold text-red-600">{{ gameStore.bugsRemaining }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <button
          @click="playAgain"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
        >
          Try Again
        </button>

        <button
          @click="goHome"
          class="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
</template>
