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
  <div class="flex space-x-3">
    <button
      @click="handleTogglePause"
      :disabled="!gameStore.isPlaying"
      :class="[
        'control-btn',
        {
          'active border-yellow-500 bg-yellow-500 text-white': gameStore.isPaused,
          'hover:border-yellow-400 hover:bg-yellow-100': !gameStore.isPaused && gameStore.isPlaying,
        },
      ]"
    >
      {{ gameStore.isPaused ? t('game.resume') : t('game.pause') }}
    </button>
    <button
      @click="handleGoHome"
      class="control-btn hover:border-red-400 hover:bg-red-100 hover:text-red-700"
    >
      {{ t('game.quit') }}
    </button>
  </div>
</template>
