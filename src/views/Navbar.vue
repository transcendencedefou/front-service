<template>
    <nav class="bg-gray-900 text-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <router-link to="/" class="text-2xl font-bold text-green-400">la commuuuuu</router-link>
  
          <!-- Desktop links -->
          <div class="hidden md:flex space-x-6 items-center">
            <router-link to="/" class="hover:text-green-400 transition">Accueil</router-link>
            <router-link to="/pong" class="hover:text-green-400 transition">Pong</router-link>
            <router-link to="/dashboard" class="hover:text-green-400 transition">Dashboard</router-link>
            <router-link to="/login" class="bg-green-500 px-3 py-1 rounded hover:bg-green-600 text-black font-semibold">Connexion</router-link>
          </div>
  
          <!-- Burger (mobile) -->
          <div class="md:hidden">
            <button @click="menuOpen = !menuOpen" class="focus:outline-none">
              <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Mobile menu -->
      <div v-if="menuOpen" class="md:hidden px-4 pb-4 space-y-2 bg-gray-800">
        <router-link to="/" class="block hover:text-green-400">Accueil</router-link>
        <router-link to="/pong" class="block hover:text-green-400">Pong</router-link>
        <router-link to="/dashboard" class="block hover:text-green-400">Dashboard</router-link>
        <router-link to="/login" class="block bg-green-500 px-3 py-1 rounded text-black font-semibold hover:bg-green-600">Connexion</router-link>
      </div>
    </nav>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  
  const menuOpen = ref(false)
  </script>