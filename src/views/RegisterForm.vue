<template>
  <div class="login-card">
    <div class="flex justify-center"></div>

    <h2 class="login-title">{{ t('auth.register.title') }}</h2>
    <p class="login-text">
      {{ t('auth.register.subtitle') }}
      <router-link to="/auth/login" class="login-cta-text">{{ t('auth.register.cta') }}</router-link>
    </p>

    <form class="mt-8 space-y-6" @submit.prevent="onSubmit">
      <div class="space-y-4">
        <!-- Username -->
        <div>
          <label for="username" class="login-label-text">{{ t('auth.register.username') }}</label>
          <input
            id="username"
            name="username"
            type="text"
            v-model="username"
            @input="validate"
            required
            :class="['login-label-box', usernameError ? 'border-red-500' : '']"
          />
          <p v-if="usernameError" class="login-errors-text">{{ usernameError }}</p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="login-label-text">{{ t('auth.register.password') }}</label>
          <input
            id="password"
            name="password"
            type="password"
            v-model="password"
            @input="validate"
            required
            class="login-label-box"
          />
        </div>

        <!-- Confirmation -->
        <div>
          <label for="confirmPassword" class="login-label-text">{{ t('auth.register.confirm') }}</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            v-model="confirmPassword"
            @blur="validateConfirmPassword"
            required
            :class="['login-label-box', confirmPasswordError ? 'border-red-500' : '']"
          />
          <p v-if="confirmPasswordError" class="login-errors-text">{{ confirmPasswordError }}</p>
        </div>

        <!-- Erreurs -->
        <ul v-if="errors.length" class="login-errors-text">
          <li v-for="err in errors" :key="err">{{ err }}</li>
        </ul>

        <!-- Force du mot de passe -->
        <div class="mt-2">
          <div class="w-full h-2 bg-gray-200 rounded">
            <div
              class="h-2 rounded transition-all duration-300"
              :class="strengthColors[strength]"
              :style="{ width: ((strength + 1) * 20) + '%' }"
            ></div>
          </div>
          <p class="text-xs text-gray-600 mt-1">{{ t(`auth.password.strength.${strength}`) }}</p>
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="login-main-button"
        >
          {{ t('auth.register.submit') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Ref } from 'vue'
import { PasswordStrength, useAuthPolicy } from '@/composables/useAuthPolicy'
import { buildApiUrl, API_CONFIG } from '@/config/api'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = ref<string[]>([])
const usernameError = ref<string | null>(null)
const confirmPasswordError = ref<string | null>(null)

const { validatePassword, validateUsername } = useAuthPolicy()

const strength: Ref<PasswordStrength> = ref(0)

const strengthColors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-400',
  'bg-green-400',
  'bg-green-600'
]

const validateConfirmPassword = () => {
  confirmPasswordError.value = null
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Les mots de passe ne correspondent pas.'
  }
}

const validate = () => {
  errors.value = []
  usernameError.value = null
  confirmPasswordError.value = null

  const usernameResult = validateUsername(username.value)
  if (!usernameResult.valid && usernameResult.error)
    usernameError.value = usernameResult.error
  
  const passwordResult = validatePassword(password.value)
  errors.value.push(...passwordResult.errors)
  strength.value = passwordResult.strength
}

const onSubmit = async () => {
  validate()
  if (errors.value.length > 0 || usernameError.value) return

  try {
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })

    const data = await res.json()
    if (!res.ok || !data.success) throw new Error('Erreur lors de l’inscription.')

    console.log('Inscription réussie:', username.value)
    router.push('/auth/login')
  } catch (err) {
    console.error(err)
    errors.value = ['Une erreur est survenue.']
  }
}
</script>
