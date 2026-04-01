<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-2">Upload Image</h1>
      <p class="text-gray-500">Take a photo of English words or sentences to add them</p>
    </div>
    
    <!-- Upload Area -->
    <div
      class="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-colors"
      :class="{ 'border-primary-500 bg-primary-50': isDragging }"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      >
      
      <div v-if="!previewUrl">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        
        <p class="text-lg font-medium mb-2">Drag and drop an image here</p>
        <p class="text-sm text-gray-500 mb-4">or</p>
        
        <button
          @click="$refs.fileInput.click()"
          class="btn-primary"
          :disabled="uploading"
        >
          Choose File
        </button>
      </div>
      
      <div v-else class="relative">
        <img :src="previewUrl" alt="Preview" class="max-h-64 mx-auto rounded-lg shadow-md">
        
        <button
          @click="clearImage"
          class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- OCR Result -->
    <div v-if="ocrResult" class="card">
      <h3 class="font-semibold mb-4">OCR Result</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Detected Text</label>
          <textarea
            v-model="ocrResult"
            rows="3"
            class="input"
            placeholder="Edit the detected text if needed"
          ></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Translation (Optional)</label>
          <input
            v-model="translation"
            type="text"
            class="input"
            placeholder="Enter translation"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input
                v-model="itemType"
                type="radio"
                value="word"
                class="mr-2"
              >
              Word
            </label>
            
            <label class="flex items-center">
              <input
                v-model="itemType"
                type="radio"
                value="sentence"
                class="mr-2"
              >
              Sentence
            </label>
          </div>
        </div>
        
        <div class="flex space-x-3 pt-2">
          <button
            @click="saveItem"
            class="btn-primary flex-1"
            :disabled="saving || !ocrResult.trim()"
          >
            {{ saving ? 'Saving...' : 'Save to Word Bank' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Upload Progress -->
    <div v-if="uploading" class="card text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
      <p class="text-gray-600">Processing image and extracting text...</p>
    </div>
    
    <!-- Tips -->
    <div class="card bg-blue-50 border-blue-200">
      <h3 class="font-semibold text-blue-900 mb-2">💡 Tips for best results</h3>
      <ul class="text-sm text-blue-800 space-y-1 list-disc list-inside">
        <li>Make sure the text is well-lit and in focus</li>
        <li>Avoid glare and shadows on the text</li>
        <li>Keep the text straight and horizontal</li>
        <li>Use high contrast (dark text on light background)</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { uploadApi, itemsApi } from '../services/api.js'

const router = useRouter()

const fileInput = ref(null)
const isDragging = ref(false)
const uploading = ref(false)
const saving = ref(false)
const previewUrl = ref('')
const ocrResult = ref('')
const translation = ref('')
const itemType = ref('word')
const imagePath = ref('')

function handleDrop(e) {
  isDragging.value = false
  const files = e.dataTransfer.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

function handleFileSelect(e) {
  const files = e.target.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

function processFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }
  
  // Show preview
  previewUrl.value = URL.createObjectURL(file)
  
  // Upload and OCR
  uploadImage(file)
}

async function uploadImage(file) {
  uploading.value = true
  
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await uploadApi.uploadImage(formData)
    
    ocrResult.value = response.data.ocrText || ''
    imagePath.value = response.data.imageUrl || ''
    
    // Auto-detect type based on content length
    itemType.value = ocrResult.value.split(/\s+/).length > 3 ? 'sentence' : 'word'
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Failed to process image. Please try again.')
  } finally {
    uploading.value = false
  }
}

async function saveItem() {
  if (!ocrResult.value.trim()) return
  
  saving.value = true
  
  try {
    await itemsApi.create({
      type: itemType.value,
      content: ocrResult.value.trim(),
      translation: translation.value.trim(),
      image_path: imagePath.value
    })
    
    // Reset and redirect
    clearImage()
    router.push('/wordbank')
  } catch (error) {
    console.error('Save failed:', error)
    alert('Failed to save item. Please try again.')
  } finally {
    saving.value = false
  }
}

function clearImage() {
  previewUrl.value = ''
  ocrResult.value = ''
  translation.value = ''
  imagePath.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
