import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/game-play',
      name: 'game-play',
      component: () => import('../views/GamePlayView.vue'),
    },
    {
      path: '/game-over',
      name: 'game-over',
      component: () => import('../views/GameOverView.vue'),
    },
  ],
})

export default router
