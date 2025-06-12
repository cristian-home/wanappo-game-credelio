<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'

const { locale } = useI18n()
const languageStore = useLanguageStore()

const changeLanguage = (lang: string) => {
  locale.value = lang
  languageStore.setLanguage(lang)
}

// Sync i18n locale with store on mount and when store changes
onMounted(() => {
  // Initialize language if needed
  languageStore.initializeLanguage()

  // Set locale from store
  locale.value = languageStore.currentLanguage
})

// Watch for store changes
watch(
  () => languageStore.currentLanguage,
  (newLang) => {
    if (locale.value !== newLang) {
      locale.value = newLang
    }
  },
)
</script>

<template>
  <div class="language-switcher">
    <select
      :value="locale"
      @change="changeLanguage(($event.target as HTMLSelectElement).value)"
      class="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option v-for="lang in languageStore.supportedLanguages" :key="lang.code" :value="lang.code">
        {{ lang.flag }} {{ lang.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.language-switcher {
  display: inline-block;
}
</style>
