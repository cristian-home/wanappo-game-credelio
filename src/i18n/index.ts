import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import es from '../locales/es.json'

// Get browser language or default to English
function getDefaultLocale(): string {
  // Check localStorage first
  const saved = localStorage.getItem('language')
  if (saved && ['en', 'es'].includes(saved)) {
    return saved
  }

  // Fallback to browser language
  const browserLang = navigator.language.slice(0, 2)
  return ['en', 'es'].includes(browserLang) ? browserLang : 'en'
}

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  globalInjection: true, // Enable global $t
  messages: {
    en,
    es,
  },
})

export default i18n
