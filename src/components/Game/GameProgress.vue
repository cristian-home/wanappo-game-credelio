<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'

const gameStore = useGameStore()
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-row items-center justify-center gap-4">
    <div class="text-sm font-medium text-white">
      {{ t('stats.level') }} {{ gameStore.currentLevel }} / {{ gameStore.maxLevel }}
    </div>
    <div class="outline-yellow outiline-solid h-3 grow overflow-hidden rounded-full outline-4">
      <div
        class="progress-fill overflow-hidden"
        :style="{ width: (gameStore.currentLevel / gameStore.maxLevel) * 100 + '%' }"
      ></div>
    </div>
  </div>
</template>
