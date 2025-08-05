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
            required
            class="login-label-box"
          />
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
            required
            class="login-label-box"
          />
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
import { PasswordStrength, usePasswordPolicy } from '@/composables/usePasswordPolicy'
import { buildApiUrl, API_CONFIG } from '@/config/api'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = ref<string[]>([])

const router = useRouter()
const { validatePassword } = usePasswordPolicy()

const strength: Ref<PasswordStrength> = ref(0)

const strengthColors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-400',
  'bg-green-400',
  'bg-green-600'
]

const validate = () => {
  errors.value = []
  const result = validatePassword(password.value)
  errors.value = result.errors
  strength.value = result.strength

  if (password.value !== confirmPassword.value) {
    errors.value.push("Les mots de passe ne correspondent pas.")
  }
}

const onSubmit = async () => {
  validate()
  if (errors.value.length > 0) return

  try {
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
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