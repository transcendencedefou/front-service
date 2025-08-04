<template>
    <nav class="bg-transparent backdrop-blur-sm shadow-md text-gray-900 dark:text-white dark:bg-black">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <router-link to="/" class="text-2xl font-bold text-accent">la commuuuuu</router-link>
  
          <!-- Desktop links -->
          <div class="hidden md:flex space-x-6 items-center">
            <router-link to="/" class="text-gray-100 hover:text-clpurple transition">Accueil</router-link>
            <router-link to="/pong" class="text-gray-100 hover:text-clpurple transition">Pong</router-link>
            <router-link to="/dashboard" class="text-gray-100 hover:text-clpurple transition">Dashboard</router-link>
            <router-link to="/login" class="text-dkpurple bg-clpurple px-3 py-1 rounded hover:text-white font-semibold">Connexion</router-link>
            <!-- Toggle Light/Dark Mode -->
            <button 
              @click="toggleTheme"
              :aria-label="theme === 'dark' ? 'Activer le theme clair' : 'Activer le theme sombre'"
            >
              <span v-if="theme === 'dark'">☀️</span>
              <span v-else>🌙</span>
            </button>
            </div>
          <!-- Burger (mobile) -->
          <div class="md:hidden z-50 relative">
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
    </nav>
  
      <!-- Mobile menu -->
      <div v-if="menuOpen" class="fixed inset-0 z-50 flex flex-col items-center justify-center space-y-8 bg-white text-gray-900 dark:bg-gray-900 dark:text-white md:hidden transition">
        <!-- Close button -->
        <button
          @click="menuOpen = false"
          class="absolute top-4 right-4 z-50 text-3xl text-gray-900 dark:text-white hover:scale-110 transition"
          aria-label="Fermer le menu"
        >
          &times;
        </button>
        <router-link to="/" class="text-2xl font-semibold hover:text-green-500" @click="menuOpen = false"> Accueil </router-link>
        <router-link to="/pong" class="text-2xl font-semibold hover:text-green-500" @click="menuOpen = false"> Pong </router-link>
        <router-link to="/dashboard" class="text-2xl font-semibold hover:text-green-500" @click="menuOpen = false"> Dashboard </router-link>
        <router-link to="/login" class="text-2xl font-semibold hover:text-green-500" @click="menuOpen = false"> Connexion </router-link>
        <!-- Light/Dark toggle -->
        <button
          @click="toggleTheme"
          class="mt-8 text-2xl hover:scale-110 transition"
          :aria-label="theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'"
        >
          <span v-if="theme === 'dark'">☀️</span>
          <span v-else>🌙</span>
        </button>
      </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { useTheme } from '@/composables/useTheme'

  const menuOpen = ref(false)
  const { theme, toggleTheme } = useTheme()
  </script>