<script lang="ts" setup>
  import Navbar from './components/Navbar.vue'
  import CustomCursor from './components/CustomCursor.vue'
</script>

<template>
  <div class="relative w-full min-h-screen overflow-hidden">
    <Navbar />
    <CustomCursor />
    <router-view />
  </div>
</template>

<style scoped>
</style>

