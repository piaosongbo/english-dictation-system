<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <h1 class="text-2xl font-bold mb-2">Welcome Back! 👋</h1>
      <p class="text-primary-100">
        Ready to practice your English dictation today?
      </p>
    </div>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card text-center">
        <div class="text-3xl font-bold text-primary-600">{{ reviewStore.reviewCount }}</div>
        <div class="text-sm text-gray-500 mt-1">Due for Review</div>
      </div>
      
      <div class="card text-center">
        <div class="text-3xl font-bold text-green-600">{{ itemsStore.totalCount }}</div>
        <div class="text-sm text-gray-500 mt-1">Total Items</div>
      </div>
      
      <div class="card text-center">
        <div class="text-3xl font-bold text-blue-600">{{ itemsStore.words.length }}</div>
        <div class="text-sm text-gray-500 mt-1">Words</div>
      </div>
      
      <div class="card text-center">
        <div class="text-3xl font-bold text-purple-600">{{ itemsStore.sentences.length }}</div>
        <div class="text-sm text-gray-500 mt-1">Sentences</div>
      </div>
    </div>
    
    <!-- Today's Review -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Today's Review</h2>
        <router-link to="/review" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View All →
        </router-link>
      </div>
      
      <div v-if="reviewStore.loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else-if="reviewStore.todayItems.length === 0" class="text-center py-8 text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-lg">All caught up! 🎉</p>
        <p class="text-sm">No items due for review today.</p>
      </div>
      
      <div v-else class="space-y-3">
        <div
          v-for="item in reviewStore.todayItems.slice(0, 5)"
          :key="item.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 truncate">{{ item.content }}</p>
            <p v-if="item.translation" class="text-sm text-gray-500 truncate">{{ item.translation }}</p>
          </div>
          
          <router-link
            :to="`/practice/${item.id}`"
            class="ml-4 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
          >
            Practice
          </router-link>
        </div>
        
        <p v-if="reviewStore.todayItems.length > 5" class="text-center text-sm text-gray-500 pt-2">
          +{{ reviewStore.todayItems.length - 5 }} more items
        </p>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <router-link to="/upload" class="card hover:shadow-md transition-shadow">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          
          <div>
            <h3 class="font-semibold">Upload Image</h3>
            <p class="text-sm text-gray-500">Add new words from photos</p>
          </div>
        </div>
      </router-link>
      
      <router-link to="/wordbank" class="card hover:shadow-md transition-shadow">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          
          <div>
            <h3 class="font-semibold">Word Bank</h3>
            <p class="text-sm text-gray-500">Manage your collection</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useItemsStore } from '../stores/items.js'
import { useReviewStore } from '../stores/review.js'

const itemsStore = useItemsStore()
const reviewStore = useReviewStore()

onMounted(() => {
  itemsStore.fetchItems()
  reviewStore.fetchTodayReviews()
  reviewStore.fetchReviewCount()
})
</script>
