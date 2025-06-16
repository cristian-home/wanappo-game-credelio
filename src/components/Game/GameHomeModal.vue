<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useGameStore } from '@/stores/game'
import TickImg from '@/assets/img/tick.svg'
import FleaImg from '@/assets/img/flea.svg'

const { t } = useI18n()
const gameStore = useGameStore()

// custom event emits to parent component
const emit = defineEmits<{
  (e: 'modalButtonClick'): void
}>()

const handleClick = () => {
  emit('modalButtonClick')
}
</script>

<template>
  <div
    class="bg-bright-green outline-yellow relative z-10 flex w-full max-w-2xl flex-col items-center justify-center gap-4 rounded-4xl p-6 text-white shadow-lg outline-4 outline-solid"
  >
    <TickImg
      class="absolute top-0 right-0 z-0 w-24 translate-x-[30%] -translate-y-[30%] rotate-[230deg]"
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
      class="z-10 w-full max-w-lg rounded-2xl bg-white p-4 text-center text-black inset-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
    >
      <h3 class="text-primary-green text-xl font-semibold">
        {{ t('instructions.howToPlay') }}
      </h3>
      <ul class="list-none text-left">
        <li class="before:pr-2 before:content-['🎯']">{{ t('instructions.clickBugs') }}</li>
        <li class="before:pr-2 before:content-['🎯']">{{ t('instructions.clearAllBugs') }}</li>
        <li class="before:pr-2 before:content-['🎯']">{{ t('instructions.levelProgression') }}</li>
        <li class="before:pr-2 before:content-['🎯']">
          {{ t('instructions.completeAllLevels', { maxLevel: gameStore.maxLevel }) }}
        </li>
      </ul>
    </div>
    <div
      class="-my-6 w-full text-center"
      v-motion
      :initial="{ opacity: 0, y: 100 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 1000, type: 'spring' } }"
    >
      <button class="btn-primary translate-y-1/2 text-3xl font-extrabold" @click="handleClick">
        {{ t('game.play') }}
      </button>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
