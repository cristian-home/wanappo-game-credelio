<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

const startNewGame = () => {
  gameStore.startNewGame()
  router.push('/game-play')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-800 mb-4">Bug Spike</h1>
      <p class="text-xl text-gray-600 mb-8">Spike all the bugs before time runs out!</p>

      <div class="space-y-4">
        <button
          @click="startNewGame"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
        >
          New Game
        </button>

        <div class="text-sm text-gray-500 max-w-md mx-auto">
          <h3 class="font-semibold mb-2">How to Play:</h3>
          <ul class="text-left space-y-1">
            <li>• Click on bugs to spike them</li>
            <li>• Clear all bugs before time runs out</li>
            <li>• Each level gets faster and more challenging</li>
            <li>• Complete all {{ gameStore.maxLevel }} levels to win!</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
