<template>
  <!-- container centre -->
  <div class="login-card">
    <div class="flex justify-center"></div>
    <h2 class="login-title">{{ t('auth.login.title') }}</h2>
    <p class="login-text" v-if="!need2FA">
      {{ t('auth.login.subtitle') }}
      <router-link to="/auth/register" class="login-cta-text">{{ t('auth.login.cta') }}</router-link>
    </p>

    <form class="mt-8 space-y-6" @submit.prevent="onSubmit">
      <div class="space-y-4" v-if="!need2FA">
        <div>
          <label for="username" class="login-label-text">{{ t('auth.login.username') }}</label>
          <input id="username" name="username" type="text" v-model="username" required class="login-label-box" />
        </div>
        <div>
          <label for="password" class="login-label-text">{{ t('auth.login.password') }}</label>
          <input id="password" name="password" type="password" v-model="password" required class="login-label-box" />
        </div>
      </div>

      <div v-else class="space-y-4">
        <p class="text-sm text-gray-600">{{ t('dashboard.2fa.prompt') }}</p>
        <div>
          <label for="twoFactor" class="login-label-text">Code 2FA</label>
          <input id="twoFactor" name="twoFactor" type="text" maxlength="6" v-model="twoFactorCode" required class="login-label-box tracking-widest text-center" />
        </div>
        <button type="button" class="text-xs login-cta-text" @click="need2FA = false">{{ t('dashboard.2fa.back') }}</button>
      </div>

      <div>
        <button type="submit" class="login-main-button" :disabled="loading || (need2FA && twoFactorCode.length < 6)">
          {{ loading ? (t('dashboard.2fa.loading') || '...') : (need2FA ? t('dashboard.2fa.validate') : t('auth.login.submit')) }}
        </button>
      </div>

      <ul v-if="errors.length" class="text-red-500 text-sm space-y-1">
        <li v-for="(e,i) in errors" :key="i">{{ e }}</li>
      </ul>

      <template v-if="!need2FA">
        <div class="relative mt-6">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-300"></div></div>
          <div class="relative flex justify-center text-sm"><span class="bg-white px-2 text-gray-500">{{ t('auth.login.separator') }}</span></div>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-3">
          <button type="button" class="login-third-party"> <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5 mr-2" />{{ t('auth.login.providers.google') }}</button>
          <button type="button" class="login-third-party">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.614-4.042-1.614-.546-1.387-1.333-1.756-1.333-1.756-1.09-.746.082-.73.082-.73 1.205.085 1.84 1.24 1.84 1.24 1.07 1.835 2.805 1.305 3.49.997.107-.776.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.81 1.096.81 2.21 0 1.595-.015 2.877-.015 3.27 0 .315.21.694.825.577C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
            {{ t('auth.login.providers.github') }}
          </button>
        </div>
      </template>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const twoFactorCode = ref('')
const errors = ref<string[]>([])
const need2FA = ref(false)
const loading = ref(false)

const onSubmit = async () => {
  errors.value = []
  if (need2FA.value) {
    await submit2FA()
    return
  }
  try {
    loading.value = true
    await auth.login(username.value, password.value)
    router.push('/dashboard')
  } catch (err: any) {
    if (err.message === '2FA_REQUIRED') {
      need2FA.value = true
      return
    }
    errors.value = [err.message || 'Erreur lors de la connexion.']
  } finally {
    loading.value = false
  }
}

const submit2FA = async () => {
  try {
    loading.value = true
    await auth.verify2FA(twoFactorCode.value)
    router.push('/dashboard')
  } catch (err: any) {
    errors.value = [err.message === '2FA_REQUIRED' ? 'Code requis' : (err.message || 'Code invalide')] 
  } finally {
    loading.value = false
  }
}
</script>

