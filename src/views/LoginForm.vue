<template>
  <!-- container centre -->
  <div class="w-full max-w-md space-y-8 bg-white p-8 rounded shadow">
    <div class="flex justify-center">
      <!-- <img src="/logo.svg" alt="Logo" class="h-10 w-10" /> -->
    </div>

    <!-- titre principal login -->
    <h2 class="text-center text-2xl font-bold text-gray-900">{{ t('auth.login.title') }}</h2>
    <!-- sous titre + lien  -->
    <p class="text-center text-sm text-gray-600">
      {{ t('auth.login.subtitle') }}
      <router-link to="/auth/register" class="font-medium text-clpurple hover:text-clpurple">{{ t('auth.login.cta') }}</router-link>
    </p>
    <!-- formulaire de connexion -->
    <form class="mt-8 space-y-6" @submit.prevent="onSubmit">
      <div class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">{{ t('auth.login.email') }}</label>
          <input
            id="email"
            name="email"
            type="email"
            v-model="email"
            required
            class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
          />
        </div>
        <!-- champ mot de passe -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">{{ t('auth.login.password') }}</label>
          <input
            id="password"
            name="password"
            type="password"
            v-model="password"
            @input="validate"
            required
            class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
          />
          <!-- affichage des msgs d'erreur -->
          <ul v-if="errors.length" class="text-xs text-red-500 mt-1 list-disc ml-4">
            <li v-for="err in errors" :key="err">{{ err }}</li>
          </ul>
          <!-- jauge de securite -->
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
      </div>
      <!-- se souvenir de moi + mdp oublie -->
      <div class="flex items-center justify-between">
        <label class="flex items-center text-sm text-gray-600">
          <input type="checkbox" class="mr-2 h-4 w-4 rounded border-gray-300" />
          {{ t('auth.login.remember') }}
        </label>
        <div class="text-sm">
          <a href="#" class="font-medium text-clpurple hover:text-clpurple">{{ t('auth.login.forgot') }}</a> // a rediriger vers reinit mdp
        </div>
      </div>
      <!-- submit bouton -->
      <div>
        <button
          type="submit"
          class="w-full flex justify-center rounded-md border border-transparent bg-clpurple py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 transition"
        >
          {{ t('auth.login.submit') }}
        </button>
      </div>
      <!-- separateur visuel -->
      <div class="relative mt-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="bg-white px-2 text-gray-500">{{ t('auth.login.separator') }}</span>
        </div>
      </div>
      <!-- boutons sociaux connexion Github + Goole -->
      <div class="mt-6 grid grid-cols-2 gap-3">
        <!-- Google -->
        <button
          type="button"
          class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5 mr-2" />
          {{ t('auth.login.providers.google') }}
        </button>
        <!-- Github -->
        <button
          type="button"
          class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.614-4.042-1.614-.546-1.387-1.333-1.756-1.333-1.756-1.09-.746.082-.73.082-.73 1.205.085 1.84 1.24 1.84 1.24 1.07 1.835 2.805 1.305 3.49.997.107-.776.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.81 1.096.81 2.21 0 1.595-.015 2.877-.015 3.27 0 .315.21.694.825.577C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            />
          </svg>
          {{ t('auth.login.providers.github') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { PasswordStrength, usePasswordPolicy } from '@/composables/usePasswordPolicy'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const email = ref('')
const password = ref('')
const errors = ref<string[]>([])

const { validatePassword } = usePasswordPolicy()

const strength: Ref<PasswordStrength> = ref(0)

const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort']
const strengthColors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-400',
  'bg-green-400',
  'bg-green-600'
]

const validate = () => {
  const result = validatePassword(password.value)
  errors.value = result.errors
  strength.value = result.strength
}

const onSubmit = () => {
  validate()
  if (errors.value.length === 0) {
    console.log('Connexion en cours avec', { email: email.value, password: password.value })
    // Appel API ici
  }
}
</script>
