<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
// import LanguageSwitcher from '@/components/UI/LanguageSwitcher.vue'
import GameHeader from '@/components/Game/GameHeader.vue'
import GameBoard from '@/components/Game/GameBoard.vue'
import GameProgress from '@/components/Game/GameProgress.vue'

const router = useRouter()
const gameStore = useGameStore()

const gameBoardRef = ref<InstanceType<typeof GameBoard>>()
let gameTimer: number | null = null
let animationFrameId: number | null = null
let lastMovementUpdate = 0
let gameAreaWidth = 800
let gameAreaHeight = 600

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

const startMovementTimer = () => {
  const animate = (currentTime: number) => {
    if (currentTime - lastMovementUpdate >= 30) {
      // Update every 30ms for smoother movement
      gameStore.updateBugPositions(gameAreaWidth, gameAreaHeight)
      lastMovementUpdate = currentTime
    }

    if (gameStore.isPlaying && !gameStore.isPaused) {
      animationFrameId = requestAnimationFrame(animate)
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

const stopMovementTimer = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

const handleBugClick = (bugId: string) => {
  gameStore.spikeBug(bugId)
}

const handleBoardReady = (width: number, height: number) => {
  gameAreaWidth = width
  gameAreaHeight = height
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
      startMovementTimer()
    } else {
      stopGameTimer()
      stopMovementTimer()
    }
  },
)

watch(
  () => gameStore.isPaused,
  (isPaused) => {
    if (isPaused) {
      stopGameTimer()
      stopMovementTimer()
    } else if (gameStore.isPlaying) {
      startGameTimer()
      startMovementTimer()
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
    startMovementTimer()
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
  stopMovementTimer()
})
</script>

<template>
  <div class="game-background p-4">
    <!-- Language Switcher -->
    <!-- <div class="absolute top-4 right-4 z-20">
      <LanguageSwitcher />
    </div> -->

    <!-- Game Header -->
    <GameHeader @toggle-pause="togglePause" @go-home="goHome" />

    <!-- Game Area -->
    <GameBoard ref="gameBoardRef" @bug-click="handleBugClick" @board-ready="handleBoardReady" />

    <!-- Level Progress -->
    <GameProgress />
  </div>
</template>
