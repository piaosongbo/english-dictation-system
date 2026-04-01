import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Upload from './views/Upload.vue'
import Practice from './views/Practice.vue'
import Review from './views/Review.vue'
import WordBank from './views/WordBank.vue'
import Settings from './views/Settings.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/upload', name: 'Upload', component: Upload },
  { path: '/practice/:id?', name: 'Practice', component: Practice },
  { path: '/review', name: 'Review', component: Review },
  { path: '/wordbank', name: 'WordBank', component: WordBank },
  { path: '/settings', name: 'Settings', component: Settings },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
