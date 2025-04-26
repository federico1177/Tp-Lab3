<template>
  <div class="cont1">
    <h2 class="title">Análisis del Estado Actual</h2>

    <div v-if="cargando" class="carga">Cargando datos...</div>
    <div v-else-if="mensajeError" class="error">{{ mensajeError }}</div>
    <div v-else-if="finanzas.length === 0" class="no-data">No tenés criptomonedas registradas todavía.</div>

    <table v-else>
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Cantidad</th>
          <th>Valor en ARS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cripto, indice) in finanzas" :key="indice">
          <td>{{ cripto.crypto_code.toUpperCase() }}</td>
          <td>{{ cripto.amount.toFixed(6) }}</td> 
          <td>${{ cripto.valueInARS.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="dineroTotal > 0" class="total">
      <h3>Total en ARS:</h3>
      <p>${{ dineroTotal.toLocaleString() }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "VistaFinanzas",
  data() {
    return {
      cargando: true,
      mensajeError: "",
      finanzas: [],
      dineroTotal: 0,
    };
  },
  methods: {
    async obtenerTransacciones() {
      try {
        const usuarioId = this.$store.state.userId;
        if (!usuarioId) {
          this.mensajeError = "El usuario no está autenticado.";
          this.cargando = false;
          return;
        }

        const respuesta = await axios.get(
          `https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id":"${usuarioId}"}`,
          {
            headers: {
              "x-apikey": "60eb09146661365596af552f",
              "Content-Type": "application/json",
            },
          }
        );

        const transacciones = respuesta.data;

        if (transacciones.length === 0) {
          this.cargando = false;
          return;
        }

        let criptomonedas = {};

        transacciones.forEach((transaccion) => {
          const { crypto_code, crypto_amount, action } = transaccion;
          if (!criptomonedas[crypto_code]) {
            criptomonedas[crypto_code] = { amount: 0, crypto_code };
          }

          if (action === "purchase") {
            criptomonedas[crypto_code].amount += parseFloat(crypto_amount);
          } else if (action === "sale") {
            criptomonedas[crypto_code].amount -= parseFloat(crypto_amount);
          }
        });

        Object.keys(criptomonedas).forEach((key) => {
          if (criptomonedas[key].amount <= 0) {
            delete criptomonedas[key];
          }
        });

        await this.obtenerPreciosCripto(criptomonedas);

      } catch (error) {
        this.mensajeError = "Hubo un error al cargar las transacciones.";
        console.error(error);
      } finally {
        this.cargando = false;
      }
    },

    async obtenerPreciosCripto(criptomonedas) {
      try {
        const codigosCripto = Object.keys(criptomonedas);

        const precios = await Promise.all(
          codigosCripto.map((codigo) =>
            axios.get(`https://criptoya.com/api/satoshitango/${codigo}/ars`)
          )
        );

        precios.forEach((respuestaPrecio, indice) => {
          const codigoCripto = codigosCripto[indice];
          const precio = respuestaPrecio.data.totalBid;
          if (precio && criptomonedas[codigoCripto].amount > 0) {
            const valorEnARS = precio * criptomonedas[codigoCripto].amount;
            criptomonedas[codigoCripto].valueInARS = valorEnARS;
          }
        });

        this.finanzas = Object.values(criptomonedas);
        this.calcularTotal();

      } catch (error) {
        this.mensajeError = "Hubo un error al obtener los precios de las criptomonedas.";
        console.error(error);
      }
    },

    calcularTotal() {
      this.dineroTotal = this.finanzas.reduce((total, cripto) => {
        return total + (cripto.valueInARS || 0);
      }, 0);
    },
  },
  created() {
    this.obtenerTransacciones();
  },
};
</script>

<style scoped>
.con1{
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

.carga,
.error,
.no-data {
  font-size: 1.2rem;
  margin-top: 2rem;
}

.carga {
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
