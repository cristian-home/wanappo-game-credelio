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
  <div class="header-panel mb-4">
    <div class="flex items-center justify-between">
      <GameStats />
      <GameControls @toggle-pause="handleTogglePause" @go-home="handleGoHome" />
    </div>
  </div>
</template>
