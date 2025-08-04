<template>
  <div class="w-full max-w-md space-y-8 bg-white p-8 rounded shadow">
    <div class="flex justify-center"></div>

    <h2 class="text-center text-2xl font-bold text-gray-900">Inscris-toi le reuf</h2>
    <p class="text-center text-sm text-gray-600">
      Déjà un compte ?
      <router-link to="/login" class="font-medium text-clpurple hover:text-clpurple">connecte-toi !</router-link>
    </p>

    <form class="mt-8 space-y-6" @submit.prevent="onSubmit">
      <div class="space-y-4">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
          <input
            id="username"
            name="username"
            type="text"
            v-model="username"
            required
            class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            v-model="password"
            @input="validate"
            required
            class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
          />
        </div>

        <!-- Confirmation -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Répéter le mot de passe</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            v-model="confirmPassword"
            required
            class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
          />
        </div>

        <!-- Erreurs -->
        <ul v-if="errors.length" class="text-xs text-red-500 mt-1 list-disc ml-4">
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
          <p class="text-xs text-gray-600 mt-1">{{ strengthLabels[strength] }}</p>
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="w-full flex justify-center rounded-md border border-transparent bg-clpurple py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 transition"
        >
          Créer un compte
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

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = ref<string[]>([])

const router = useRouter()
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

  if (password.value !== confirmPassword.value) {
    errors.value.push("Les mots de passe ne correspondent pas.")
  }
}

const onSubmit = async () => {
  validate()
  if (errors.value.length > 0) return

  try {
    const res = await fetch('http://localhost/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    })

    const data = await res.json()

    if (!res.ok || !data.success) throw new Error('Erreur lors de l’inscription.')

    console.log('Inscription réussie:', data.user)
    router.push('/login')
  } catch (err) {
    console.error(err)
    errors.value = ['Une erreur est survenue.']
  }
}
</script>
