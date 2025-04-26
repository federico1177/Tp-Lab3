<template>
  <nav class="cont1">
    <div class="logo">CryptoWallet</div>
    <div class="botons">
      <router-link to="/dashboard" class="boton">Dashboard</router-link>
      <router-link to="/history" class="boton">Historial</router-link>
      <router-link to="/" class="boton">Cerrar sesión</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar'
}
</script>
<style scoped>
.cont1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2C3E50;
  padding: 1rem 2rem;
  color: white;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.botons {
  display: flex;
  gap: 1rem;
}

.boton {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease;
}

.boton:hover {
  background-color: #34495e;
}
</style>
