import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Composable for managing language preferences
 * Handles browser detection, localStorage persistence, and language switching
 */
export function useLanguage() {
  const { locale, availableLocales } = useI18n()
  const currentLanguage = ref(locale.value)

  // Supported languages
  const supportedLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ]

  /**
   * Get browser's preferred language or fallback to English
   */
  function getBrowserLanguage(): string {
    const browserLang = navigator.language.slice(0, 2)
    return supportedLanguages.find((lang) => lang.code === browserLang)?.code || 'en'
  }

  /**
   * Load language preference from localStorage or browser
   */
  function loadLanguagePreference(): string {
    const saved = localStorage.getItem('language')
    if (saved && supportedLanguages.find((lang) => lang.code === saved)) {
      return saved
    }
    return getBrowserLanguage()
  }

  /**
   * Change the current language and persist it
   */
  function changeLanguage(langCode: string) {
    if (supportedLanguages.find((lang) => lang.code === langCode)) {
      locale.value = langCode
      currentLanguage.value = langCode
      localStorage.setItem('language', langCode)
    }
  }

  /**
   * Initialize language on first load
   */
  function initializeLanguage() {
    const preferredLang = loadLanguagePreference()
    changeLanguage(preferredLang)
  }

  // Watch for locale changes and update current language
  watch(locale, (newLocale) => {
    currentLanguage.value = newLocale
  })

  return {
    currentLanguage,
    supportedLanguages,
    changeLanguage,
    initializeLanguage,
    getBrowserLanguage,
    loadLanguagePreference,
  }
}
