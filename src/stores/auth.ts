import { defineStore } from 'pinia'
import { User } from '@/models/User'
import API_CONFIG, { buildApiUrl } from '@/config/api'

console.log('[API]', buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN))

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),
  getters: {
    isAuthenticated: (state) => state.user !== null,
  },
  actions: {
    async login(username: string, password: string) {
      try {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Erreur de connexion')
        }

        const user = new User(data.user.id, data.user.username, data.token)
        this.user = user
        localStorage.setItem('token', user.token)
        localStorage.setItem('username', user.username)
        localStorage.setItem('id', user.id)

        return true
      } catch (err: any) {
        console.error('[AUTH LOGIN]', err)
        throw err
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    },

    loadUserFromLocalStorage() {
      const token = localStorage.getItem('token')
      const username = localStorage.getItem('username')
      const id = localStorage.getItem('id')
      if (token && username && id) {
        this.user = new User(id, username, token)
      }
    },
  },
})
