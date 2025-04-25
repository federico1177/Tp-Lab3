<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-2xl shadow-md w-96">
      <h1 class="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h1>
      <input
        v-model="userId"
        type="text"
        placeholder="Ingresa tu ID"
        class="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button
        @click="login"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Entrar
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue' // Asegurándose de importar ref desde 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'UserLogin', // Nombre del componente siguiendo las buenas prácticas

  setup() {
    const store = useStore() // Usando Vuex
    const router = useRouter() // Usando Vue Router
    const userId = ref('') // Definir 'userId' como ref para la reactividad

    // Método para realizar el login
    const login = () => {
      if (!userId.value.trim()) {
        alert('Por favor, ingresá un ID válido.')
        return
      }

      // Guardar el userId en el store
      store.commit('setUserId', userId.value)

      // Redirigir al Dashboard
      router.push('/dashboard')
    }

    // Retornar las propiedades y métodos para que estén disponibles en el template
    return {
      userId,
      login
    }
  }
}
</script>

<style scoped>
/* Estilos adicionales para mejorar la apariencia si lo necesitas */
</style>
