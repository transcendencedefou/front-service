<template>
  <div class="auth-wrapper bg-bg text-fg">
    <!-- Horizon -->
    <div aria-hidden="true" class="auth-horizon" />
    <!-- Grille -->
    <div aria-hidden="true" class="auth-persp">
      <div class="auth-grid" />
    </div>

    <!-- Formulaire -->
    <div class="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
      <RegisterForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '@/views/RegisterForm.vue'
</script>
