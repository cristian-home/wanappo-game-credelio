<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'

const gameStore = useGameStore()
const { t } = useI18n()
</script>

<template>
  <div class="flex gap-6">
    <div
      class="outline-yellow flex flex-row items-center justify-center gap-2 rounded-2xl bg-white px-4 py-1 outline-8 outline-solid"
    >
      <div class="text-black">{{ t('stats.level') }}</div>
      <div class="text-primary-green font-bold">{{ gameStore.currentLevel }}</div>
    </div>
    <div
      class="outline-yellow flex flex-row items-center justify-center gap-2 rounded-2xl bg-white px-4 py-1 outline-8 outline-solid"
    >
      <div class="text-black">{{ t('stats.score') }}</div>
      <div class="text-primary-green font-bold">{{ gameStore.score }}</div>
    </div>
    <div
      class="outline-orange flex flex-row items-center justify-center gap-2 rounded-2xl bg-white px-4 py-1 outline-8 outline-solid"
    >
      <div class="text-black">{{ t('stats.time') }}</div>
      <div
        class="font-bold"
        :class="gameStore.timeLeft <= 10 ? 'animate-pulse text-red-500' : 'text-orange'"
      >
        {{ gameStore.timeLeft }}s
      </div>
    </div>
    <div
      class="outline-magenta flex flex-row items-center justify-center gap-2 rounded-2xl bg-white px-4 py-1 outline-8 outline-solid"
    >
      <div class="text-black">{{ t('stats.bugsLeft') }}</div>
      <div class="text-magenta font-bold">{{ gameStore.bugsRemaining }}</div>
    </div>
  </div>
</template>
