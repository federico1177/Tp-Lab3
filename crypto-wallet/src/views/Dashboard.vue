<template>
  <div class="p-4 max-w-xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Panel de Usuario</h2>
      <div class="space-x-2">
        <router-link
          to="/history"
          class="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded"
        >
          Ver historial
        </router-link>
        <button
          @click="resetForm"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Nueva operación
        </button>
      </div>
    </div>

    <!-- Formulario -->
    <form
      @submit.prevent="submitForm"
      class="space-y-4 bg-white shadow-md p-6 rounded-2xl"
    >
      <div>
        <label for="action" class="block font-semibold">Acción:</label>
        <select
          v-model="action"
          id="action"
          required
          class="w-full p-2 border rounded"
        >
          <option value="compra">Compra</option>
          <option value="venta">Venta</option>
        </select>
      </div>

      <div>
        <label for="crypto" class="block font-semibold">Criptomoneda:</label>
        <select
          v-model="crypto"
          id="crypto"
          required
          class="w-full p-2 border rounded"
        >
          <option disabled value="">Selecciona una opción</option>
          <option value="btc">Bitcoin (BTC)</option>
          <option value="eth">Ethereum (ETH)</option>
          <option value="usdt">Tether (USDT)</option>
        </select>
      </div>

      <div>
        <label for="amount" class="block font-semibold">Cantidad:</label>
        <input
          type="number"
          v-model.number="amount"
          id="amount"
          required
          min="0.0001"
          step="any"
          class="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Confirmar
      </button>

      <p v-if="message" class="text-green-600 mt-2">{{ message }}</p>
      <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'UserDashboard',
  data() {
    return {
      action: 'compra',
      crypto: '',
      amount: null,
      message: '',
      errorMessage: ''
    }
  },
  computed: {
    ...mapGetters(['getUserId'])
  },
  methods: {
    async submitForm() {
      this.message = ''
      this.errorMessage = ''

      if (!this.crypto || !this.amount) {
        this.errorMessage = 'Todos los campos son obligatorios.'
        return
      }

      try {
        const data = {
          user_id: this.getUserId,
          action: this.action,
          crypto_code: this.crypto,
          crypto_amount: this.amount,
          money: this.calculateMoney(),
          datetime: new Date().toISOString()
        }

        await axios.post(
          'https://laboratorio3-f36a.restdb.io/rest/transactions',
          data,
          {
            headers: { 'x-apikey': '60eb09146661365596af552f' }
          }
        )

        this.message = 'Operación registrada con éxito.'
        this.resetForm()
      } catch (error) {
        this.errorMessage = 'Hubo un error al registrar la operación.'
        console.error(error)
      }
    },
    calculateMoney() {
      const rates = {
        btc: 62000000,
        eth: 4000000,
        usdt: 1000
      }
      return this.amount * (rates[this.crypto] || 1)
    },
    resetForm() {
      this.action = 'compra'
      this.crypto = ''
      this.amount = null
    }
  }
}
</script>

<style scoped>
/* Estilo del contenedor principal */
.bg-white {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding: 2rem;
  border-radius: 0.75rem;
}

/* Hover sobre el contenedor */
.bg-white:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Estilos del formulario */
form {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

label {
  font-size: 1rem;
  color: #333;
}

select,
input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 0.375rem;
  border: 1px solid #ddd;
  margin-top: 0.5rem;
}

button {
  width: 100%;
  padding: 0.8rem;
  background-color: #2563eb;
  color: white;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #1e40af;
}

/* Mensajes de error y éxito */
.text-green-600 {
  color: #16a34a;
}

.text-red-500 {
  color: #ef4444;
}

.mt-2 {
  margin-top: 0.5rem;
}
</style>
