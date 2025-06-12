import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import es from '../locales/es.json'

// Default to English, store will handle setting the right language
const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'en',
  fallbackLocale: 'en',
  globalInjection: true, // Enable global $t
  messages: {
    en,
    es,
  },
})

export default i18n
