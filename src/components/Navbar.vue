<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 bg-bg/70 backdrop-blur-md border-b border-fg/10"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- logo -->
        <router-link
          to="/"
          class="font-display text-xl tracking-widest text-accent-1 hover:text-accent-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2 rounded"
        >
          la commuuuuu
        </router-link>

        <!-- desktop links -->
        <div class="hidden md:flex items-center gap-6">
          <router-link to="/" class="nav-text">{{ t('nav.home') }}</router-link>
          <router-link to="/pong" class="nav-text">{{ t('nav.games') }}</router-link>
          <router-link to="/dashboard" class="nav-text">{{ t('nav.user') }}</router-link>

          <!-- Login / Logout -->
          <router-link
            v-if="!auth.isAuthenticated"
            to="/auth/login"
            class="nav-cta"
          >
            {{ t('nav.login') }}
          </router-link>
          <button
            v-else
            @click="logout"
            class="nav-cta text-red-400 hover:text-red-300 focus-visible:ring-red-400"
          >
            {{ t('nav.logout') }}
          </button>

          <!-- Light / Dark Mode -->
          <button
            @click="toggleTheme"
            class="text-xl hover:scale-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2 rounded"
            :aria-label="theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'"
          >
            <span v-if="theme === 'dark'">☀️</span>
            <span v-else>🌙</span>
          </button>

          <!-- Language switch -->
          <select
            v-model="locale"
            class="bg-transparent border border-fg/30 rounded px-2 py-1 text-sm outline-none"
          >
            <option value="fr-FR">FR</option>
            <option value="en-US">EN</option>
          </select>
        </div>

        <!-- Burger menu (mobile) -->
        <div class="md:hidden">
          <button
            @click="menuOpen = !menuOpen"
            class="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-2 rounded"
            aria-label="Menu"
          >
            <svg
              v-if="!menuOpen"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Meniu mobile -->
  <transition name="fade">
    <div
      v-if="menuOpen"
      class="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-bg/95 text-fg backdrop-blur-md md:hidden"
    >
      <button
        @click="menuOpen = false"
        class="absolute top-4 right-4 text-3xl hover:scale-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2 rounded"
        aria-label="Fermer le menu"
      >
        &times;
      </button>

      <router-link to="/" class="nav-text" @click="menuOpen = false">{{ t('nav.home') }}</router-link>
      <router-link to="/pong" class="nav-text" @click="menuOpen = false">{{ t('nav.games') }}</router-link>
      <router-link to="/dashboard" class="nav-text" @click="menuOpen = false">{{ t('nav.user') }}</router-link>

      <router-link
        v-if="!auth.isAuthenticated"
        to="/auth/login"
        class="nav-cta"
        @click="menuOpen = false"
      >
        {{ t('nav.login') }}
      </router-link>
      <button
        v-else
        @click="logout"
        class="nav-cta text-red-400 hover:text-red-300"
      >
        {{ t('nav.logout') }}
      </button>

      <button
        @click="toggleTheme"
        class="mt-6 text-2xl hover:scale-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2 rounded"
        :aria-label="theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'"
      >
        <span v-if="theme === 'dark'">☀️</span>
        <span v-else>🌙</span>
      </button>

      <select
        v-model="locale"
        class="bg-transparent border border-fg/30 rounded px-2 py-1 text-sm outline-none"
      >
        <option value="fr-FR">FR</option>
        <option value="en-US">EN</option>
      </select>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const { t, locale } = useI18n()
const menuOpen = ref(false)
const { theme, toggleTheme } = useTheme()
const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/auth/login')
}
</script>
