<template>
  <div class="max-w-md mx-auto space-y-8 panel">
    <h2 class="set-title">{{ t('dashboard.account-settings') }}</h2>

    <div class="space-y-2">
      <label class="set-label">{{ t('dashboard.new-username') }}</label>
      <input v-model="newUsername" type="text" class="set-input" :placeholder="t('dashboard.new-username')" />
    </div>

    <div class="space-y-2">
      <label class="set-label">{{ t('dashboard.current-password') }}</label>
      <input v-model="currentPassword" type="password" class="set-input" :placeholder="t('dashboard.current-password')" />

      <label class="set-label">{{ t('dashboard.new-password') }}</label>
      <input v-model="newPassword" type="password" class="set-input" :placeholder="t('dashboard.new-password')" />
    </div>

    <div class="space-y-2">
      <button @click="submitModifications" class="btn-primary">
        {{ t('dashboard.save-changes') }}
      </button>

      <p v-if="message" class="msg-ok">{{ message }}</p>
      <p v-if="errorMessage" class="msg-err">{{ errorMessage }}</p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
    errorMessage.value = t('dashboard.required-password')
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
    errorMessage.value = t('dashboard.no-changes')
    return
  }

  try {
    const res = await fetch('https://localhost/auth/modify/credentials', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user?.token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      throw new Error(data.message || t('dashboard.error-occured'))
    }

    message.value = data.message
    auth.user.username = data.user.username

    // Réinitialiser les champs sensibles
    currentPassword.value = ''
    newPassword.value = ''
  } catch (err: any) {
    errorMessage.value = err.message || t('dashboard.changes-error')
  }
}
</script>

<style scoped>
</style>
