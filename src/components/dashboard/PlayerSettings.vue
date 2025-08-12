<template>
  <div class="auth-card p-8 space-y-8 max-w-md mx-auto">
    <h2 class="set-title">{{ t('dashboard.account-settings') }}</h2>

    <!-- Nom d'utilisateur -->
    <div class="space-y-2">
      <label class="set-label">{{ t('dashboard.new-username') }}</label>
      <input
        v-model="newUsername"
        type="text"
        class="set-input"
        :placeholder="t('dashboard.new-username')"
        autocomplete="off"
      />
    </div>

    <!-- Mot de passe -->
    <div class="space-y-2">
      <label class="set-label">{{ t('dashboard.current-password') }}</label>
      <input
        v-model="currentPassword"
        type="password"
        class="set-input"
        :placeholder="t('dashboard.current-password')"
        autocomplete="current-password"
      />

      <label class="set-label">{{ t('dashboard.new-password') }}</label>
      <input
        v-model="newPassword"
        type="password"
        class="set-input"
        :placeholder="t('dashboard.new-password')"
        autocomplete="new-password"
      />
    </div>

    <!-- Actions -->
    <div class="space-y-2">
      <button @click="submitModifications" class="auth-btn-primary w-full">
        {{ t('dashboard.save-changes') }}
      </button>

      <!-- messages -->
      <p v-if="message" class="msg-ok">{{ message }}</p>
      <p v-if="errorMessage" class="msg-err">{{ errorMessage }}</p>
    </div>

    <!-- Séparateur -->
    <div class="auth-sep-line mt-6"></div>

    <!-- 🔐 2FA -->
    <div class="space-y-3 pt-6">
      <h3 class="text-lg font-semibold flex items-center justify-between" style="color: var(--fg);">
        <span>{{ t('dashboard.2fa.title') }}</span>
        <span
          class="text-xs px-2 py-1 rounded"
          :style="twoFactorEnabled
            ? 'background-color: color-mix(in oklab, #16a34a 18%, transparent); color: #16a34a;'
            : 'background-color: color-mix(in oklab, var(--fg) 10%, transparent); color: color-mix(in oklab, var(--fg) 60%, transparent);'"
        >
          {{ twoFactorEnabled ? t('dashboard.2fa.enabled') : t('dashboard.2fa.disabled') }}
        </span>
      </h3>

      <p class="text-sm" style="color: color-mix(in oklab, var(--fg) 65%, transparent);">
        {{ t('dashboard.2fa.desc') }}
      </p>

      <div class="flex gap-2">
        <button
          v-if="!twoFactorEnabled"
          @click="open2FAModal"
          class="auth-btn-primary flex-1"
          :class="{ 'opacity-50 pointer-events-none': loading2FA }"
        >
          {{ loading2FA ? t('dashboard.2fa.loading') : t('dashboard.2fa.enable') }}
        </button>

        <button
          v-else
          @click="disable2FA"
          class="auth-btn-secondary flex-1"
          :class="{ 'opacity-50 pointer-events-none': loading2FA }"
        >
          {{ loading2FA ? t('dashboard.2fa.loading') : t('dashboard.2fa.disable') }}
        </button>
      </div>

      <p v-if="message2FA" class="msg-ok">{{ message2FA }}</p>
      <p v-if="error2FA" class="msg-err">{{ error2FA }}</p>
    </div>

    <!-- Popup / Modal Setup 2FA -->
    <div v-if="show2FAModal" class="fixed inset-0 z-39 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="close2FAModal" />
      <div class="relative auth-card w-full max-w-sm p-6 space-y-4">
        <h4 class="auth-title text-xl">{{ t('dashboard.2fa.setup-title') }}</h4>

        <ol class="space-y-2 text-sm" style="color: color-mix(in oklab, var(--fg) 80%, transparent); list-style: decimal inside;">
          <li>{{ t('dashboard.2fa.step1') }}</li>
          <li>{{ t('dashboard.2fa.step2') }}</li>
          <li>{{ t('dashboard.2fa.step3') }}</li>
        </ol>

        <div v-if="qrCodeDataUrl" class="flex flex-col items-center gap-2">
          <img :src="qrCodeDataUrl" alt="QR Code 2FA" class="w-40 h-40" />
          <code class="text-xs break-all px-2 py-1 rounded"
                style="background-color: color-mix(in oklab, var(--bg) 90%, var(--fg) 10%); color: var(--fg);">
            {{ secret }}
          </code>
        </div>
        <div v-else class="text-center py-8 text-sm" style="color: color-mix(in oklab, var(--fg) 60%, transparent);">
          {{ t('dashboard.2fa.loading') }}
        </div>

        <div class="space-y-2">
          <label class="set-label text-xs">{{ t('dashboard.2fa.enter-code') }}</label>
          <input
            v-model="verificationCode"
            type="text"
            maxlength="6"
            class="auth-input text-center tracking-widest"
            placeholder="123456"
            inputmode="numeric"
            autocomplete="one-time-code"
          />
        </div>

        <div class="flex gap-2 pt-2">
          <button
            @click="confirm2FASetup"
            class="auth-btn-primary flex-1"
            :class="{ 'opacity-50 pointer-events-none': loading2FA || verificationCode.length < 6 }"
          >
            {{ loading2FA ? t('dashboard.2fa.loading') : t('dashboard.2fa.confirm') }}
          </button>

          <button
            @click="close2FAModal"
            class="auth-btn-secondary flex-1"
          >
            {{ t('dashboard.2fa.cancel') }}
          </button>
        </div>
        <p v-if="error2FA" class="msg-err text-center">{{ error2FA }}</p>
      </div>
    </div>
    <div class="auth-sep-line mt-6"></div>

    <!-- Modification image profil et bannière -->
    <div class="space-y-6 pt-6">
      <!-- Avatar -->
      <div class="space-y-2">
        <label class="set-label">{{ t('dashboard.modify.avatar') || 'Photo de profil' }}</label>

        <div class="flex items-center gap-4">
          <img
            :src="currentAvatar || fallbackAvatar"
            alt="Avatar actuel"
            class="w-16 h-16 rounded-full object-cover"
          />
          <div class="flex-1">
            <button class="auth-btn-primary" type="button" @click="avatarInput?.click()">
              {{ t('dashboard.modify.avatar') || 'Changer l\'avatar' }}
            </button>
            <input
              ref="avatarInput"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              class="hidden"
              @change="onAvatarFileChange"
            />
            <p v-if="avatarMsg" class="msg-ok mt-2">{{ avatarMsg }}</p>
            <p v-if="avatar.error" class="msg-err mt-2">{{ avatar.error }}</p>
          </div>
        </div>
      </div>

      <div class="auth-sep-line"></div>

      <!-- Bannière -->
      <div class="space-y-2">
        <label class="set-label">{{ t('dashboard.modify.banner') || 'Image de bannière' }}</label>

        <div class="space-y-3">
          <img
            :src="currentBanner || fallbackBanner"
            alt="Bannière actuelle"
            class="w-full rounded-lg object-cover"
            style="aspect-ratio: 16 / 5;"
          />
          <div>
            <button class="auth-btn-primary" type="button" @click="bannerInput?.click()">
              {{ t('dashboard.modify.banner') || 'Changer l’image de bannière' }}
            </button>
            <input
              ref="bannerInput"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              class="hidden"
              @change="onBannerFileChange"
            />
            <p v-if="bannerMsg" class="msg-ok mt-2">{{ bannerMsg }}</p>
            <p v-if="banner.error" class="msg-err mt-2">{{ banner.error }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="space-y-2 pt-6">
  <label class="set-label">{{ t('dashboard.colorblind.title') }}</label>

  <div class="grid gap-2 md:grid-cols-2">
    <!-- Optionnel : interrupteur général -->
    <label class="flex items-center gap-3">
      <input type="checkbox" :checked="colorblind" @change="onCB($event)" />
      <span class="text-xs">{{ t('dashboard.colorblind.enable') }}</span>
    </label>

    <!-- Sélecteur de type -->
    <select v-model="cbMode" class="set-input" @change="onCBModeChange">
      <option value="none">{{ t('dashboard.colorblind.none') }}</option>
      <option value="protan">{{ t('dashboard.colorblind.protan') }}</option>
      <option value="deutan">{{ t('dashboard.colorblind.deutan') }}</option>
      <option value="tritan">{{ t('dashboard.colorblind.tritan') }}</option>
    </select>
  </div>
  <p class="text-xs" style="color: color-mix(in oklab, var(--fg) 60%, transparent);">
    {{ t('dashboard.colorblind.hint') }}
  </p>
</div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { buildApiUrl, API_CONFIG } from '@/config/api'
import { useTheme } from '@/composables/useTheme'
import { useImageUpload } from '@/composables/useImageUpload'
import { useRouter } from 'vue-router'

const router = useRouter()

// AVATR / BANNER 

const avatar = useImageUpload('avatar')
const banner = useImageUpload('banner')

const avatarInput = ref<HTMLInputElement | null>(null)
const bannerInput = ref<HTMLInputElement | null>(null)

const fallbackAvatar = '/src/assets/img/test_avatar.jpg'
const fallbackBanner = '/src/assets/img/test_banner.jpg'

const currentAvatar = ref<string | null>(null)
const currentBanner = ref<string | null>(null)

const avatarMsg = ref('')
const bannerMsg = ref('')

onMounted(async () => {
  currentAvatar.value = await avatar.fetchCurrent()
  currentBanner.value = await banner.fetchCurrent()
})

const onAvatarFileChange = async (e: Event) => {
  avatarMsg.value = ''
  const target = e.target as HTMLInputElement
  const f = target.files?.[0]
  if (!f) return

  const ok = await avatar.uploadFile(f)
  if (ok) {
    currentAvatar.value = await avatar.fetchCurrent()
    avatarMsg.value = t('dashboard.modify.avatar') || 'Image de profil mise à jour.'
    router.go(0)
  }
  target.value = '' // autorise re-upload du meme fichier
}

const onBannerFileChange = async (e: Event) => {
  bannerMsg.value = ''
  const target = e.target as HTMLInputElement
  const f = target.files?.[0]
  if (!f) return

  const ok = await banner.uploadFile(f)
  if (ok) {
    currentBanner.value = await banner.fetchCurrent()
    bannerMsg.value = t('dashboard.modify.banner') || 'Bannière mise à jour.'
    router.go(0)
  }
  target.value = ''
}

// PAS TOUCHER
const { colorblind, setColorblind, colorblindMode, setColorblindMode } = useTheme()
const cbMode = ref(colorblindMode.value)

const onCB = (e: Event) => setColorblind((e.target as HTMLInputElement).checked)
const onCBModeChange = () => setColorblindMode(cbMode.value)
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

  const payload: Record<string, string> = { currentPassword: currentPassword.value }

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
    if (!res.ok || !data.success) throw new Error(data.message || t('dashboard.error-occured'))

    message.value = data.message
    if (auth.user) auth.user.username = data.user.username
    currentPassword.value = ''
    newPassword.value = ''
  } catch (err: any) {
    errorMessage.value = err.message || t('dashboard.changes-error')
  }
}

