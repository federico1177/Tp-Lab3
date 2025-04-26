<template>
  <div class="cont1">
    <h2 class="titulo">Historial de movimientos</h2>

    <div v-if="cargando">Cargando...</div>
    <div v-else-if="movimientos.length === 0">No hay movimientos registrados.</div>

    <div v-else class="cont2">
      <table class="tablahist">
        <thead>
          <tr class="fila">
            <th class="dato">Fecha</th>
            <th class="dato">Cripto</th>
            <th class="dato">Cantidad</th>
            <th class="dato">Monto en ARS</th>
            <th class="dato">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mov in movimientos" :key="mov._id">
            <td class="dato">{{ formatearFecha(mov.datetime) }}</td>
            <td class="dato">{{ mov.crypto_code }}</td>
            <td class="dato">{{ mov.crypto_amount }}</td>
            <td class="dato">{{ formatearMoneda(mov.money) }}</td>
            <td class="dato">
              <button @click="editarMovimiento(mov)" class="edit-btn">Editar</button>
              <button @click="eliminarMovimiento(mov._id)" class="delete-btn">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="mensajeError" class="meserror">{{ mensajeError }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'HistorialMovimientos',
  data() {
    return {
      movimientos: [],
      cargando: true,
      mensajeError: ''
    }
  },
  computed: {
    ...mapGetters(['getUserId'])
  },
  methods: {
    async obtenerMovimientos() {
      try {
        const { data } = await axios.get(
          `https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id":"${this.getUserId}"}`,
          { headers: { 'x-apikey': '60eb09146661365596af552f' } }
        )
        this.movimientos = data
      } catch (error) {
        this.mensajeError = 'No se pudieron obtener los movimientos.'
        console.error(error)
      } finally {
        this.cargando = false
      }
    },
    formatearFecha(fechaHora) {
      return new Date(fechaHora).toLocaleString()
    },
    formatearMoneda(valor) {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(valor)
    },
    async editarMovimiento(mov) {
      const nuevoMonto = prompt('Ingrese el nuevo monto en ARS:', mov.money);
      if (nuevoMonto !== null && !isNaN(nuevoMonto) && parseFloat(nuevoMonto) > 0) {
        try {
          const movimientoActualizado = { money: nuevoMonto };
          await axios.patch(
            `https://laboratorio3-f36a.restdb.io/rest/transactions/${mov._id}`,
            movimientoActualizado,
            { headers: { 'x-apikey': '60eb09146661365596af552f' } }
          )
          mov.money = nuevoMonto;
          alert('Movimiento actualizado con éxito');
        } catch (error) {
          this.mensajeError = 'Hubo un error al editar el movimiento.'
          console.error(error)
        }
      } else {
        alert('Monto inválido');
      }
    },
    async eliminarMovimiento(idMovimiento) {
      const confirmarEliminacion = confirm('¿Estás seguro de que deseas eliminar este movimiento?');
      if (confirmarEliminacion) {
        try {
          await axios.delete(
            `https://laboratorio3-f36a.restdb.io/rest/transactions/${idMovimiento}`,
            { headers: { 'x-apikey': '60eb09146661365596af552f' } }
          )
          this.movimientos = this.movimientos.filter(mov => mov._id !== idMovimiento);
          alert('Movimiento eliminado correctamente.')
        } catch (error) {
          this.mensajeError = 'Hubo un error al eliminar el movimiento.'
          console.error(error)
        }
      }
    }
  },
  mounted() {
    this.obtenerMovimientos()
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

.edit-btn {
  background-color: #f59e0b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-btn:hover {
  background-color: #d97706;
}

.delete-btn {
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 1rem;
}

.delete-btn:hover {
  background-color: #dc2626;
}
</style>
