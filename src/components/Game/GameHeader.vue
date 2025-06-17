<script setup lang="ts">
import GameStats from './GameStats.vue'
import GameControls from './GameControls.vue'

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
  <div class="overflow-visible">
    <div class="flex h-auto w-full flex-col items-center justify-between gap-6 md:flex-row">
      <GameStats />
      <GameControls @toggle-pause="handleTogglePause" @go-home="handleGoHome" />
    </div>
  </div>
</template>
