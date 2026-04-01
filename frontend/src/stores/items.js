import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { itemsApi } from '../services/api.js'

export const useItemsStore = defineStore('items', () => {
  // State
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Getters
  const words = computed(() => items.value.filter(item => item.type === 'word'))
  const sentences = computed(() => items.value.filter(item => item.type === 'sentence'))
  const totalCount = computed(() => items.value.length)
  
  // Actions
  async function fetchItems(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await itemsApi.getAll(params)
      items.value = response.data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch items:', err)
    } finally {
      loading.value = false
    }
  }
  
  async function createItem(data) {
    loading.value = true
    try {
      const response = await itemsApi.create(data)
      items.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateItem(id, data) {
    try {
      const response = await itemsApi.update(id, data)
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }
  
  async function deleteItem(id) {
    try {
      await itemsApi.delete(id)
      items.value = items.value.filter(item => item.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }
  
  return {
    items,
    loading,
    error,
    words,
    sentences,
    totalCount,
    fetchItems,
    createItem,
    updateItem,
    deleteItem
  }
})
