<template>
  <div class="p-8 text-center">
    <p v-if="processing" class="text-sm opacity-70">Traitement de la connexion OAuth...</p>
    <p v-else-if="success" class="text-green-500">Connexion réussie. Redirection...</p>
    <p v-else class="text-red-500">Échec de la connexion OAuth.</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { oauthLoginFromParams } from '@/stores/auth'

const router = useRouter()
const processing = ref(true)
const success = ref(false)

onMounted(() => {
  const hash = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : ''
  const params = new URLSearchParams(hash)
  const ok = oauthLoginFromParams(params)
  processing.value = false
  success.value = ok
  setTimeout(() => {
    router.replace(ok ? '/dashboard' : '/auth/login')
  }, 800)
})
</script>
