<template>
  <div class="max-w-md mx-auto space-y-8">
    <h2 class="text-2xl font-bold text-center">Réglages du compte</h2>

    <!-- 🔤 Nom d'utilisateur -->
    <div class="space-y-2">
      <label class="block text-sm font-medium">Nom d'utilisateur</label>
      <input
        v-model="newUsername"
        type="text"
        class="w-full border px-3 py-2 rounded shadow-sm"
        placeholder="Nouveau pseudo"
      />
    </div>

    <!-- 🔒 Mot de passe -->
    <div class="space-y-2">
      <label class="block text-sm font-medium">Mot de passe actuel</label>
      <input
        v-model="currentPassword"
        type="password"
        class="w-full border px-3 py-2 rounded shadow-sm"
        placeholder="Mot de passe actuel"
      />

      <label class="block text-sm font-medium">Nouveau mot de passe</label>
      <input
        v-model="newPassword"
        type="password"
        class="w-full border px-3 py-2 rounded shadow-sm"
        placeholder="Nouveau mot de passe"
      />
    </div>

    <!-- ✅ Actions -->
    <div class="space-y-2">
      <button @click="submitModifications" class="btn-primary w-full">
        Enregistrer les modifications
      </button>

      <!-- messages -->
      <p v-if="message" class="text-green-600 text-sm text-center">{{ message }}</p>
      <p v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const newUsername = ref(auth.user?.username || '')
const currentPassword = ref('')
const newPassword = ref('')

const message = ref('')
const errorMessage = ref('')

const submitModifications = async () => {
  message.value = ''
  errorMessage.value = ''

  if (!currentPassword.value) {
    errorMessage.value = 'Le mot de passe actuel est requis.'
    return
  }

  const payload: Record<string, string> = {
    currentPassword: currentPassword.value,
  }

  if (newUsername.value && newUsername.value !== auth.user?.username) {
    payload.newUsername = newUsername.value
  }

  if (newPassword.value) {
    payload.newPassword = newPassword.value
  }

  if (!payload.newUsername && !payload.newPassword) {
    errorMessage.value = 'Aucune modification détectée.'
    return
  }

  try {
    const res = await fetch('https://localhost/auth/modify/credentials', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user.token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Une erreur est survenue.')
    }

    message.value = data.message
    auth.user.username = data.user.username

    // Réinitialiser les champs sensibles
    currentPassword.value = ''
    newPassword.value = ''
  } catch (err: any) {
    errorMessage.value = err.message || 'Erreur lors de la modification.'
  }
}
</script>

<style scoped>
.btn-primary {
  @apply bg-clpurple text-white font-semibold py-2 px-4 rounded shadow hover:bg-clpurple/80 transition;
}
</style>
