<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/UI/LanguageSwitcher.vue'

const router = useRouter()
const gameStore = useGameStore()
const { t } = useI18n()

const startNewGame = () => {
  gameStore.startNewGame()
  router.push('/game-play')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <!-- Language Switcher -->
      <div class="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <h1 class="text-6xl font-bold text-gray-800 mb-4">{{ t('game.title') }}</h1>
      <p class="text-xl text-gray-600 mb-8">{{ t('game.subtitle') }}</p>

      <div class="space-y-4">
        <button
          @click="startNewGame"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
        >
          {{ t('game.newGame') }}
        </button>

        <div class="text-sm text-gray-500 max-w-md mx-auto">
          <h3 class="font-semibold mb-2">{{ t('instructions.howToPlay') }}</h3>
          <ul class="text-left space-y-1">
            <li>• {{ t('instructions.clickBugs') }}</li>
            <li>• {{ t('instructions.clearAllBugs') }}</li>
            <li>• {{ t('instructions.levelProgression') }}</li>
            <li>• {{ t('instructions.completeAllLevels', { maxLevel: gameStore.maxLevel }) }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
