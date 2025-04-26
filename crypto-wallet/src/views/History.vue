<template>
  <div class="cont1">
    <h2 class="titulo">Historial de movimientos</h2>

    <div v-if="loading">Cargando...</div>
    <div v-else-if="transactions.length === 0">No hay movimientos registrados.</div>

    <div v-else class="cont2">
      <table class="tablahist">
        <thead>
          <tr class="fila">
            <th class="dato">Fecha</th>
            <th class="dato">Acción</th>
            <th class="dato">Cripto</th>
            <th class="dato">Cantidad</th>
            <th class="dato">Monto en ARS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in transactions" :key="tx._id">
            <td class="dato">{{ formatDate(tx.datetime) }}</td>
            <td class="dato">{{ tx.action }}</td>
            <td class="dato">{{ tx.crypto_code }}</td>
            <td class="dato">{{ tx.crypto_amount }}</td>
            <td class="dato">{{ formatCurrency(tx.money) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="errorMessage" class="meserror">{{ errorMessage }}</p>
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
.cont1 {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.cont2 {
  overflow-x: auto;
  margin-top: 1.5rem;
}

.titulo {
  color: #1F2937;
  text-align: center;
  margin-bottom: 1rem;
}

.tablahist {
  width: 100%;
  border-collapse: collapse;
}

.fila {
  background-color: #f3f4f6;
}

.dato {
  border: 1px solid #ddd;
  padding: 1rem;
  text-align: center;
}

.meserror {
  color: #EF4444;
  text-align: center;
  margin-top: 1rem;
}
</style>
