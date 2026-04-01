<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Daily Review</h1>
        <p class="text-gray-500">Review items based on the Ebbinghaus forgetting curve</p>
      </div>
      
      <div class="text-right">
        <div class="text-3xl font-bold text-primary-600">{{ reviewStore.todayItems.length }}</div>
        <div class="text-sm text-gray-500">items remaining</div>
      </div>
    </div>
    
    <!-- Progress Bar -->
    <div class="card">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">Daily Progress</span>
        <span class="text-sm text-gray-500">{{ Math.round(reviewStore.progress) }}%</span>
      </div>
      
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div
          class="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
          :style="{ width: reviewStore.progress + '%' }"
        ></div>
      </div>
    </div>
    
    <!-- Review Items -->
    <div v-if="reviewStore.loading" class="card text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="mt-4 text-gray-600">Loading your review items...</p>
    </div>
    
    <div v-else-if="reviewStore.todayItems.length === 0" class="card text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      
      <h2 class="text-xl font-semibold mb-2">All Caught Up! 🎉</h2>
      
      <p class="text-gray-500 mb-6">You have no items due for review today.</p>
      
      <router-link to="/upload" class="btn-primary">
        Add New Items
      </router-link>
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="item in reviewStore.todayItems"
        :key="item.id"
        class="card hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="item.type === 'word' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
              >
                {{ item.type === 'word' ? 'Word' : 'Sentence' }}
              </span>
              
              <span class="text-xs text-gray-500">
                Level {{ item.level }}/6
              </span>
            </div>
            
            <p class="text-xl font-medium text-gray-900 mb-1">{{ item.content }}</p>
            
            <p v-if="item.translation" class="text-gray-500">{{ item.translation }}</p>
            
            <div class="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ formatDate(item.next_review) }}
              </span>
              
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {{ item.review_count }} reviews
              </span>
            </div>
          </div>
          
          <router-link
            :to="`/practice/${item.id}`"
            class="ml-4 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Practice
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Study Info -->
    <div class="card bg-blue-50 border-blue-200">
      <h3 class="font-semibold text-blue-900 mb-3">📚 About Spaced Repetition</h3>
      
      <p class="text-sm text-blue-800 mb-3">
        This system uses the Ebbinghaus forgetting curve to schedule reviews at optimal intervals:
      </p>
      
      <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
        <div
          v-for="(day, index) in [1, 2, 4, 7, 15, 30]"
          :key="day"
          class="text-center p-2 bg-white rounded-lg"
        >
          <div class="text-lg font-bold text-primary-600">Day {{ day }}</div>
          <div class="text-xs text-gray-500">Level {{ index + 1 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useReviewStore } from '../stores/review.js'

const reviewStore = useReviewStore()

function formatDate(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = date - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays < 0) return 'Overdue'
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

onMounted(() => {
  reviewStore.fetchTodayReviews()
})
</script>
