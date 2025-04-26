<template>
  <div class="cont1">
    <div class="cont2">
      <h2 class="cont3">Panel de Usuario</h2>
      <div class="cont4">
        <button @click="reiniciarFormulario" class="newoper">Nueva operación</button>
      </div>
    </div>

    <form @submit.prevent="enviarFormulario" class="cont7">
      <div>
        <label for="accion" class="accioncri">Acción:</label>
        <select v-model="accion" id="accion" required class="opcciones">
          <option value="purchase">Compra</option>
          <option value="sale">Venta</option>
        </select>
      </div>

      <div>
        <label for="cripto" class="cryp">Criptomoneda:</label>
        <select v-model="cripto" id="cripto" required class="opcciones" @change="actualizarPrecioCripto">
          <option disabled value="">Selecciona una opción</option>
          <option value="btc">Bitcoin (BTC)</option>
          <option value="eth">Ethereum (ETH)</option>
          <option value="usdt">Tether (USDT)</option>
        </select>
      </div>

      <div v-if="accion === 'purchase'">
        <label for="dinero" class="cantidad">Monto en ARS:</label>
        <input
          type="number"
          v-model.number="dinero"
          id="dinero"
          required
          min="0.01"
          step="any"
          class="cant1"
          @input="calcularCantidadDesdeDinero"
        />
      </div>

      <div v-if="accion === 'purchase'">
        <label for="cantidad" class="cantidad">Cantidad:</label>
        <input
          type="number"
          v-model.number="cantidad"
          id="cantidad"
          required
          min="0.0001"
          step="any"
          class="cant1"
          :disabled="true"
        />
      </div>

      <div v-if="accion === 'sale'">
        <label for="cantidadCripto" class="cantidad">Cantidad de Cripto a Vender:</label>
        <input
          type="number"
          v-model.number="cantidad"
          id="cantidadCripto"
          required
          min="0.0001"
          step="any"
          class="cant1"
          @input="calcularDineroDesdeCantidad"
        />
      </div>

      <div v-if="accion === 'sale'">
        <label for="dineroVenta" class="cantidad">Monto en ARS que recibirás:</label>
        <input
          type="number"
          v-model.number="dinero"
          id="dineroVenta"
          required
          min="0.01"
          step="any"
          class="cant1"
          :disabled="true"
        />
      </div>

      <div>
        <label for="fechaHora" class="cantidad">Fecha y Hora:</label>
        <input
          type="datetime-local"
          v-model="fechaHora"
          id="fechaHora"
          required
          class="cant1"
        />
      </div>

      <button type="submit" class="confirma">Confirmar</button>

      <p v-if="cargando" class="procesando">Procesando transacción...</p>
      <p v-if="mensaje" class="aceptado">{{ mensaje }}</p>
      <p v-if="mensajeError" class="cancelado">{{ mensajeError }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'PanelUsuario',
  data() {
    return {
      accion: 'purchase', 
      cripto: '',
      cantidad: null, 
      dinero: null,   
      precio: null,   
      fechaHora: '',  
      mensaje: '',
      mensajeError: '',
      cargando: false
    }
  },
  computed: {
    ...mapGetters(['getUserId'])
  },
  methods: {
    async actualizarPrecioCripto() {
      if (!this.cripto) return;

      try {
        const { data: datosPrecio } = await axios.get(
          `https://criptoya.com/api/satoshitango/${this.cripto}/ars`
        );
        this.precio = this.accion === 'purchase' ? datosPrecio.totalAsk : datosPrecio.totalBid;
        this.calcularCantidadDesdeDinero(); 
      } catch (error) {
        console.error(error);
        this.precio = null;
      }
    },

    calcularCantidadDesdeDinero() {
      if (this.precio && this.dinero > 0 && this.accion === 'purchase') {
        this.cantidad = this.dinero / this.precio;
      } else {
        this.cantidad = null;
      }
    },

    calcularDineroDesdeCantidad() {
      if (this.precio && this.cantidad > 0 && this.accion === 'sale') {
        this.dinero = this.cantidad * this.precio;
      } else {
        this.dinero = null;
      }
    },

    async enviarFormulario() {
      this.mensaje = '';
      this.mensajeError = '';
      this.cargando = true;

      if (!this.cripto || !this.cantidad || !this.dinero || !this.fechaHora) {
        this.mensajeError = 'Todos los campos son obligatorios y deben ser válidos.';
        this.cargando = false;
        return;
      }

      const fechaObjeto = new Date(this.fechaHora);

      if (isNaN(fechaObjeto.getTime())) {
        this.mensajeError = 'Fecha inválida.';
        this.cargando = false;
        return;
      }

      const fechaHoraFormateada = fechaObjeto.toISOString();

      const datosTransaccion = {
        user_id: this.getUserId,
        action: this.accion,
        crypto_code: this.cripto,
        crypto_amount: this.cantidad,
        money: this.dinero,
        datetime: fechaHoraFormateada
      };

      try {
        await axios.post(
          'https://laboratorio3-f36a.restdb.io/rest/transactions',
          datosTransaccion,
          {
            headers: {
              'x-apikey': '60eb09146661365596af552f',
              'Content-Type': 'application/json'
            }
          }
        );

        this.mensaje = 'Operación registrada con éxito.';
        this.reiniciarFormulario();
      } catch (error) {
        console.error(error);
        this.mensajeError = 'Hubo un error al registrar la operación.';
      } finally {
        this.cargando = false;
      }
    },

    reiniciarFormulario() {
      this.accion = 'purchase';
      this.cripto = '';
      this.cantidad = null;
      this.dinero = null;
      this.fechaHora = '';
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
</style>
