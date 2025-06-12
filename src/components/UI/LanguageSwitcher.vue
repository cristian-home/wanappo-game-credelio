<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}

// Load saved language preference on mount
onMounted(() => {
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage && supportedLanguages.find((l) => l.code === savedLanguage)) {
    locale.value = savedLanguage
  }
})
</script>

<template>
  <div class="language-switcher">
    <select
      :value="locale"
      @change="changeLanguage(($event.target as HTMLSelectElement).value)"
      class="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option v-for="lang in supportedLanguages" :key="lang.code" :value="lang.code">
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
