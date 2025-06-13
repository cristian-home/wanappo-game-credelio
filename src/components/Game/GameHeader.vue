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
  <div class="bg-white rounded-lg shadow-md p-4 mb-4">
    <div class="flex justify-between items-center">
      <GameStats />
      <GameControls @toggle-pause="handleTogglePause" @go-home="handleGoHome" />
    </div>
  </div>
</template>
