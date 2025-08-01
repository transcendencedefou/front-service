<template>
  <div id="app">
    <h1>Coucou 👋</h1>
    <p>Application Vue.js chargée avec succès !</p>
    <div class="debug-info">
      <p>Timestamp: {{ timestamp }}</p>
      <p>Statut: Application fonctionnelle</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Test simple
console.log('App.vue chargé avec succès!')

const timestamp = ref(new Date().toLocaleString())

onMounted(() => {
  console.log('App.vue monté avec succès!')
  console.log('Element #app trouvé:', document.getElementById('app'))
})
</script>

<style scoped>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  color: white;
  font-family: Arial, sans-serif;
  padding: 20px;
}

h1 {
  font-size: 48px;
  text-align: center;
  margin-bottom: 20px;
  color: #4ade80;
}

p {
  font-size: 18px;
  text-align: center;
  margin: 10px 0;
}

.debug-info {
  margin-top: 30px;
  padding: 15px;
  background-color: #2a2a2a;
  border-radius: 8px;
  border: 1px solid #4ade80;
}

.debug-info p {
  font-size: 14px;
  margin: 5px 0;
  color: #a3a3a3;
}
</style>
