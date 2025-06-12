<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

let gameTimer: number | null = null

const startGameTimer = () => {
  gameTimer = setInterval(() => {
    gameStore.updateTimer()
  }, 1000)
}

const stopGameTimer = () => {
  if (gameTimer) {
    clearInterval(gameTimer)
    gameTimer = null
  }
}

const handleBugClick = (bugId: string) => {
  if (gameStore.isPlaying && !gameStore.isPaused) {
    gameStore.spikeBug(bugId)
  }
}

const togglePause = () => {
  gameStore.pauseGame()
}

const goHome = () => {
  gameStore.resetGame()
  router.push('/')
}

// Watch for game state changes
watch(
  () => gameStore.isGameOver,
  (isGameOver) => {
    if (isGameOver) {
      stopGameTimer()
      router.push('/game-over')
    }
  },
)

watch(
  () => gameStore.isGameWon,
  (isGameWon) => {
    if (isGameWon) {
      stopGameTimer()
      router.push('/game-won')
    }
  },
)

watch(
  () => gameStore.isPlaying,
  (isPlaying) => {
    if (isPlaying && !gameStore.isPaused) {
      startGameTimer()
    } else {
      stopGameTimer()
    }
  },
)

watch(
  () => gameStore.isPaused,
  (isPaused) => {
    if (isPaused) {
      stopGameTimer()
    } else if (gameStore.isPlaying) {
      startGameTimer()
    }
  },
)

onMounted(() => {
  // If no game is active and not transitioning between states, redirect to home
  if (
    !gameStore.isPlaying &&
    !gameStore.isPaused &&
    !gameStore.isGameOver &&
    !gameStore.isGameWon
  ) {
    // Check if we have a current level > 1, which might indicate a game in progress
    if (gameStore.currentLevel === 1 && gameStore.score === 0) {
      router.replace('/')
      return
    }
  }

  // If user somehow got here when game is over or won, redirect appropriately
  if (gameStore.isGameOver) {
    router.replace('/game-over')
    return
  }

  if (gameStore.isGameWon) {
    router.replace('/game-won')
    return
  }

  // Start timer if game is active and not paused
  if (gameStore.isPlaying && !gameStore.isPaused) {
    startGameTimer()
  }
})

onBeforeRouteLeave((to, from, next) => {
  // If navigating away while game is active, abort the navigation
  if (gameStore.isPlaying || gameStore.isPaused) {
    next(false) // Prevent navigation
  } else {
    next() // Allow navigation if game is not active
  }
})

onUnmounted(() => {
  stopGameTimer()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <!-- Game Header -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-4">
      <div class="flex justify-between items-center">
        <div class="flex space-x-6">
          <div class="text-center">
            <div class="text-sm text-gray-500">Level</div>
            <div class="text-2xl font-bold text-blue-600">{{ gameStore.currentLevel }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-500">Score</div>
            <div class="text-2xl font-bold text-green-600">{{ gameStore.score }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-500">Time Left</div>
            <div
              class="text-2xl font-bold"
              :class="gameStore.timeLeft <= 10 ? 'text-red-600' : 'text-orange-600'"
            >
              {{ gameStore.timeLeft }}s
            </div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-500">Bugs Left</div>
            <div class="text-2xl font-bold text-purple-600">{{ gameStore.bugsRemaining }}</div>
          </div>
        </div>

        <div class="flex space-x-2">
          <button
            @click="togglePause"
            :disabled="!gameStore.isPlaying"
            class="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {{ gameStore.isPaused ? 'Resume' : 'Pause' }}
          </button>
          <button
            @click="goHome"
            class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Quit
          </button>
        </div>
      </div>
    </div>

    <!-- Game Area -->
    <div class="bg-white rounded-lg shadow-md relative overflow-hidden" style="height: 600px">
      <!-- Pause Overlay -->
      <div
        v-if="gameStore.isPaused"
        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
      >
        <div class="text-white text-6xl font-bold">PAUSED</div>
      </div>

      <!-- Bugs -->
      <div
        v-for="bug in gameStore.bugs"
        :key="bug.id"
        v-show="bug.isAlive"
        @click="handleBugClick(bug.id)"
        class="absolute w-8 h-8 bg-red-500 rounded-full cursor-pointer hover:bg-red-600 transition-colors flex items-center justify-center text-white font-bold"
        :style="{ left: bug.x + 'px', top: bug.y + 'px' }"
      >
        🐛
      </div>

      <!-- Game Instructions -->
      <div
        v-if="gameStore.bugs.length === 0 && gameStore.isPlaying"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div class="text-gray-500 text-xl">Loading bugs...</div>
      </div>

      <div
        v-if="!gameStore.isPlaying && !gameStore.isPaused"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div class="text-center">
          <div class="text-4xl text-gray-600 mb-4">Get Ready!</div>
          <div class="text-lg text-gray-500">
            Level {{ gameStore.currentLevel }} starting soon...
          </div>
        </div>
      </div>
    </div>

    <!-- Level Progress -->
    <div class="mt-4 bg-white rounded-lg shadow-md p-4">
      <div class="text-sm text-gray-500 mb-2">
        Progress: Level {{ gameStore.currentLevel }} / {{ gameStore.maxLevel }}
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: (gameStore.currentLevel / gameStore.maxLevel) * 100 + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>
