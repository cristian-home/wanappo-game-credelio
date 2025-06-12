import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Bug {
  id: string
  x: number
  y: number
  speed: number
  isAlive: boolean
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
    const maxLevel = ref(10)
    const baseTimeLimit = ref(30) // seconds
    const baseBugCount = ref(3)
    const baseSpeed = ref(1)

    // Computed properties
    const bugsRemaining = computed(() => bugs.value.filter((bug) => bug.isAlive).length)

    const levelTimeLimit = computed(() =>
      Math.max(10, baseTimeLimit.value - (currentLevel.value - 1) * 2),
    )

    const levelBugCount = computed(
      () => baseBugCount.value + Math.floor((currentLevel.value - 1) / 2),
    )

    const levelSpeed = computed(() => baseSpeed.value + (currentLevel.value - 1) * 0.3)

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
        bugs.value.push({
          id: `bug-${currentLevel.value}-${i}`,
          x: Math.random() * 800, // Will be adjusted based on screen size
          y: Math.random() * 600,
          speed: levelSpeed.value,
          isAlive: true,
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
      completeLevel,
      gameOver,
      pauseGame,
      resetGame,
      updateTimer,
    }
  },
  {
    persist: true,
  },
)
