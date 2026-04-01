<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-2">Settings</h1>
      <p class="text-gray-500">Customize your learning experience</p>
    </div>
    
    <!-- Settings Card -->
    <div class="card space-y-6">
      <!-- Daily Review Count -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Daily Review Count
        </label>
        
        <div class="flex items-center space-x-4">
          <input
            v-model.number="settings.daily_review_count"
            type="range"
            min="5"
            max="50"
            step="5"
            class="flex-1"
            @change="saveSetting('daily_review_count', settings.daily_review_count)"
          >
          
          <span class="w-12 text-right font-medium">{{ settings.daily_review_count }}</span>
        </div>
        
        <p class="text-sm text-gray-500 mt-1">Number of items to review each day</p>
      </div>
      
      <hr class="border-gray-200">
      
      <!-- Theme -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Theme</label>
        
        <div class="flex space-x-3">
          <button
            v-for="theme in themes"
            :key="theme.value"
            @click="saveSetting('theme', theme.value)"
            class="flex-1 p-4 rounded-lg border-2 text-center transition-all"
            :class="settings.theme === theme.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'"
          >
            <div class="text-2xl mb-1">{{ theme.icon }}</div>
            <div class="font-medium">{{ theme.label }}</div>
          </button>
        </div>
      </div>
      
      
      <hr class="border-gray-200">
      
      <!-- Language -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Language</label>
        
        <select
          v-model="settings.language"
          class="input"
          @change="saveSetting('language', settings.language)"
        >
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </div>
    </div>
    
    <!-- About Card -->
    <div class="card">
      <h3 class="font-semibold mb-4">About</h3>
      
      <div class="space-y-3 text-sm text-gray-600">
        <div class="flex justify-between">
          <span>Version</span>
          <span class="font-medium">1.0.0</span>
        </div>
        
        <div class="flex justify-between">
          <span>Total Items</span>
          <span class="font-medium">{{ itemsStore.totalCount }}</span>
        </div>
        
        <div class="flex justify-between">
          <span>Due for Review</span>
          <span class="font-medium">{{ reviewStore.reviewCount }}</span>
        </div>
      </div>
    </div>
    
    <!-- Danger Zone -->
    <div class="card border-red-200">
      <h3 class="font-semibold text-red-600 mb-4">Danger Zone</h3>
      
      <button
        @click="confirmReset"
        class="btn-danger w-full"
      >
        Reset All Data
      </button>
      
      <p class="text-sm text-gray-500 mt-2">This will delete all your words, sentences, and practice history. This action cannot be undone.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings.js'
import { useItemsStore } from '../stores/items.js'
import { useReviewStore } from '../stores/review.js'

const settingsStore = useSettingsStore()
const itemsStore = useItemsStore()
const reviewStore = useReviewStore()

const themes = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' }
]

const settings = settingsStore.settings

function saveSetting(key, value) {
  settingsStore.updateSetting(key, value)
}

function confirmReset() {
  if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
    // Clear local storage
    localStorage.clear()
    
    // Reload page
    window.location.reload()
  }
}

onMounted(() => {
  settingsStore.fetchSettings()
  itemsStore.fetchItems()
  reviewStore.fetchReviewCount()
})
</script>
