<template>
  <div class="auth-wrapper bg-bg text-fg">
    <!-- horizon -->
    <div aria-hidden="true" class="auth-horizon" />
    <!-- grille -->
    <div aria-hidden="true" class="auth-persp">
      <div class="auth-grid" />
    </div>

    <!-- contenu centré -->
    <div class="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/views/LoginForm.vue'
</script>
