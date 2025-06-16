<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'
import BottomStripe from '@/components/UI/BottomStripe.vue'
import LogoElanco from '@/assets/img/logo-elanco-color.svg?skipsvgo'
import LogoCredelioMono from '@/assets/img/logo-credelio-singleline-mono-alt.svg'
import TickImg from '@/assets/img/tick.svg'
import FleaImg from '@/assets/img/flea.svg'

const router = useRouter()
const gameStore = useGameStore()
const { t } = useI18n()

const startNewGame = () => {
  gameStore.startNewGame()
  router.push('/game-play')
}
</script>

<template>
  <div class="relative flex min-h-dvh w-screen items-center justify-center overflow-x-hidden p-4">
    <!-- Logos -->
    <div class="absolute top-0 left-0 flex w-full justify-between gap-4 p-4">
      <LogoCredelioMono class="z-20 w-64" />
      <LogoElanco class="w-32" />
    </div>

    <!-- Floating bugs decoration -->
    <TickImg class="absolute top-40 left-10 w-12 text-4xl text-white" />
    <TickImg class="absolute top-40 right-10 w-16 -rotate-45 text-3xl text-white" />
    <TickImg class="absolute bottom-20 left-20 w-16 rotate-45 text-3xl text-white" />
    <TickImg class="absolute right-10 bottom-10 w-16 text-4xl text-white" />
    <FleaImg class="absolute bottom-50 left-10 w-8 rotate-[45deg] text-4xl text-white" />

    <!-- Main Card -->
    <div
      class="bg-bright-green outline-yellow relative z-10 flex w-full max-w-2xl flex-col items-center justify-center gap-4 rounded-4xl p-6 text-white shadow-lg outline-4 outline-solid"
    >
      <TickImg
        class="absolute top-0 right-0 z-0 w-32 translate-x-[30%] -translate-y-[30%] rotate-[230deg]"
      />
      <TickImg class="absolute top-20 left-10 z-0 w-12 rotate-45" />
      <FleaImg class="absolute right-0 bottom-0 z-0 w-16 translate-y-[30%] rotate-y-180" />
      <FleaImg class="absolute bottom-10 left-0 z-0 w-16 translate-y-[30%] rotate-45" />
      <h1 class="text-yellow text-center text-4xl font-extrabold uppercase">
        {{ t('game.title') }}
      </h1>
      <div class="w-full max-w-80 text-center">
        <h2 class="text-xl font-semibold">Inicio:</h2>
        <p>¡Pulgas y garrapatas al ataque!</p>
        <p>¿Puedes detenerlas a tiempo?</p>
        <h2 class="mt-2 text-xl font-semibold">Reto:</h2>
        <p>Actúa rápido. Credelio Plus las elimina antes de que piquen.</p>
      </div>
      <div
        class="z-10 w-full max-w-lg rounded-lg bg-white p-4 text-center text-black inset-shadow-[0_0_10px_rgba(0,0,0,1)]"
      >
        <h3 class="instructions-title mb-4 text-xl">{{ t('instructions.howToPlay') }}</h3>
        <ul class="instructions-list text-left">
          <li class="instructions-item">{{ t('instructions.clickBugs') }}</li>
          <li class="instructions-item">{{ t('instructions.clearAllBugs') }}</li>
          <li class="instructions-item">{{ t('instructions.levelProgression') }}</li>
          <li class="instructions-item">
            {{ t('instructions.completeAllLevels', { maxLevel: gameStore.maxLevel }) }}
          </li>
        </ul>
      </div>
      <div class="-mb-6 w-full text-center">
        <button @click="startNewGame" class="btn-primary translate-y-1/2 text-3xl font-extrabold">
          {{ t('game.play') }}
        </button>
      </div>
    </div>
    <BottomStripe />
  </div>
</template>