/* ------- 2FA ------- */
const twoFactorEnabled = ref(!!auth.user?.twoFactorEnabled)
const show2FAModal = ref(false)
const qrCodeDataUrl = ref<string>('')
const secret = ref<string>('')
const verificationCode = ref<string>('')
const loading2FA = ref(false)
const message2FA = ref('')
const error2FA = ref('')

const reset2FAFeedback = () => { message2FA.value = ''; error2FA.value = '' }

const open2FAModal = async () => {
  reset2FAFeedback()
  show2FAModal.value = true
  qrCodeDataUrl.value = ''
  secret.value = ''
  verificationCode.value = ''
  await requestEnable2FA()
}

const close2FAModal = () => {
  if (!loading2FA.value) show2FAModal.value = false
}

const requestEnable2FA = async () => {
  try {
    loading2FA.value = true
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.ENABLE_2FA), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.user?.token}` },
      body: JSON.stringify({})
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur génération 2FA')
    secret.value = data.secret
    qrCodeDataUrl.value = data.qrCodeDataURL || data.qrCodeDataUrl || ''
  } catch (e: any) {
    error2FA.value = e.message || 'Impossible de générer le secret.'
  } finally {
    loading2FA.value = false
  }
}

const confirm2FASetup = async () => {
  reset2FAFeedback()
  if (verificationCode.value.length < 6 || !secret.value) return
  try {
    loading2FA.value = true
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.VERIFY_2FA), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.user?.token}` },
      body: JSON.stringify({ token: verificationCode.value, secret: secret.value }),
    })
    const data = await res.json()
    if (!res.ok || !data.success) throw new Error(data.message || 'Code invalide')
    twoFactorEnabled.value = true
    if (auth.user) auth.user.twoFactorEnabled = true as any
    message2FA.value = data.message || '2FA activée.'
    loading2FA.value = false
    close2FAModal()
  } catch (e: any) {
    error2FA.value = e.message || 'Échec activation 2FA.'
    loading2FA.value = false
  }
}

const disable2FA = async () => {
  reset2FAFeedback()
  if (!confirm(t('dashboard.2fa.disable-confirm'))) return
  try {
    loading2FA.value = true
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.DISABLE_2FA), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.user?.token}` },
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

onMounted(async () => {
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.STATUS_2FA), {
      headers: { Authorization: `Bearer ${auth.user?.token}` }
    })
    const data = await res.json()
    if (res.ok && data.success) {
      twoFactorEnabled.value = !!data.data?.enabled
      if (auth.user) auth.user.twoFactorEnabled = twoFactorEnabled.value as any
    }
  } catch (_) {}
})
</script>