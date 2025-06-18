<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'
import CacheDevTools from '@/components/Dev/CacheDevTools.vue'

const { locale } = useI18n()
const languageStore = useLanguageStore()

// Initialize language preference on app startup
onMounted(() => {
  languageStore.initializeLanguage()
  locale.value = languageStore.currentLanguage
})
</script>

<template>
  <RouterView />
  <CacheDevTools />
</template>

<style scoped lang="css"></style>
