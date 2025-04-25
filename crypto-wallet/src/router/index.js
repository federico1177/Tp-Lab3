import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import History from '@/views/History.vue'

const routes = [
  { path: '/', name: 'UserLogin', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/history', name: 'TransactionHistory', component: History }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
