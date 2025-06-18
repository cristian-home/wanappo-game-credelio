<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { useLanguageStore } from '@/stores/language'
import {
  clearAllLocalStorage,
  clearAllPiniaStores,
  forceReload,
  reloadWithCacheBust,
  clearEverything,
} from '@/utils/cache'

const gameStore = useGameStore()
const languageStore = useLanguageStore()
const isVisible = ref(false)

// Only show in development mode
const isDevelopment = import.meta.env.MODE === 'development'

const actions = [
  {
    label: 'Clear All LocalStorage',
    action: clearAllLocalStorage,
    color: 'bg-yellow-500 hover:bg-yellow-600',
  },
  {
    label: 'Clear Pinia Stores',
    action: clearAllPiniaStores,
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    label: 'Clear Game Store',
    action: () => gameStore.clearPersistedState(),
    color: 'bg-red-500 hover:bg-red-600',
  },
  {
    label: 'Clear Language Store',
    action: () => languageStore.clearPersistedState(),
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    label: 'Force Reload',
    action: forceReload,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    label: 'Reload with Cache Bust',
    action: reloadWithCacheBust,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    label: 'Clear Everything',
    action: clearEverything,
    color: 'bg-gray-800 hover:bg-gray-900',
  },
]

function handleAction(action: () => void | Promise<void>) {
  try {
    action()
  } catch (error) {
    console.error('Error executing action:', error)
  }
}
</script>

<template>
  <div v-if="isDevelopment" class="fixed right-4 bottom-4 z-50">
    <!-- Toggle Button -->
    <button
      @click="isVisible = !isVisible"
      class="mb-2 rounded-full bg-gray-700 p-3 text-white shadow-lg hover:bg-gray-600"
      title="Toggle Dev Tools"
    >
      🛠️
    </button>

    <!-- Tools Panel -->
    <div
      v-if="isVisible"
      class="w-full max-w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-xl"
    >
      <h3 class="mb-3 text-lg font-semibold text-gray-800">🧹 Cache Dev Tools</h3>

      <div class="space-y-2">
        <button
          v-for="item in actions"
          :key="item.label"
          @click="handleAction(item.action)"
          :class="item.color"
          class="w-full rounded px-3 py-2 text-sm font-medium text-white transition-colors"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="mt-4 text-xs text-gray-500">
        <p>⚠️ Development mode only</p>
        <p>Press F12 to see console logs</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styling if needed */
</style>
