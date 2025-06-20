import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Bug {
  id: string
  x: number
  y: number
  speed: number
  isAlive: boolean
  velocityX: number
  velocityY: number
  targetX: number
  targetY: number
}

export interface GameState {
  currentLevel: number
  score: number
  bugs: Bug[]
  timeLeft: number
  isPlaying: boolean
  isGameOver: boolean
  isGameWon: boolean
  isPaused: boolean
}

export const useGameStore = defineStore(
  'game',
  () => {
    // Game state
    const currentLevel = ref(1)
    const score = ref(0)
    const bugs = ref<Bug[]>([])
    const timeLeft = ref(0)
    const isPlaying = ref(false)
    const isGameOver = ref(false)
    const isGameWon = ref(false)
    const isPaused = ref(false)

    // Game configuration
    const maxLevel = ref(4)
    const baseTimeLimit = ref(15) // seconds
    const baseBugCount = ref(8)
    const baseSpeed = ref(2) // Increased from 1 to 2 for more noticeable movement

    // Computed properties
    const bugsRemaining = computed(() => bugs.value.filter((bug) => bug.isAlive).length)

    const levelTimeLimit = computed(() =>
      Math.max(10, baseTimeLimit.value - (currentLevel.value - 1) * 2),
    )

    const levelBugCount = computed(() => baseBugCount.value + (currentLevel.value - 1) * 2)

    const levelSpeed = computed(() => baseSpeed.value + (currentLevel.value - 1) * 0.8)

    const isLevelComplete = computed(() => bugsRemaining.value === 0 && isPlaying.value)

    // Actions
    const startNewGame = () => {
      currentLevel.value = 1
      score.value = 0
      isGameOver.value = false
      isGameWon.value = false
      isPaused.value = false
      startLevel()
    }

    const startLevel = () => {
      isPlaying.value = true
      timeLeft.value = levelTimeLimit.value
      generateBugs()
    }

    const generateBugs = () => {
      bugs.value = []
      for (let i = 0; i < levelBugCount.value; i++) {
        const x = Math.random() * 768 // Leave some margin from edges (800 - 32)
        const y = Math.random() * 568 // Leave some margin from edges (600 - 32)
        // Each bug has slightly different speed for variety
        const bugSpeed = levelSpeed.value * (0.7 + Math.random() * 0.6) // Speed between 0.7x and 1.3x
        bugs.value.push({
          id: `bug-${currentLevel.value}-${i}`,
          x,
          y,
          speed: bugSpeed,
          isAlive: true,
          velocityX: (Math.random() - 0.5) * 4, // Random direction between -2 and 2
          velocityY: (Math.random() - 0.5) * 4,
          targetX: Math.random() * 768,
          targetY: Math.random() * 568,
        })
      }
    }

    const spikeBug = (bugId: string) => {
      const bug = bugs.value.find((b) => b.id === bugId)
      if (bug && bug.isAlive) {
        bug.isAlive = false
        score.value += 10 * currentLevel.value

        if (isLevelComplete.value) {
          completeLevel()
        }
      }
    }

    const removeBug = (bugId: string) => {
      const index = bugs.value.findIndex((b) => b.id === bugId)
      if (index !== -1) {
        bugs.value.splice(index, 1)
      }
    }

    const completeLevel = () => {
      isPlaying.value = false

      if (currentLevel.value >= maxLevel.value) {
        // Game won - completed all levels
        isGameWon.value = true
      } else {
        // Advance to next level
        currentLevel.value++
        // Add bonus points for remaining time
        score.value += timeLeft.value * 5
        setTimeout(() => {
          startLevel()
        }, 2000) // 2 second delay before next level
      }
    }

    const gameOver = () => {
      isPlaying.value = false
      isGameOver.value = true
    }

    const pauseGame = () => {
      if (isPlaying.value) {
        isPaused.value = !isPaused.value
      }
    }

    const resetGame = () => {
      currentLevel.value = 1
      score.value = 0
      bugs.value = []
      timeLeft.value = 0
      isPlaying.value = false
      isGameOver.value = false
      isGameWon.value = false
      isPaused.value = false
    }

    const updateTimer = () => {
      if (isPlaying.value && !isPaused.value && timeLeft.value > 0) {
        timeLeft.value--
        if (timeLeft.value <= 0) {
          gameOver()
        }
      }
    }

    const updateBugPositions = (gameAreaWidth: number = 800, gameAreaHeight: number = 600) => {
      if (!isPlaying.value || isPaused.value) return

      bugs.value.forEach((bug) => {
        if (!bug.isAlive) return

        // Move bug towards target or create new target
        const distanceToTarget = Math.sqrt(
          Math.pow(bug.targetX - bug.x, 2) + Math.pow(bug.targetY - bug.y, 2),
        )

        // If close to target or no target, set new random target
        if (distanceToTarget < 20 || (bug.targetX === bug.x && bug.targetY === bug.y)) {
          bug.targetX = Math.random() * (gameAreaWidth - 32) // Account for bug size
          bug.targetY = Math.random() * (gameAreaHeight - 32)
        }

        // Calculate direction to target
        const directionX = bug.targetX - bug.x
        const directionY = bug.targetY - bug.y
        const distance = Math.sqrt(directionX * directionX + directionY * directionY)

        if (distance > 0) {
          // Normalize direction and apply speed with some randomness
          const speedMultiplier = 0.8 + Math.random() * 0.4 // Random speed between 0.8x and 1.2x
          bug.velocityX = (directionX / distance) * bug.speed * speedMultiplier
          bug.velocityY = (directionY / distance) * bug.speed * speedMultiplier

          // Add some random jitter to make movement more erratic
          bug.velocityX += (Math.random() - 0.5) * 0.5
          bug.velocityY += (Math.random() - 0.5) * 0.5
        }

        // Update position
        bug.x += bug.velocityX
        bug.y += bug.velocityY

        // Keep bugs within bounds and bounce off walls
        if (bug.x < 0) {
          bug.x = 0
          bug.velocityX = Math.abs(bug.velocityX)
          bug.targetX = Math.random() * (gameAreaWidth - 32)
        }
        if (bug.x > gameAreaWidth - 32) {
          bug.x = gameAreaWidth - 32
          bug.velocityX = -Math.abs(bug.velocityX)
          bug.targetX = Math.random() * (gameAreaWidth - 32)
        }
        if (bug.y < 0) {
          bug.y = 0
          bug.velocityY = Math.abs(bug.velocityY)
          bug.targetY = Math.random() * (gameAreaHeight - 32)
        }
        if (bug.y > gameAreaHeight - 32) {
          bug.y = gameAreaHeight - 32
          bug.velocityY = -Math.abs(bug.velocityY)
          bug.targetY = Math.random() * (gameAreaHeight - 32)
        }
      })
    }

    return {
      // State
      currentLevel,
      score,
      bugs,
      timeLeft,
      isPlaying,
      isGameOver,
      isGameWon,
      isPaused,
      maxLevel,

      // Computed
      bugsRemaining,
      levelTimeLimit,
      levelBugCount,
      levelSpeed,
      isLevelComplete,

      // Actions
      startNewGame,
      startLevel,
      generateBugs,
      spikeBug,
      removeBug,
      completeLevel,
      gameOver,
      pauseGame,
      resetGame,
      updateTimer,
      updateBugPositions,
    }
  },
  {
    persist: true,
  },
)
