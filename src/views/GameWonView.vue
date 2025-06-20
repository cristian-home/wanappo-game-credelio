<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useI18n } from 'vue-i18n'
import BottomStripe from '@/components/UI/BottomStripe.vue'
import LogoElanco from '@/assets/img/logo-elanco-color.svg?skipsvgo'
import LogoCredelioMono from '@/assets/img/logo-credelio-singleline-mono-alt.svg'
import TickImg from '@/assets/img/tick.svg'
import FleaImg from '@/assets/img/flea.svg'
import { useMotion } from '@vueuse/motion'

const router = useRouter()
const gameStore = useGameStore()
const { t } = useI18n()

// Animation refs
const logosDivRef = ref<HTMLDivElement | null>()
const gameWonCardRef = ref<HTMLDivElement | null>()
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

const playAgain = () => {
  gameStore.startNewGame()
  router.push('/game-play')
}

const goHome = () => {
  gameStore.resetGame()
  router.push('/')
}

const enterAnimation = () => {
  useMotion(logosDivRef.value, {
    initial: { opacity: 0, y: -100 },
    enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 100 } },
  })

  useMotion(gameWonCardRef.value, {
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

  const cardMotion = useMotion(gameWonCardRef.value, {
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
    cardMotion.apply('leave'),
    stripeMotion.apply('leave'),
    ...bugsMotions.map((motion) => motion.apply('leave')),
  ])
}

// Protect against direct navigation
onMounted(() => {
  if (!gameStore.isGameWon) {
    // If not in game won state, redirect to appropriate screen
    if (gameStore.isPlaying || gameStore.isPaused) {
      router.replace('/game-play')
    } else if (gameStore.isGameOver) {
      router.replace('/game-over')
    } else {
      router.replace('/')
    }
  } else {
    // Start enter animations if we're in the correct state
    enterAnimation()
  }
})

onBeforeRouteLeave(async (to, from, next) => {
  console.log('Leaving GameWonView, preparing animations...')
  await leaveAnimation()
  console.log('Animations completed, navigating to:', to.fullPath)
  next()
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
    <div
      class="bg-bright-green outline-yellow relative z-10 flex w-full max-w-2xl flex-col items-center justify-center gap-4 rounded-4xl p-6 text-white shadow-lg outline-4 outline-solid"
      ref="gameWonCardRef"
    >
      <!-- Confetti and celebration effects -->
      <div class="absolute -top-10 -left-10 animate-bounce text-6xl text-yellow-400">🎊</div>
      <div class="absolute -top-10 -right-10 animate-pulse text-5xl text-yellow-400">✨</div>
      <div class="animate-float absolute -bottom-10 -left-10 text-4xl text-yellow-400">🎈</div>
      <div class="absolute -right-10 -bottom-10 text-6xl text-yellow-400">🏆</div>

      <div class="flex items-center gap-2 text-5xl">
        <span>🎉</span>
        <h1 class="text-yellow font-bold">
          {{ t('game.victory') }}
        </h1>
        <span>🎉</span>
      </div>
      <p class="text-xl text-white">
        {{ t('game.congratulations', { maxLevel: gameStore.maxLevel }) }}
      </p>

      <div
        class="z-10 w-full max-w-lg rounded-2xl bg-white p-4 text-center text-black inset-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
      >
        <h2 class="mb-4 text-2xl font-bold text-gray-800">{{ t('stats.victoryStats') }}</h2>
        <div class="space-y-3">
          <div class="stats-item flex justify-between">
            <span class="stats-label">{{ t('stats.levelsCompleted') }}:</span>
            <span class="stats-value text-green-600"
              >{{ gameStore.maxLevel }}/{{ gameStore.maxLevel }}</span
            >
          </div>
          <div class="stats-item flex justify-between">
            <span class="stats-label">{{ t('stats.finalScore') }}:</span>
            <span class="stats-value text-green-600">{{ gameStore.score }}</span>
          </div>
          <div class="stats-item flex justify-between">
            <span class="stats-label">{{ t('stats.status') }}:</span>
            <span class="stats-value text-yellow-600">{{ t('game.bugMaster') }}</span>
          </div>
        </div>
      </div>

      <div class="flex w-full justify-between gap-6">
        <button @click="playAgain" class="btn-primary w-full">
          {{ t('game.playAgain') }}
        </button>

        <button @click="goHome" class="btn-secondary w-full">
          {{ t('game.backToHome') }}
        </button>
      </div>
    </div>

    <!-- Bottom Stripe -->
    <BottomStripe ref="bottomStripeRef" />
  </div>
</template>
