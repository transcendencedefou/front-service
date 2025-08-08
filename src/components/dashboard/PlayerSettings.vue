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

    <!-- 🔐 2FA -->
    <div class="space-y-2 border-t pt-6">
      <h3 class="text-lg font-semibold flex items-center justify-between">
        <span>{{ t('dashboard.2fa.title') }}</span>
        <span class="text-xs px-2 py-1 rounded"
              :class="twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'">
          {{ twoFactorEnabled ? t('dashboard.2fa.enabled') : t('dashboard.2fa.disabled') }}
        </span>
      </h3>
      <p class="text-sm text-gray-500">
        {{ t('dashboard.2fa.desc') }}
      </p>
      <div class="flex gap-2">
        <button v-if="!twoFactorEnabled" @click="open2FAModal" class="btn-primary flex-1" :disabled="loading2FA">
          {{ loading2FA ? t('dashboard.2fa.loading') : t('dashboard.2fa.enable') }}
        </button>
        <button v-else @click="disable2FA" class="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-red-600 transition" :disabled="loading2FA">
          {{ loading2FA ? t('dashboard.2fa.loading') : t('dashboard.2fa.disable') }}
        </button>
      </div>
      <p v-if="message2FA" class="text-green-600 text-xs mt-1">{{ message2FA }}</p>
      <p v-if="error2FA" class="text-red-500 text-xs mt-1">{{ error2FA }}</p>
    </div>

    <!-- Popup / Modal Setup 2FA -->
    <div v-if="show2FAModal" class="fixed inset-0 z-39 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="close2FAModal" />
      <div class="relative bg-white dark:bg-neutral-900 rounded-lg shadow-lg w-full max-w-sm p-6 space-y-4">
        <h4 class="text-xl font-semibold text-center">{{ t('dashboard.2fa.setup-title') }}</h4>
        <ol class="space-y-2 text-sm list-decimal list-inside">
          <li>{{ t('dashboard.2fa.step1') }}</li>
          <li>{{ t('dashboard.2fa.step2') }}</li>
          <li>{{ t('dashboard.2fa.step3') }}</li>
        </ol>

        <div v-if="qrCodeDataUrl" class="flex flex-col items-center gap-2">
          <img :src="qrCodeDataUrl" alt="QR Code 2FA" class="w-40 h-40" />
          <code class="text-xs break-all bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded">{{ secret }}</code>
        </div>
        <div v-else class="text-center py-8 text-sm text-gray-500">
          {{ t('dashboard.2fa.loading') }}
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-medium">{{ t('dashboard.2fa.enter-code') }}</label>
          <input v-model="verificationCode" type="text" maxlength="6" class="w-full border px-3 py-2 rounded shadow-sm text-center tracking-widest" placeholder="123456" />
        </div>

        <div class="flex gap-2 pt-2">
          <button @click="confirm2FASetup" class="btn-primary flex-1" :disabled="loading2FA || verificationCode.length < 6">
            {{ loading2FA ? t('dashboard.2fa.loading') : t('dashboard.2fa.confirm') }}
          </button>
          <button @click="close2FAModal" class="flex-1 border font-semibold py-2 px-4 rounded hover:bg-gray-50 dark:hover:bg-neutral-800 transition">
            {{ t('dashboard.2fa.cancel') }}
          </button>
        </div>
        <p v-if="error2FA" class="text-red-500 text-xs text-center">{{ error2FA }}</p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { buildApiUrl, API_CONFIG } from '@/config/api'

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
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.MODIFY_CREDENTIALS), {
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

// 2FA state
const twoFactorEnabled = ref(!!auth.user?.twoFactorEnabled)
const show2FAModal = ref(false)
const qrCodeDataUrl = ref<string>('')
const secret = ref<string>('')
const verificationCode = ref<string>('')
const loading2FA = ref(false)
const message2FA = ref('')
const error2FA = ref('')

const reset2FAFeedback = () => {
  message2FA.value = ''
  error2FA.value = ''
}

// Ouvre modal et déclenche /2fa/enable (qui génère secret + QR) sans confirmer encore
const open2FAModal = async () => {
  reset2FAFeedback()
  show2FAModal.value = true
  qrCodeDataUrl.value = ''
  secret.value = ''
  verificationCode.value = ''
  await requestEnable2FA()
}

const close2FAModal = () => {
  if (loading2FA.value) return
  show2FAModal.value = false
}

// Phase 1: Demander génération secret + QR => POST /2fa/enable (sans code utilisateur)
const requestEnable2FA = async () => {
  try {
    loading2FA.value = true
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.ENABLE_2FA), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.user.token}` },
      body: JSON.stringify({})
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur génération 2FA')
    // Réponse attendue: { qrCodeDataURL, secret }
    secret.value = data.secret
    qrCodeDataUrl.value = data.qrCodeDataURL || data.qrCodeDataUrl || ''
  } catch (e: any) {
    error2FA.value = e.message || 'Impossible de générer le secret.'
  } finally {
    loading2FA.value = false
  }
}

// Phase 2: Vérification du token 6 chiffres => POST /2fa/verify { token, secret }
const confirm2FASetup = async () => {
  reset2FAFeedback()
  if (verificationCode.value.length < 6 || !secret.value) return
  try {
    loading2FA.value = true
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.VERIFY_2FA), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.user.token}` },
      body: JSON.stringify({ token: verificationCode.value, secret: secret.value }),
    })
    const data = await res.json()
    if (!res.ok || !data.success) throw new Error(data.message || 'Code invalide')
    twoFactorEnabled.value = true
    if (auth.user) auth.user.twoFactorEnabled = true as any
    message2FA.value = data.message || '2FA activée.'
    // Fermer le modal après succès
    loading2FA.value = false
    close2FAModal()
  } catch (e: any) {
    error2FA.value = e.message || 'Échec activation 2FA.'
    loading2FA.value = false
  }
}

// Désactivation => POST /2fa/disable
const disable2FA = async () => {
  reset2FAFeedback()
  if (!confirm(t('dashboard.2fa.disable-confirm'))) return
  try {
    loading2FA.value = true
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.DISABLE_2FA), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.user.token}` },
      body: JSON.stringify({})
    })
    const data = await res.json()
    if (!res.ok || data.success === false) throw new Error(data.message || 'Erreur désactivation')
    twoFactorEnabled.value = false
    if (auth.user) auth.user.twoFactorEnabled = false as any
    message2FA.value = data.message || '2FA désactivée.'
  } catch (e: any) {
    error2FA.value = e.message || 'Échec désactivation 2FA.'
  } finally {
    loading2FA.value = false
  }
}

// Charger statut 2FA initial depuis backend (optionnel)
onMounted(async () => {
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.STATUS_2FA), {
      headers: { Authorization: `Bearer ${auth.user.token}` }
    })
    const data = await res.json()
    if (res.ok && data.success) {
      twoFactorEnabled.value = !!data.data?.enabled
      if (auth.user) auth.user.twoFactorEnabled = twoFactorEnabled.value as any
    }
  } catch (_) {}
})
</script>

<style scoped>
</style>
