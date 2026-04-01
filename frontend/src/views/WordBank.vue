<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Word Bank</h1>
        <p class="text-gray-500">Manage your words and sentences</p>
      </div>
      
      <div class="flex space-x-3">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="input pl-10 w-full md:w-64"
          >
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        
        <router-link to="/upload" class="btn-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add New
        </router-link>
      </div>
    </div>
    
    <!-- Filter Tabs -->
    <div class="flex space-x-2 border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        class="px-4 py-2 font-medium text-sm border-b-2 transition-colors"
        :class="activeTab === tab.value ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        {{ tab.label }}
        <span
          class="ml-2 px-2 py-0.5 text-xs rounded-full"
          :class="activeTab === tab.value ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>
    
    <!-- Items List -->
    <div v-if="itemsStore.loading" class="card text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
    
    <div v-else-if="filteredItems.length === 0" class="card text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
      </svg>
      
      <p class="text-gray-500">No items found</p>
    </div>
    
    <div v-else class="grid gap-4">
      <div
        v-for="item in filteredItems"
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
            
            <div v-if="editingItem?.id === item.id">
              <input
                v-model="editingItem.content"
                type="text"
                class="input mb-2"
              >
              
              <input
                v-model="editingItem.translation"
                type="text"
                class="input"
                placeholder="Translation"
              >
            </div>
            
            <div v-else>
              <p class="text-lg font-medium text-gray-900">{{ item.content }}</p>
              <p v-if="item.translation" class="text-gray-500">{{ item.translation }}</p>
            </div>
            
            <div class="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <span>Next review: {{ formatDate(item.next_review) }}</span>
              <span>{{ item.review_count }} reviews</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-2 ml-4">
            <template v-if="editingItem?.id === item.id">
              <button
                @click="saveEdit"
                class="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                title="Save"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </button>
              
              <button
                @click="cancelEdit"
                class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Cancel"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </template>
            
            <template v-else>
              <router-link
                :to="`/practice/${item.id}`"
                class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                title="Practice"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
              </router-link>
              
              <button
                @click="startEdit(item)"
                class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Edit"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              
              <button
                @click="deleteItem(item.id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useItemsStore } from '../stores/items.js'

const itemsStore = useItemsStore()

const searchQuery = ref('')
const activeTab = ref('all')
const editingItem = ref(null)

const tabs = computed(() => [
  { label: 'All', value: 'all', count: itemsStore.items.length },
  { label: 'Words', value: 'word', count: itemsStore.words.length },
  { label: 'Sentences', value: 'sentence', count: itemsStore.sentences.length }
])

const filteredItems = computed(() => {
  let items = itemsStore.items
  
  // Filter by tab
  if (activeTab.value !== 'all') {
    items = items.filter(item => item.type === activeTab.value)
  }
  
  // Filter by search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.content.toLowerCase().includes(query) ||
      item.translation?.toLowerCase().includes(query)
    )
  }
  
  return items
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function startEdit(item) {
  editingItem.value = { ...item }
}

function cancelEdit() {
  editingItem.value = null
}

async function saveEdit() {
  if (!editingItem.value) return
  
  try {
    await itemsStore.updateItem(editingItem.value.id, {
      content: editingItem.value.content,
      translation: editingItem.value.translation
    })
    editingItem.value = null
  } catch (error) {
    alert('Failed to save changes')
  }
}

async function deleteItem(id) {
  if (!confirm('Are you sure you want to delete this item?')) return
  
  try {
    await itemsStore.deleteItem(id)
  } catch (error) {
    alert('Failed to delete item')
  }
}

onMounted(() => {
  itemsStore.fetchItems()
})
</script>
