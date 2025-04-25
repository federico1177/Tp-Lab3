<template>
  <div id="add">
    <Navbar v-if="showNavbar" />
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  components: { Navbar },
  setup() {
    const route = useRoute()
    const showNavbar = computed(() => route.path !== '/')
    return { showNavbar }
  }
}
</script>
