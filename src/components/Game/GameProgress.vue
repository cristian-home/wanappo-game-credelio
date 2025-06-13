<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'

const gameStore = useGameStore()
const { t } = useI18n()
</script>

<template>
  <div class="mt-4 bg-white rounded-lg shadow-md p-4">
    <div class="text-sm text-gray-500 mb-2">
      {{ t('stats.progress') }}: {{ t('stats.level') }} {{ gameStore.currentLevel }} /
      {{ gameStore.maxLevel }}
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div
        class="bg-blue-600 h-2 rounded-full transition-all duration-300"
        :style="{ width: (gameStore.currentLevel / gameStore.maxLevel) * 100 + '%' }"
      ></div>
    </div>
  </div>
</template>
