import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { initVersionCheck, getBuildInfo } from './utils/version'

// Version and cache management
if (import.meta.env.PROD) {
  // Production: Check for new builds and handle cache accordingly
  console.log('� Production mode: Smart cache management enabled')
  initVersionCheck()
} else {
  // Development: Cache busting for rapid iteration
  console.log('🔄 Development mode: Cache busting enabled')
  const timestamp = Date.now()
  console.log(`📅 App startup timestamp: ${timestamp}`)
}

// Log build information
console.log('🏗️ Build info:', getBuildInfo())

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate))
app.use(router)
app.use(i18n)
app.use(MotionPlugin)

app.mount('#app')
