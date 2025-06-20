<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import GameHeader from '@/components/Game/GameHeader.vue'
import GameBoard from '@/components/Game/GameBoard.vue'
import GameProgress from '@/components/Game/GameProgress.vue'
import { useMotion } from '@vueuse/motion'

const router = useRouter()
const gameStore = useGameStore()

const gameBoardRef = ref<InstanceType<typeof GameBoard>>()
const gameHeaderRef = ref<HTMLElement>()
const gameProgressRef = ref<HTMLElement>()
const gameBoardWrapperRef = ref<HTMLElement>()

let gameTimer: ReturnType<typeof setInterval> | null = null
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

const handleBugSplatted = (bugId: string) => {
  gameStore.removeBug(bugId)
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

const enterAnimation = () => {
  useMotion(gameHeaderRef.value, {
    initial: { opacity: 0, y: -50 },
    enter: { opacity: 1, y: 0, transition: { duration: 600, delay: 100 } },
  })

  useMotion(gameProgressRef.value, {
    initial: { opacity: 0, y: -30 },
    enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 300 } },
  })

  useMotion(gameBoardWrapperRef.value, {
    initial: { opacity: 0, scale: 0.9, y: 0 },
    enter: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', duration: 800, delay: 500 },
    },
  })
}

const leaveAnimation = async () => {
  const headerMotion = useMotion(gameHeaderRef.value, {
    initial: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -50, transition: { duration: 400 } },
  })

  const progressMotion = useMotion(gameProgressRef.value, {
    initial: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -30, transition: { duration: 400, delay: 100 } },
  })

  const boardMotion = useMotion(gameBoardWrapperRef.value, {
    initial: { opacity: 1, scale: 1, y: 0 },
    leave: {
      opacity: 0,
      scale: 0.9,
      y: 0,
      transition: { duration: 600, delay: 200 },
    },
  })

  // Apply leave animations in parallel
  await Promise.all([
    headerMotion.apply('leave'),
    progressMotion.apply('leave'),
    boardMotion.apply('leave'),
  ])
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

  // Start enter animations
  enterAnimation()
})

onBeforeRouteLeave(async (to, from, next) => {
  // If navigating away while game is active, abort the navigation
  if (gameStore.isPlaying || gameStore.isPaused) {
    next(false) // Prevent navigation
  } else {
    // Play leave animation before navigating
    console.log('Leaving GamePlayView, preparing animations...')
    await leaveAnimation()
    console.log('Animations completed, navigating to:', to.fullPath)
    next() // Allow navigation if game is not active
  }
})

onUnmounted(() => {
  stopGameTimer()
  stopMovementTimer()
})
</script>

<template>
  <div
    class="grid h-dvh w-screen grid-cols-3 gap-4 p-8"
    style="grid-template-rows: auto repeat(4, 1fr)"
  >
    <!-- Game Header -->
    <div class="col-span-3 flex flex-col items-center justify-between gap-6">
      <GameHeader
        class="w-full"
        ref="gameHeaderRef"
        @toggle-pause="togglePause"
        @go-home="goHome"
      />
      <!-- Level Progress -->
      <GameProgress class="w-full" ref="gameProgressRef" />
    </div>

    <!-- Game Area -->
    <div class="col-span-3 row-span-4 row-start-2 w-full" ref="gameBoardWrapperRef">
      <GameBoard
        class="relative h-full w-full"
        ref="gameBoardRef"
        @bug-click="handleBugClick"
        @bug-splatted="handleBugSplatted"
        @board-ready="handleBoardReady"
      />
    </div>
  </div>
</template>
