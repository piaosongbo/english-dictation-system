<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Handwriting Practice</h1>
        <p v-if="currentItem" class="text-gray-500">Practice writing: {{ currentItem.content }}</p>
      </div>
      
      <router-link to="/wordbank" class="btn-secondary">
        Back to Word Bank
      </router-link>
    </div>
    
    <!-- Practice Card -->
    <div v-if="currentItem" class="card">
      <!-- Mode Toggle & Audio -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-4">
          <!-- Practice Mode Toggle -->
          <div class="flex rounded-lg bg-gray-100 p-1">
            <button
              @click="practiceMode = 'guide'"
              class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
              :class="practiceMode === 'guide' ? 'bg-white shadow-sm' : 'text-gray-600'"
            >
              跟写模式
            </button>
            <button
              @click="practiceMode = 'dictation'"
              class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
              :class="practiceMode === 'dictation' ? 'bg-white shadow-sm' : 'text-gray-600'"
            >
              默写模式
            </button>
          </div>
          
          <!-- Audio Button -->
          <button
            @click="speak"
            class="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            :disabled="isSpeaking"
          >
            <svg v-if="!isSpeaking" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
            </svg>
            <svg v-else class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
            <span>{{ isSpeaking ? '朗读中...' : '朗读' }}</span>
          </button>
        </div>
        
        <!-- Show Answer Button (Dictation Mode) -->
        <button
          v-if="practiceMode === 'dictation'"
          @click="showAnswer = !showAnswer"
          class="text-sm text-blue-600 hover:text-blue-800"
        >
          {{ showAnswer ? '隐藏答案' : '显示答案' }}
        </button>
      </div>
      
      <!-- Reference Text -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <!-- Guide Mode: Show text -->
        <template v-if="practiceMode === 'guide'">
          <p class="text-sm text-gray-500 mb-1">Reference:</p>
          <p class="text-2xl font-handwriting text-gray-900">{{ currentItem.content }}</p>
          <p v-if="currentItem.translation" class="text-sm text-gray-500 mt-1">{{ currentItem.translation }}</p>
        </template>
        
        <!-- Dictation Mode: Hidden text -->
        <template v-else>
          <p class="text-sm text-gray-500 mb-1">请听读音，写出单词/句子：</p>
          <div v-if="!showAnswer" class="h-10 flex items-center">
            <span class="text-gray-400 italic">???（点击"显示答案"查看）</span>
          </div>
          <div v-else>
            <p class="text-2xl font-handwriting text-gray-900">{{ currentItem.content }}</p>
          </div>
          <p v-if="currentItem.translation" class="text-sm text-gray-500 mt-1"></p>
        </template>
      </div>
      
      <!-- Writing Canvas -->
      <div class="relative">
        <!-- Four-line-three-grid canvas -->
        <div 
          ref="canvasContainer"
          class="relative bg-white border-2 border-gray-300 rounded-lg overflow-hidden"
          :style="{ height: canvasHeight + 'px' }"
        >
          <!-- Grid lines -->
          <div class="absolute inset-0 pointer-events-none">
            <!-- Top dashed line (ascender) -->
            <div class="absolute w-full border-t border-dashed border-gray-300" style="top: 20%;"></div>
            <!-- Solid top line (x-height) -->
            <div class="absolute w-full border-t border-blue-400" style="top: 40%;"></div>
            <!-- Dashed middle line (baseline) -->
            <div class="absolute w-full border-t border-dashed border-gray-300" style="top: 60%;"></div>
            <!-- Solid bottom line (descender) -->
            <div class="absolute w-full border-t border-blue-400" style="top: 80%;"></div>
          </div>
          
          <canvas
            ref="canvas"
            class="absolute inset-0 cursor-crosshair touch-none"
            @mousedown="startDrawing"
            @mousemove="draw"
            @mouseup="stopDrawing"
            @mouseleave="stopDrawing"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="stopDrawing"
          ></canvas>
        </div>
        
        <!-- Canvas Controls -->
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center space-x-2">
            <button
              @click="clearCanvas"
              class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Clear"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
            
            <button
              @click="undo"
              class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Undo"
              :disabled="history.length === 0"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
              </svg>
            </button>
            
            <div class="h-6 w-px bg-gray-300 mx-2"></div>
            
            <!-- Brush size -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">Size:</span>
              <input
                v-model.number="brushSize"
                type="range"
                min="1"
                max="10"
                class="w-20"
              >
            </div>
            
            <div class="h-6 w-px bg-gray-300 mx-2"></div>
            
            <!-- Color picker -->
            <div class="flex items-center space-x-2">
              <button
                v-for="color in colors"
                :key="color"
                @click="brushColor = color"
                class="w-6 h-6 rounded-full border-2"
                :class="brushColor === color ? 'border-gray-900' : 'border-transparent'"
                :style="{ backgroundColor: color }"
              ></button>
            </div>
          </div>
          
          <div class="text-sm text-gray-500">
            {{ isDrawing ? 'Drawing...' : 'Ready to write' }}
          </div>
        </div>
      </div>
      
      <!-- Submit Section -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <h3 class="font-semibold mb-4">Rate your writing:</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            v-for="option in scoreOptions"
            :key="option.value"
            @click="submitPractice(option.value)"
            :disabled="submitting"
            class="p-4 rounded-lg border-2 text-center transition-all"
            :class="[
              selectedScore === option.value
                ? option.selectedClass
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="text-2xl mb-1">{{ option.emoji }}</div>
            <div class="font-medium">{{ option.label }}</div>
            <div class="text-xs text-gray-500">{{ option.description }}</div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- No Item Selected -->
    <div v-else class="card text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
      </svg>
      
      <h2 class="text-xl font-semibold mb-2">Select an item to practice</h2>
      
      <p class="text-gray-500 mb-4">Choose a word or sentence from your word bank</p>
      
      <router-link to="/wordbank" class="btn-primary">
        Go to Word Bank
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { itemsApi } from '../services/api.js'
import { useReviewStore } from '../stores/review.js'

