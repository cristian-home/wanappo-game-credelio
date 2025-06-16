<script setup lang="ts">
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import BottomStripe from '@/components/UI/BottomStripe.vue'
import LogoElanco from '@/assets/img/logo-elanco-color.svg?skipsvgo'
import LogoCredelioMono from '@/assets/img/logo-credelio-singleline-mono-alt.svg'
import TickImg from '@/assets/img/tick.svg'
import FleaImg from '@/assets/img/flea.svg'
import GameHomeModal from '@/components/Game/GameHomeModal.vue'
import { onMounted, ref } from 'vue'
import { useMotion } from '@vueuse/motion'

const router = useRouter()
const gameStore = useGameStore()

const logosDivRef = ref<HTMLDivElement | null>()
const gameHomeModalRef = ref<HTMLDivElement | null>()
const bottomStripeRef = ref<HTMLDivElement | null>()

const decorativeBugsRef1 = ref<HTMLElement | null>()
const decorativeBugsRef2 = ref<HTMLElement | null>()
const decorativeBugsRef3 = ref<HTMLElement | null>()
const decorativeBugsRef4 = ref<HTMLElement | null>()
const decorativeBugsRef5 = ref<HTMLElement | null>()

const decorativeBugsRefs = ref([
  decorativeBugsRef1,
  decorativeBugsRef2,
  decorativeBugsRef3,
  decorativeBugsRef4,
  decorativeBugsRef5,
])

const startNewGame = () => {
  gameStore.startNewGame()
  router.push('/game-play')
}

const enterAnimation = () => {
  useMotion(logosDivRef.value, {
    initial: { opacity: 0, y: -100 },
    enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 100 } },
  })

  useMotion(gameHomeModalRef.value, {
    initial: { opacity: 0, y: 100 },
    enter: { opacity: 1, y: 0, transition: { type: 'spring', delay: 600 } },
  })

  useMotion(bottomStripeRef.value, {
    initial: { opacity: 0, y: 100 },
    enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 500, delay: 100 } },
  })

  decorativeBugsRefs.value
    .filter((ref) => ref.value)
    .forEach((bugRef, index) => {
      const delay = (index + 1) * 200 + 800
      useMotion(bugRef, {
        initial: {
          scale: 0,
          opacity: 0,
        },
        enter: {
          opacity: 1,
          scale: 1,
          transition: {
            type: 'spring',
            delay: delay,
          },
        },
      })
    })
}

const leaveAnimation = async () => {
  const logoMotion = useMotion(logosDivRef.value, {
    initial: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -100, transition: { duration: 500 } },
  })

  const modalMotion = useMotion(gameHomeModalRef.value, {
    initial: { opacity: 1, y: 0 },
    leave: {
      opacity: 0,
      y: 100,
      transition: { type: 'spring', duration: 500 },
    },
  })

  const stripeMotion = useMotion(bottomStripeRef.value, {
    initial: { opacity: 1, y: 0, scale: 1 },
    leave: {
      opacity: 0,
      y: 100,
      scale: 0.9,
      transition: { duration: 500 },
    },
  })

  const bugsMotions = decorativeBugsRefs.value
    .filter((ref) => ref.value)
    .map((bugRef) => {
      return useMotion(bugRef, {
        initial: { opacity: 1, scale: 1 },
        leave: {
          opacity: 0,
          scale: 0.5,
          transition: { duration: 500 },
        },
      })
    })

  // Apply leave animations in parallel
  await Promise.all([
    logoMotion.apply('leave'),
    modalMotion.apply('leave'),
    stripeMotion.apply('leave'),
    ...bugsMotions.map((motion) => motion.apply('leave')),
  ])
}

onMounted(() => {
  enterAnimation()
})

onBeforeRouteLeave(async (to, from, next) => {
  console.log('Leaving GameHomeView, preparing animations...')
  await leaveAnimation()
  console.log('Animations completed, navigating to:', to.fullPath)
  next()
  // next(false)
})
</script>

<template>
  <div
    class="relative flex min-h-dvh w-screen items-center justify-center overflow-hidden px-4 py-16"
  >
    <!-- Logos -->
    <div class="fixed top-0 left-0 flex w-full justify-between gap-4 p-4" ref="logosDivRef">
      <LogoCredelioMono class="z-20 w-64" />
      <LogoElanco class="w-32" />
    </div>

    <!-- Floating bugs decoration -->
    <TickImg
      class="fixed top-40 left-10 w-12 rotate-180 text-4xl text-white"
      ref="decorativeBugsRef1"
    />
    <TickImg
      class="fixed top-40 right-10 w-16 -rotate-45 text-3xl text-white"
      ref="decorativeBugsRef2"
    />
    <TickImg
      class="fixed bottom-20 left-20 w-16 rotate-45 text-3xl text-white"
      ref="decorativeBugsRef3"
    />
    <TickImg class="fixed right-10 bottom-10 w-16 text-4xl text-white" ref="decorativeBugsRef4" />
    <FleaImg
      class="fixed bottom-50 left-10 w-8 rotate-[45deg] text-4xl text-white"
      ref="decorativeBugsRef5"
    />

    <!-- Main Card -->
    <GameHomeModal @modal-button-click="startNewGame" ref="gameHomeModalRef" />

    <!-- Bottom Stripe -->
    <BottomStripe ref="bottomStripeRef" />
  </div>
</template>
