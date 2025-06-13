import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Language {
  code: string
  name: string
  flag: string
}

export const useLanguageStore = defineStore(
  'language',
  () => {
    const currentLanguage = ref('es')

    const supportedLanguages = ref<Language[]>([
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
    ])

    // Computed property to get supported language codes
    const supportedLanguageCodes = computed(() => supportedLanguages.value.map((lang) => lang.code))

    /**
     * Get browser's preferred language or fallback to English
     */
    function getBrowserLanguage(): string {
      const browserLang = navigator.language.slice(0, 2)
      return supportedLanguages.value.find((lang) => lang.code === browserLang)?.code || 'en'
    }

    /**
     * Set the current language
     */
    function setLanguage(langCode: string) {
      if (supportedLanguages.value.find((lang) => lang.code === langCode)) {
        currentLanguage.value = langCode
      }
    }

    /**
     * Initialize language with browser preference if no stored preference exists
     */
    function initializeLanguage() {
      const browserLang = getBrowserLanguage()
      if (!currentLanguage.value || !supportedLanguageCodes.value.includes(currentLanguage.value)) {
        currentLanguage.value = browserLang
      }
    }

    return {
      currentLanguage,
      supportedLanguages,
      setLanguage,
      getBrowserLanguage,
      initializeLanguage,
    }
  },
  {
    persist: true,
  },
)
