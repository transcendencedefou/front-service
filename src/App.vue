<script lang="ts" setup>
  import Navbar from './components/Navbar.vue'
  import CustomCursor from './components/CustomCursor.vue'
</script>

<template>
  <CustomCursor />
  <Navbar />
  <router-view />
</template>

<style scoped>
</style>