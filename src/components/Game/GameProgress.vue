<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'

const gameStore = useGameStore()
const { t } = useI18n()
</script>

<template>
  <div class="header-panel mt-4">
    <div class="mb-3 text-center text-sm font-medium text-gray-600">
      {{ t('stats.progress') }}: {{ t('stats.level') }} {{ gameStore.currentLevel }} /
      {{ gameStore.maxLevel }}
    </div>
    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: (gameStore.currentLevel / gameStore.maxLevel) * 100 + '%' }"
      ></div>
    </div>
  </div>
</template>
