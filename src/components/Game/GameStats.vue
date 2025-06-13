<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'

const gameStore = useGameStore()
const { t } = useI18n()
</script>

<template>
  <div class="flex space-x-6">
    <div class="text-center">
      <div class="text-sm text-gray-500">{{ t('stats.level') }}</div>
      <div class="text-2xl font-bold text-blue-600">{{ gameStore.currentLevel }}</div>
    </div>
    <div class="text-center">
      <div class="text-sm text-gray-500">{{ t('stats.score') }}</div>
      <div class="text-2xl font-bold text-green-600">{{ gameStore.score }}</div>
    </div>
    <div class="text-center">
      <div class="text-sm text-gray-500">{{ t('stats.time') }}</div>
      <div
        class="text-2xl font-bold"
        :class="gameStore.timeLeft <= 10 ? 'text-red-600' : 'text-orange-600'"
      >
        {{ gameStore.timeLeft }}s
      </div>
    </div>
    <div class="text-center">
      <div class="text-sm text-gray-500">{{ t('stats.bugsLeft') }}</div>
      <div class="text-2xl font-bold text-purple-600">{{ gameStore.bugsRemaining }}</div>
    </div>
  </div>
</template>
