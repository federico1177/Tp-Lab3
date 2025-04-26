<template>
  <div class="cont1">
    <div class="cont2">
      <h2 class="cont3">Panel de Usuario</h2>
      <div class="cont4">
        <router-link to="/history" class="verhist">Ver historial</router-link>
        <button @click="resetForm" class="newoper">Nueva operación</button>
      </div>
    </div>

    <form @submit.prevent="submitForm" class="cont7">
      <div>
        <label for="action" class="accioncri">Acción:</label>
        <select v-model="action" id="action" required class="opcciones">
          <option value="purchase">Compra</option>
          <option value="sale">Venta</option>
        </select>
      </div>

      <div>
        <label for="crypto" class="cryp">Criptomoneda:</label>
        <select v-model="crypto" id="crypto" required class="opcciones" @change="updateCryptoPrice">
          <option disabled value="">Selecciona una opción</option>
          <option value="btc">Bitcoin (BTC)</option>
          <option value="eth">Ethereum (ETH)</option>
          <option value="usdt">Tether (USDT)</option>
        </select>
      </div>

      <div>
        <label for="amount" class="cantidad">Cantidad:</label>
        <input
          type="number"
          v-model.number="amount"
          id="amount"
          required
          min="0.0001"
          step="any"
          class="cant1"
          :disabled="true"
        />
      </div>

      <div>
        <label for="money" class="cantidad">Monto en ARS:</label>
        <input
          type="number"
          v-model.number="money"
          id="money"
          required
          min="0.01"
          step="any"
          class="cant1"
          @input="calculateAmountFromMoney"
        />
      </div>

      <div>
        <label for="datetime" class="cantidad">Fecha y Hora:</label>
        <input
          type="datetime-local"
          v-model="datetime"
          id="datetime"
          required
          class="cant1"
        />
      </div>

      <button type="submit" class="confirma">Confirmar</button>

      <p v-if="loading" class="procesando">Procesando transacción...</p>
      <p v-if="message" class="aceptado">{{ message }}</p>
      <p v-if="errorMessage" class="cancelado">{{ errorMessage }}</p>
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
      action: 'purchase', 
      crypto: '',
      amount: null, 
      money: null,   
      price: null,   
      datetime: '',  
      message: '',
      errorMessage: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getUserId'])
  },
  methods: {
    async updateCryptoPrice() {
      if (!this.crypto) return;

      try {
        const { data: priceData } = await axios.get(
          `https://criptoya.com/api/satoshitango/${this.crypto}/ars`
        );
        this.price = this.action === 'purchase' ? priceData.totalAsk : priceData.totalBid;
        this.calculateAmountFromMoney(); 
      } catch (error) {
        console.error(error);
        this.price = null;
      }
    },

    calculateAmountFromMoney() {
      if (this.price && this.money > 0) {
        this.amount = this.money / this.price;
      } else {
        this.amount = null;
      }
    },

    async submitForm() {
      this.message = ''
      this.errorMessage = ''
      this.loading = true

      
      if (!this.crypto || !this.amount || !this.money || !this.datetime) {
        this.errorMessage = 'Todos los campos son obligatorios y deben ser validos.'
        this.loading = false
        return
      }

    
      const formattedDatetime = new Date(this.datetime).toLocaleString('en-GB', {
        timeZone: 'UTC'
      }).replace(',', '').replace('/', '-').replace('/', '-');

      const transactionData = {
        user_id: this.getUserId,  
        action: this.action,
        crypto_code: this.crypto,
        crypto_amount: this.amount,
        money: this.money,
        datetime: formattedDatetime
      }

      try {
        await axios.post(
          'https://laboratorio3-f36a.restdb.io/rest/transactions',
          transactionData,
          {
            headers: {
              'x-apikey': '60eb09146661365596af552f',
              'Content-Type': 'application/json'
            }
          }
        )

        this.message = 'Operación registrada con éxito.'
        this.resetForm()
      } catch (error) {
        console.error(error)
        this.errorMessage = 'Hubo un error al registrar la operación.'
      } finally {
        this.loading = false
      }
    },

    resetForm() {
      this.action = 'purchase'
      this.crypto = ''
      this.amount = null
      this.money = null
      this.datetime = ''
    }
  }
}
</script>



<style scoped>
.cont1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
}

.cont2 {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.cont3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1f2937;
}

.cont4 {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.verhist {
  background-color: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.verhist:hover {
  background-color: #059669;
}

.newoper {
  background-color: #f59e0b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.newoper:hover {
  background-color: #d97706;
}

.cont7 {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

.accioncri,
.cryp,
.cantidad {
  display: block;
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.25rem;
}

.opcciones,
.cant1 {
  width: 100%;
  padding: 0.8rem;
  border-radius: 0.375rem;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
}

.confirma {
  width: 100%;
  padding: 0.8rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.confirma:hover {
  background-color: #1e40af;
}

.aceptado {
  margin-top: 1rem;
  color: #16a34a;
  font-weight: 500;
}

.cancelado {
  margin-top: 1rem;
  color: #ef4444;
  font-weight: 500;
}

.procesando {
  margin-top: 1rem;
  color: #3b82f6;
  font-weight: 500;
}

.total-ars {
  margin-top: 1rem;
  font-size: 1rem;
  color: #4ade80; 
  font-weight: 500;
}
</style>
