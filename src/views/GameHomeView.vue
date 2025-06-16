<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import BottomStripe from '@/components/UI/BottomStripe.vue'
import LogoElanco from '@/assets/img/logo-elanco-color.svg?skipsvgo'
import LogoCredelioMono from '@/assets/img/logo-credelio-singleline-mono-alt.svg'
import TickImg from '@/assets/img/tick.svg'
import FleaImg from '@/assets/img/flea.svg'
import GameHomeModal from '@/components/Game/GameHomeModal.vue'

const router = useRouter()
const gameStore = useGameStore()

const startNewGame = () => {
  gameStore.startNewGame()
  router.push('/game-play')
}
</script>

<template>
  <div
    class="relative flex min-h-dvh w-screen items-center justify-center overflow-hidden px-4 py-16"
  >
    <!-- Logos -->
    <div class="fixed top-0 left-0 flex w-full justify-between gap-4 p-4">
      <LogoCredelioMono class="z-20 w-64" />
      <LogoElanco class="w-32" />
    </div>

    <!-- Floating bugs decoration -->
    <TickImg class="fixed top-40 left-10 w-12 rotate-180 text-4xl text-white" />
    <TickImg class="fixed top-40 right-10 w-16 -rotate-45 text-3xl text-white" />
    <TickImg class="fixed bottom-20 left-20 w-16 rotate-45 text-3xl text-white" />
    <TickImg class="fixed right-10 bottom-10 w-16 text-4xl text-white" />
    <FleaImg class="fixed bottom-50 left-10 w-8 rotate-[45deg] text-4xl text-white" />

    <!-- Main Card -->
    <GameHomeModal @modal-button-click="startNewGame" />

    <!-- Bottom Stripe -->
    <BottomStripe />
  </div>
</template>
