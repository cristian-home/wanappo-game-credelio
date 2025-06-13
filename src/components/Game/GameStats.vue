<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'

const gameStore = useGameStore()
const { t } = useI18n()
</script>

<template>
  <div class="flex space-x-4">
    <div class="stats-item">
      <div class="stats-label">{{ t('stats.level') }}</div>
      <div class="stats-value">{{ gameStore.currentLevel }}</div>
    </div>
    <div class="stats-item">
      <div class="stats-label">{{ t('stats.score') }}</div>
      <div class="stats-value">{{ gameStore.score }}</div>
    </div>
    <div class="stats-item">
      <div class="stats-label">{{ t('stats.time') }}</div>
      <div
        class="stats-value"
        :class="gameStore.timeLeft <= 10 ? 'animate-pulse text-red-500' : 'text-orange-500'"
      >
        {{ gameStore.timeLeft }}s
      </div>
    </div>
    <div class="stats-item">
      <div class="stats-label">{{ t('stats.bugsLeft') }}</div>
      <div class="stats-value text-purple-600">{{ gameStore.bugsRemaining }}</div>
    </div>
  </div>
</template>
