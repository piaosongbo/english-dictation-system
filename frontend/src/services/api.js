import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Items API
export const itemsApi = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
  getStats: (id) => api.get(`/items/${id}/stats`)
}

// Review API
export const reviewApi = {
  getToday: () => api.get('/review/today'),
  getCount: () => api.get('/review/count'),
  practice: (id, data) => api.post(`/review/${id}/practice`, data),
  getHistory: (days) => api.get('/review/history', { params: { days } })
}

// Settings API
export const settingsApi = {
  getAll: () => api.get('/settings'),
  get: (key) => api.get(`/settings/${key}`),
  update: (key, value) => api.put(`/settings/${key}`, { value }),
  updateAll: (data) => api.put('/settings', data)
}

// Upload API
export const uploadApi = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  ocr: (imageUrl) => api.post('/upload/ocr', { imageUrl })
}

// Translate API
export const translateApi = {
  translate: (text, from = 'en', to = 'zh') => api.post('/translate', { text, from, to })
}

export default api
