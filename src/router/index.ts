import { createRouter, createWebHashHistory } from 'vue-router'
import GameHomeView from '../views/GameHomeView.vue'
import { useGameStore } from '../stores/game'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GameHomeView,
    },
    {
      path: '/game-play',
      name: 'game-play',
      component: () => import('../views/GamePlayView.vue'),
      beforeEnter: (to, from, next) => {
        const gameStore = useGameStore()
        // Allow access only if game is active (playing, paused, or transitioning between levels)
        if (
          gameStore.isPlaying ||
          gameStore.isPaused ||
          (gameStore.currentLevel > 1 && !gameStore.isGameOver && !gameStore.isGameWon)
        ) {
          next()
        } else {
          // Redirect to home if no active game
          next('/')
        }
      },
    },
    {
      path: '/game-over',
      name: 'game-over',
      component: () => import('../views/GameOverView.vue'),
      beforeEnter: (to, from, next) => {
        const gameStore = useGameStore()
        // Allow access only if game is actually over
        if (gameStore.isGameOver) {
          next()
        } else {
          // Redirect to appropriate screen based on game state
          if (gameStore.isPlaying || gameStore.isPaused) {
            next('/game-play')
          } else if (gameStore.isGameWon) {
            next('/game-won')
          } else {
            next('/')
          }
        }
      },
    },
    {
      path: '/game-won',
      name: 'game-won',
      component: () => import('../views/GameWonView.vue'),
      beforeEnter: (to, from, next) => {
        const gameStore = useGameStore()
        // Allow access only if game is actually won
        if (gameStore.isGameWon) {
          next()
        } else {
          // Redirect to appropriate screen based on game state
          if (gameStore.isPlaying || gameStore.isPaused) {
            next('/game-play')
          } else if (gameStore.isGameOver) {
            next('/game-over')
          } else {
            next('/')
          }
        }
      },
    },
    {
      // Catch-all route for 404s
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
