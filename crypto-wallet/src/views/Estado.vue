<template>
  <div class="finances-container">
    <h2 class="title">Análisis del Estado Actual</h2>

    <div v-if="loading" class="loading">Cargando datos...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else-if="finances.length === 0" class="no-data">No tenés criptomonedas registradas todavía.</div>

    <table v-else>
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Cantidad</th>
          <th>Valor en ARS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(crypto, index) in finances" :key="index">
          <td>{{ crypto.crypto_code.toUpperCase() }}</td>
          <td>{{ crypto.amount.toFixed(6) }}</td> 
          <td>${{ crypto.valueInARS.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="totalMoney > 0" class="total">
      <h3>Total en ARS:</h3>
      <p>${{ totalMoney.toLocaleString() }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FinancesView",
  data() {
    return {
      loading: true,
      errorMessage: "",
      finances: [],
      totalMoney: 0,
    };
  },
  methods: {
    async fetchTransactions() {
      try {
        const userId = this.$store.state.userId;
        if (!userId) {
          this.errorMessage = "El usuario no está autenticado.";
          this.loading = false;
          return;
        }

        const response = await axios.get(
          `https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id":"${userId}"}`,
          {
            headers: {
              "x-apikey": "60eb09146661365596af552f",
              "Content-Type": "application/json",
            },
          }
        );

        const transactions = response.data;

        if (transactions.length === 0) {
          this.loading = false;
          return;
        }

        let cryptos = {};

        transactions.forEach((transaction) => {
          const { crypto_code, crypto_amount, action } = transaction;
          if (!cryptos[crypto_code]) {
            cryptos[crypto_code] = { amount: 0, crypto_code };
          }

          if (action === "purchase") {
            cryptos[crypto_code].amount += parseFloat(crypto_amount);
          } else if (action === "sale") {
            cryptos[crypto_code].amount -= parseFloat(crypto_amount);
          }
        });

        // Filtramos criptos que tengan cantidad > 0
        Object.keys(cryptos).forEach((key) => {
          if (cryptos[key].amount <= 0) {
            delete cryptos[key];
          }
        });

        await this.fetchCryptoPrices(cryptos);

      } catch (error) {
        this.errorMessage = "Hubo un error al cargar las transacciones.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchCryptoPrices(cryptos) {
      try {
        const cryptoCodes = Object.keys(cryptos);

        const prices = await Promise.all(
          cryptoCodes.map((code) =>
            axios.get(`https://criptoya.com/api/satoshitango/${code}/ars`)
          )
        );

        prices.forEach((priceResponse, index) => {
          const cryptoCode = cryptoCodes[index];
          const price = priceResponse.data.totalBid;
          if (price && cryptos[cryptoCode].amount > 0) {
            const valueInARS = price * cryptos[cryptoCode].amount;
            cryptos[cryptoCode].valueInARS = valueInARS;
          }
        });

        this.finances = Object.values(cryptos);
        this.calculateTotal();

      } catch (error) {
        this.errorMessage = "Hubo un error al obtener los precios de las criptomonedas.";
        console.error(error);
      }
    },

    calculateTotal() {
      this.totalMoney = this.finances.reduce((total, crypto) => {
        return total + (crypto.valueInARS || 0);
      }, 0);
    },
  },
  created() {
    this.fetchTransactions();
  },
};
</script>

<style scoped>
.finances-container {
  padding: 2rem;
  text-align: center;
}

.title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

table {
  width: 100%;
  margin-top: 2rem;
  border-collapse: collapse;
}

table th,
table td {
  padding: 0.75rem;
  border: 1px solid #ddd;
}

table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.loading,
.error,
.no-data {
  font-size: 1.2rem;
  margin-top: 2rem;
}

.loading {
  color: #007bff;
}

.error {
  color: red;
}

.no-data {
  color: #6b7280;
}

.total {
  margin-top: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .finances-container {
    padding: 1rem;
  }

  table {
    font-size: 0.9rem;
  }
}
</style>
