<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'

const gameStore = useGameStore()
const { t } = useI18n()

const emit = defineEmits<{
  togglePause: []
  goHome: []
}>()

const handleTogglePause = () => {
  emit('togglePause')
}

const handleGoHome = () => {
  emit('goHome')
}
</script>

<template>
  <div class="flex space-x-2">
    <button
      @click="handleTogglePause"
      :disabled="!gameStore.isPlaying"
      class="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
    >
      {{ gameStore.isPaused ? t('game.resume') : t('game.pause') }}
    </button>
    <button
      @click="handleGoHome"
      class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
    >
      {{ t('game.quit') }}
    </button>
  </div>
</template>
