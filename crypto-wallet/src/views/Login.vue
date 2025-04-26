<template>
  <div class="cont1">
    <div class="cont2">
      <h1 class="btinicio">Iniciar Sesión</h1>

      <input
        v-model="idUsuario"
        type="text"
        placeholder="Ingresa tu ID"
        class="usuario"
      />

      <p v-if="mensajeError" class="error">{{ mensajeError }}</p>

      <button
        @click="iniciarSesion"
        class="btiniciar"
      >
        Entrar
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'IniciarSesion',
  setup() {
    const store = useStore()
    const router = useRouter()
    const idUsuario = ref('')  
    const mensajeError = ref('')  

    const iniciarSesion = () => {
      mensajeError.value = ''  

      if (!idUsuario.value.trim()) {
        mensajeError.value = 'Por favor, ingresá un ID válido.'
        return
      }

      const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/  

      if (!regex.test(idUsuario.value)) {
        mensajeError.value = 'El ID debe contener al menos una letra y un número.'
        return
      }

      store.commit('setUserId', idUsuario.value)  
      router.push('/dashboard')  
    }

    return {
      idUsuario,
      mensajeError,
      iniciarSesion
    }
  }
}
</script>


<style scoped>
.cont1 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9fafb;
}

.cont2 {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btinicio {
  font-size: 1.5rem;
  text-align: center;
  color: #1f2937;
}

.usuario {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.error {
  color: #ef4444;
  font-size: 0.9rem;
  text-align: center;
}

.btiniciar {
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btiniciar:hover {
  background-color: #1e40af;
}
</style>