const route = useRoute()
const router = useRouter()
const reviewStore = useReviewStore()

const currentItem = ref(null)
const canvas = ref(null)
const canvasContainer = ref(null)
const canvasHeight = ref(200)
const ctx = ref(null)
const isDrawing = ref(false)
const history = ref([])
const submitting = ref(false)
const selectedScore = ref(null)

const brushSize = ref(3)
const brushColor = ref('#1f2937')
const colors = ['#1f2937', '#dc2626', '#2563eb', '#16a34a']

// Practice mode
const practiceMode = ref('guide') // 'guide' or 'dictation'
const showAnswer = ref(false)
const isSpeaking = ref(false)

const scoreOptions = [
  { value: 4, emoji: '🌟', label: 'Excellent', description: 'Perfect form', selectedClass: 'border-green-500 bg-green-50' },
  { value: 3, emoji: '👍', label: 'Good', description: 'Minor issues', selectedClass: 'border-blue-500 bg-blue-50' },
  { value: 2, emoji: '✓', label: 'Pass', description: 'Needs work', selectedClass: 'border-yellow-500 bg-yellow-50' },
  { value: 1, emoji: '✗', label: 'Needs Work', description: 'Try again', selectedClass: 'border-red-500 bg-red-50' }
]

onMounted(async () => {
  const itemId = route.params.id
  if (itemId) {
    try {
      const response = await itemsApi.getById(itemId)
      currentItem.value = response.data
      
      // Auto-speak when entering dictation mode
      if (practiceMode.value === 'dictation') {
        setTimeout(() => speak(), 500)
      }
    } catch (error) {
      console.error('Failed to load item:', error)
    }
  }
  
  // Delay canvas init to ensure DOM is ready
  setTimeout(() => {
    initCanvas()
  }, 100)
  
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
})

function initCanvas() {
  if (!canvas.value || !canvasContainer.value) {
    console.warn('Canvas or container not ready')
    return
  }
  
  const container = canvasContainer.value
  const dpr = window.devicePixelRatio || 1
  
  // Set display size (css pixels)
  canvas.value.style.width = container.clientWidth + 'px'
  canvas.value.style.height = container.clientHeight + 'px'
  
  // Set actual size in memory (scaled to account for extra pixel density)
  canvas.value.width = container.clientWidth * dpr
  canvas.value.height = container.clientHeight * dpr
  
  ctx.value = canvas.value.getContext('2d')
  ctx.value.scale(dpr, dpr)
  ctx.value.lineCap = 'round'
  ctx.value.lineJoin = 'round'
  ctx.value.strokeStyle = brushColor.value
  ctx.value.lineWidth = brushSize.value
  
  // Clear history and save initial blank state
  history.value = []
  saveState()
  
  console.log('Canvas initialized:', canvas.value.width, 'x', canvas.value.height)
}

