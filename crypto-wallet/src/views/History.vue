<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Historial de movimientos</h2>

    <div v-if="loading" class="text-gray-600">Cargando...</div>
    <div v-else-if="transactions.length === 0" class="text-gray-500">No hay movimientos registrados.</div>

    <table v-else class="w-full table-auto border border-collapse mt-2">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">Fecha</th>
          <th class="border p-2">Acción</th>
          <th class="border p-2">Cripto</th>
          <th class="border p-2">Cantidad</th>
          <th class="border p-2">Monto en ARS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in transactions" :key="tx._id">
          <td class="border p-2">{{ formatDate(tx.datetime) }}</td>
          <td class="border p-2 capitalize">{{ tx.action }}</td>
          <td class="border p-2 uppercase">{{ tx.crypto_code }}</td>
          <td class="border p-2">{{ tx.crypto_amount }}</td>
          <td class="border p-2">{{ formatCurrency(tx.money) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
   name: 'TransactionHistory',
  data() {
    return {
      transactions: [],
      loading: true,
      errorMessage: ''
    }
  },
  computed: {
    ...mapGetters(['getUserId'])
  },
  methods: {
    async fetchTransactions() {
      try {
        const { data } = await axios.get(
          `https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id":"${this.getUserId}"}`,
          { headers: { 'x-apikey': '60eb09146661365596af552f' } }
        )
        this.transactions = data
      } catch (error) {
        this.errorMessage = 'No se pudieron obtener los movimientos.'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    formatDate(datetime) {
      return new Date(datetime).toLocaleString()
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(value)
    }
  },
  mounted() {
    this.fetchTransactions()
  }
}
</script>

<style scoped>
table {
  border: 1px solid #ccc;
}
</style>
