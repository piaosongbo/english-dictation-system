import { defineStore } from 'pinia'
import { ref } from 'vue'
import { settingsApi } from '../services/api.js'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const settings = ref({
    daily_review_count: '10',
    theme: 'light',
    language: 'en'
  })
  const loading = ref(false)
  
  // Actions
  async function fetchSettings() {
    try {
      const response = await settingsApi.getAll()
      settings.value = { ...settings.value, ...response.data }
      localStorage.setItem('settings', JSON.stringify(settings.value))
    } catch (err) {
      console.error('Failed to fetch settings:', err)
      // Load from localStorage as fallback
      const saved = localStorage.getItem('settings')
      if (saved) {
        settings.value = { ...settings.value, ...JSON.parse(saved) }
      }
    }
  }
  
  async function updateSetting(key, value) {
    try {
      await settingsApi.update(key, value)
      settings.value[key] = String(value)
      localStorage.setItem('settings', JSON.stringify(settings.value))
    } catch (err) {
      console.error('Failed to update setting:', err)
      // Update locally anyway
      settings.value[key] = String(value)
      localStorage.setItem('settings', JSON.stringify(settings.value))
    }
  }
  
  async function updateSettings(data) {
    try {
      await settingsApi.updateAll(data)
      settings.value = { ...settings.value, ...data }
      localStorage.setItem('settings', JSON.stringify(settings.value))
    } catch (err) {
      console.error('Failed to update settings:', err)
    }
  }
  
  return {
    settings,
    loading,
    fetchSettings,
    updateSetting,
    updateSettings
  }
})
