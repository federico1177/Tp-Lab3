<template>
  <nav class="bg-gray-800 text-white p-4 flex justify-between items-center">
    <div class="text-xl font-bold">CryptoPanel</div>
    <div class="space-x-4">
      <router-link to="/dashboard" class="hover:underline">Dashboard</router-link>
      <router-link to="/history" class="hover:underline">Historial</router-link>
      <router-link to="/" class="hover:underline">Cerrar sesión</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar'
}
</script>

<style scoped>

.bg-primary {
  background-color: #2C3E50;
}

.text-accent {
  color: #3498db; 
}

</style>