function resizeCanvas() {
  if (!canvas.value || !canvasContainer.value || !ctx.value) return
  
  // Save current content
  const imageData = canvas.value.toDataURL()
  
  const container = canvasContainer.value
  const dpr = window.devicePixelRatio || 1
  
  // Resize
  canvas.value.style.width = container.clientWidth + 'px'
  canvas.value.style.height = container.clientHeight + 'px'
  canvas.value.width = container.clientWidth * dpr
  canvas.value.height = container.clientHeight * dpr
  
  // Restore context settings
  ctx.value.scale(dpr, dpr)
  ctx.value.lineCap = 'round'
  ctx.value.lineJoin = 'round'
  ctx.value.strokeStyle = brushColor.value
  ctx.value.lineWidth = brushSize.value
  
  // Restore content
  const img = new Image()
  img.src = imageData
  img.onload = () => {
    ctx.value.drawImage(img, 0, 0, container.clientWidth, container.clientHeight)
  }
}

function getCoordinates(e) {
  const rect = canvas.value.getBoundingClientRect()
  const clientX = e.clientX || (e.touches && e.touches[0]?.clientX)
  const clientY = e.clientY || (e.touches && e.touches[0]?.clientY)
  
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
}

function startDrawing(e) {
  isDrawing.value = true
  const coords = getCoordinates(e)
  
  ctx.value.beginPath()
  ctx.value.moveTo(coords.x, coords.y)
}

function draw(e) {
  if (!isDrawing.value) return
  e.preventDefault()
  
  const coords = getCoordinates(e)
  
  ctx.value.strokeStyle = brushColor.value
  ctx.value.lineWidth = brushSize.value
  ctx.value.lineTo(coords.x, coords.y)
  ctx.value.stroke()
}

function stopDrawing() {
  if (!isDrawing.value) return
  isDrawing.value = false
  ctx.value.closePath()
  saveState()
}

function handleTouchStart(e) {
  e.preventDefault()
  startDrawing(e)
}

function handleTouchMove(e) {
  e.preventDefault()
  draw(e)
}

function saveState() {
  if (!canvas.value) return
  history.value.push(canvas.value.toDataURL())
}

function undo() {
  if (history.value.length <= 1) return
  
  history.value.pop()
  const previousState = history.value[history.value.length - 1]
  
  const img = new Image()
  img.src = previousState
  img.onload = () => {
    if (!ctx.value || !canvas.value) return
    const container = canvasContainer.value
    ctx.value.clearRect(0, 0, container.clientWidth, container.clientHeight)
    ctx.value.drawImage(img, 0, 0, container.clientWidth, container.clientHeight)
  }
}

function clearCanvas() {
  if (!ctx.value || !canvas.value) return
  const container = canvasContainer.value
  ctx.value.clearRect(0, 0, container.clientWidth, container.clientHeight)
  saveState()
}

async function submitPractice(score) {
  if (!currentItem.value) return
  
  selectedScore.value = score
  submitting.value = true
  
  try {
    // Calculate mock accuracy based on score
    const accuracy = score === 4 ? 0.95 : score === 3 ? 0.85 : score === 2 ? 0.70 : 0.50
    
    await reviewStore.submitPractice(currentItem.value.id, score, accuracy)
    
    // Show success and redirect
    alert(`Practice recorded! Score: ${scoreOptions.find(o => o.value === score)?.label}`)
    router.push('/review')
  } catch (error) {
    console.error('Failed to submit practice:', error)
    alert('Failed to save practice. Please try again.')
  } finally {
    submitting.value = false
  }
}

// Watch for brush changes
watch(() => brushSize.value, (newSize) => {
  if (ctx.value) {
    ctx.value.lineWidth = newSize
  }
})

watch(() => brushColor.value, (newColor) => {
  if (ctx.value) {
    ctx.value.strokeStyle = newColor
  }
})

// Watch for mode change - auto speak in dictation mode
watch(() => practiceMode.value, (newMode) => {
  if (newMode === 'dictation' && currentItem.value) {
    showAnswer.value = false
    setTimeout(() => speak(), 300)
  }
})

// Text to speech function
function speak() {
  if (!currentItem.value || !window.speechSynthesis) return
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel()
  
  // Speak Chinese translation instead of English
  const textToSpeak = currentItem.value.translation || currentItem.value.content
  const utterance = new SpeechSynthesisUtterance(textToSpeak)
  utterance.lang = 'zh-CN'
  utterance.rate = 1
  utterance.pitch = 1
  
  utterance.onstart = () => {
    isSpeaking.value = true
  }
  
  utterance.onend = () => {
    isSpeaking.value = false
  }
  
  utterance.onerror = () => {
    isSpeaking.value = false
  }
  
  window.speechSynthesis.speak(utterance)
}
</script>
