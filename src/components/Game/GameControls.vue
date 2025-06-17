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
  <div class="flex gap-2">
    <button
      @click="handleTogglePause"
      :disabled="!gameStore.isPlaying"
      :class="[
        'btn-primary rounded-l-full rounded-r-none bg-yellow-700 px-4 py-2 text-sm font-semibold outline-6 hover:scale-100',
        {
          'active border-yellow-900 bg-yellow-500 text-white': gameStore.isPaused,
          'hover:border-yellow-400 hover:bg-yellow-500': !gameStore.isPaused && gameStore.isPlaying,
        },
      ]"
    >
      {{ gameStore.isPaused ? t('game.resume') : t('game.pause') }}
    </button>
    <button
      @click="handleGoHome"
      class="btn-primary rounded-l-none rounded-r-full bg-red-500 px-4 py-2 text-sm font-semibold outline-6 hover:scale-100 hover:border-red-400 hover:bg-red-100 hover:text-red-700"
    >
      {{ t('game.quit') }}
    </button>
  </div>
</template>
