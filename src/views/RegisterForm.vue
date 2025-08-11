<template>
  <div class="auth-card p-8 space-y-8">
    <h2 class="auth-title">{{ t('auth.register.title') }}</h2>

    <p class="auth-subtext">
      {{ t('auth.register.subtitle') }}
      <router-link to="/auth/login" class="auth-link">{{ t('auth.register.cta') }}</router-link>
    </p>

    <form class="mt-8 space-y-6" @submit.prevent="onSubmit">
      <div class="space-y-4">
        <!-- Username -->
        <div>
          <label for="username" class="auth-label">{{ t('auth.register.username') }}</label>
          <input
            id="username"
            name="username"
            type="text"
            v-model="username"
            @input="validate"
            required
            class="auth-input"
            :class="{ 'border-red-500': usernameError }"
          />
          <p v-if="usernameError" class="text-xs text-red-500 mt-1">{{ usernameError }}</p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="auth-label">{{ t('auth.register.password') }}</label>
          <input
            id="password"
            name="password"
            type="password"
            v-model="password"
            @input="validate"
            required
            class="auth-input"
          />
        </div>

        <!-- Confirmation -->
        <div>
          <label for="confirmPassword" class="auth-label">{{ t('auth.register.confirm') }}</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            v-model="confirmPassword"
            @blur="validateConfirmPassword"
            required
            class="auth-input"
            :class="{ 'border-red-500': confirmPasswordError }"
          />
          <p v-if="confirmPasswordError" class="text-xs text-red-500 mt-1">{{ confirmPasswordError }}</p>
        </div>

        <!-- Erreurs -->
        <ul v-if="errors.length" class="text-xs text-red-500 list-disc ml-4">
          <li v-for="err in errors" :key="err">{{ err }}</li>
        </ul>

        <!-- Force du mot de passe -->
        <div class="mt-2">
          <div class="w-full h-2 rounded" style="background-color: color-mix(in oklab, var(--fg) 12%, transparent)">
            <div
              class="h-2 rounded transition-all duration-300"
              :class="strengthColors[strength]"
              :style="{ width: ((strength + 1) * 20) + '%' }"
            ></div>
          </div>
          <p class="text-xs mt-1" style="color: color-mix(in oklab, var(--fg) 70%, transparent)">
            {{ t(`auth.password.strength.${strength}`) }}
          </p>
        </div>
      </div>

      <div>
        <button type="submit" class="auth-btn-primary">
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

    router.push('/auth/login')
  } catch (err) {
    console.error(err)
    errors.value = ['Une erreur est survenue.']
  }
}
</script>
