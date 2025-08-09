import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { User } from '@/models/User'
import API_CONFIG, { buildApiUrl } from '@/config/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const pending2FA = ref(false)
  const tempCredentials = ref({ username: '', password: '' })

  const isAuthenticated = computed(() => user.value !== null)

  async function login(username: string, password: string, twoFactorCode?: string): Promise<boolean> {
    const body: any = { username, password }
    if (twoFactorCode) body.twoFactorCode = twoFactorCode
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()

    if (data.twoFactorRequired) {
      pending2FA.value = true
      tempCredentials.value.username = username
      tempCredentials.value.password = password
      throw new Error('2FA_REQUIRED')
    }

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Erreur de connexion')
    }
    const u = new User(data.user.id, data.user.username, data.token, !!data.user.twoFactorEnabled)
    user.value = u
    localStorage.setItem('token', u.token)
    localStorage.setItem('username', u.username)
    localStorage.setItem('id', u.id)
    localStorage.setItem('twoFactorEnabled', String(!!u.twoFactorEnabled))
    pending2FA.value = false
    tempCredentials.value = { username: '', password: '' }
    return true
  }

  async function verify2FA(code: string): Promise<boolean> {
    if (!pending2FA.value) throw new Error('Aucune 2FA en attente')
    return login(tempCredentials.value.username, tempCredentials.value.password, code)
  }

  function logout(): void {
    user.value = null
    pending2FA.value = false
    tempCredentials.value = { username: '', password: '' }
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('id')
    localStorage.removeItem('twoFactorEnabled')
  }

  function loadUserFromLocalStorage(): void {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const id = localStorage.getItem('id')
    const twoFactorEnabled = localStorage.getItem('twoFactorEnabled') === 'true'

    if (token && username && id) {
      const u = new User(id, username, token, twoFactorEnabled)
      user.value = u
    }
  }

  function setTwoFactorEnabled(v: boolean) {
    if (!user.value) return
    user.value.twoFactorEnabled = v
    localStorage.setItem('twoFactorEnabled', String(v))
  }

  return { user, pending2FA, tempCredentials, isAuthenticated, login, verify2FA, logout, loadUserFromLocalStorage, setTwoFactorEnabled }
})
