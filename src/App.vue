<script lang="ts" setup>
  import Navbar from './components/Navbar.vue'
  import CustomCursor from './components/CustomCursor.vue'
</script>

<template>
  <div class="relative w-full min-h-screen overflow-hidden">
    <CustomCursor />
    <Navbar class="absolute top-0 left-0 w-full z-50" />
    <router-view />
  </div>
</template>

<style scoped>
</style>

