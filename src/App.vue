<script lang="ts" setup>
  import Navbar from './components/Navbar.vue'
  import CustomCursor from './components/CustomCursor.vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const showNavbar = computed(() => !route.meta.hideNavbar)
</script>

<template>
  <div class="relative w-full min-h-screen overflow-hidden">
    <Navbar v-if="showNavbar" />
    <CustomCursor />
    <router-view />
  </div>
</template>

<style scoped>
</style>

