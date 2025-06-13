<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'
// import LanguageSwitcher from '@/components/UI/LanguageSwitcher.vue'

const router = useRouter()
const gameStore = useGameStore()
const { t } = useI18n()

const startNewGame = () => {
  gameStore.startNewGame()
  router.push('/game-play')
}
</script>

<template>
  <div class="game-background flex min-h-screen items-center justify-center p-4">
    <!-- Floating bugs decoration -->
    <div class="animate-float absolute top-10 left-10 text-4xl text-white">🦗</div>
    <div class="animate-bounce-gentle absolute top-20 right-20 text-3xl text-white">🕷️</div>
    <div class="animate-pulse-slow absolute bottom-20 left-20 text-3xl text-white">🐛</div>
    <div class="animate-float absolute right-10 bottom-10 text-4xl text-white">🦟</div>

    <!-- Language Switcher -->
    <!-- <div class="absolute top-4 right-4 z-10">
      <LanguageSwitcher />
    </div> -->

    <!-- Main Content -->
    <div class="game-card w-full max-w-2xl text-center">
      <h1 class="game-title mb-4">{{ t('game.title') }}</h1>
      <p class="game-subtitle mb-8 text-gray-600">{{ t('game.subtitle') }}</p>

      <div class="mb-8">
        <button
          @click="startNewGame"
          class="btn-primary animate-bounce-gentle text-xl hover:animate-none"
        >
          {{ t('game.newGame') }}
        </button>
      </div>

      <div class="instructions-card">
        <h3 class="instructions-title mb-4 text-xl">{{ t('instructions.howToPlay') }}</h3>
        <ul class="instructions-list">
          <li class="instructions-item">{{ t('instructions.clickBugs') }}</li>
          <li class="instructions-item">{{ t('instructions.clearAllBugs') }}</li>
          <li class="instructions-item">{{ t('instructions.levelProgression') }}</li>
          <li class="instructions-item">
            {{ t('instructions.completeAllLevels', { maxLevel: gameStore.maxLevel }) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
