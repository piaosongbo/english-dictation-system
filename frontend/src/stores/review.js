import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { reviewApi } from '../services/api.js'

export const useReviewStore = defineStore('review', () => {
  // State
  const todayItems = ref([])
  const reviewCount = ref(0)
  const history = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Getters
  const hasReviews = computed(() => todayItems.value.length > 0)
  const progress = computed(() => {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}')
    const dailyGoal = parseInt(settings.daily_review_count || '10')
    return Math.min((todayItems.value.length / dailyGoal) * 100, 100)
  })
  
  // Actions
  async function fetchTodayReviews() {
    loading.value = true
    error.value = null
    try {
      const response = await reviewApi.getToday()
      todayItems.value = response.data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch today\'s reviews:', err)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchReviewCount() {
    try {
      const response = await reviewApi.getCount()
      reviewCount.value = response.data.count
    } catch (err) {
      console.error('Failed to fetch review count:', err)
    }
  }
  
  async function submitPractice(itemId, score, accuracy) {
    try {
      const response = await reviewApi.practice(itemId, { score, accuracy })
      // Remove from today's items if practiced
      todayItems.value = todayItems.value.filter(item => item.id !== itemId)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }
  
  async function fetchHistory(days = 7) {
    try {
      const response = await reviewApi.getHistory(days)
      history.value = response.data
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }
  
  return {
    todayItems,
    reviewCount,
    history,
    loading,
    error,
    hasReviews,
    progress,
    fetchTodayReviews,
    fetchReviewCount,
    submitPractice,
    fetchHistory
  }
})
