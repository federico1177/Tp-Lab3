import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import History from '@/views/History.vue'
import Estado from '@/views/Estado.vue'  // Importa la nueva vista

const routes = [
  { path: '/', name: 'UserLogin', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/history', name: 'TransactionHistory', component: History },
  { path: '/estado', name: 'Estado', component: Estado }  // Nueva ruta agregada
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router