<template>
  <div class="p-4 space-y-6 bg-bg text-fg">
    <!-- Header + stats -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-semibold set-title text-left">Amis</h2>
        <p class="text-sm" v-if="stats">
          Total: {{ stats.totalFriends }} · En ligne:
          <span :class="stats.onlineFriends ? 'text-accent-2' : 'opacity-60'">
            {{ stats.onlineFriends }}
          </span>
        </p>
      </div>
      <!-- Form ajout -->
      <form @submit.prevent="handleAddFriend" class="flex gap-2">
        <input
          v-model="addUsername"
          type="text"
          placeholder="Ajouter par pseudo"
          class="auth-input w-56"
        />
        <button
          :disabled="adding"
          type="submit"
          class="friends-btn friends-btn-accent friends-btn-sm"
        >
          {{ adding ? '...' : 'Ajouter' }}
        </button>
      </form>
    </div>

    <!-- Barre de recherche -->
    <div class="flex items-center gap-3">
      <input
        v-model="searchQuery"
        @input="debouncedSearch"
        type="text"
        placeholder="Rechercher des utilisateurs"
        class="auth-input flex-1"
      />
      <button
        @click="performSearch"
        class="friends-btn friends-btn-accent-ghost friends-btn-sm"
      >
        Chercher
      </button>
    </div>

    <!-- Résultats de recherche -->
    <div v-if="searching" class="text-sm opacity-70">Recherche...</div>

    <div v-else-if="searchQuery && searchResults.length" class="space-y-2">
      <h3 class="text-sm font-medium opacity-80">Résultats</h3>
      <ul class="space-y-2">
        <li
          v-for="u in searchResults"
          :key="u.id"
          class="panel p-3 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-3)] flex items-center justify-center text-white text-xs font-semibold overflow-hidden"
            >
              <img
                v-if="u.profileImage"
                :src="u.profileImage"
                alt="pfp"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ u.username.slice(0,2).toUpperCase() }}</span>
            </div>
            <div>
              <p class="text-sm font-medium flex items-center gap-2">
                {{ u.username }}
                <span
                  :class="[
                    'inline-block w-2 h-2 rounded-full',
                    u.isOnline ? 'bg-accent-2' : 'opacity-40 bg-fg'
                  ]"
                ></span>
              </p>
              <p class="text-xs opacity-70" v-if="u.isFriend">Déjà ami</p>
            </div>
          </div>

          <button
            class="friends-btn friends-btn-sm"
            :class="u.isFriend
              ? 'friends-btn-accent-ghost pointer-events-none opacity-60'
              : 'friends-btn-accent'"
            :disabled="u.isFriend || addingFriendIds.has(u.id)"
            @click="addFriendFromSearch(u)"
          >
            {{ addingFriendIds.has(u.id) ? '...' : (u.isFriend ? 'Ami' : 'Ajouter') }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Liste des amis -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium opacity-80">Votre liste</h3>
        <button @click="fetchFriends" class="friends-btn friends-btn-accent-ghost friends-btn-sm w-auto">
          Rafraîchir
        </button>
      </div>

      <div v-if="loading" class="text-sm opacity-70">Chargement...</div>
      <div v-else-if="!friends.length" class="text-sm opacity-70">Aucun ami pour l'instant.</div>

      <ul v-else class="space-y-2 max-h-96 overflow-auto pr-1">
        <li
          v-for="f in friends"
          :key="f.id"
          class="panel p-3 flex items-center justify-between group"
        >
          <div class="flex items-center gap-3">
            <div class="relative">
              <div
                class="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-3)] flex items-center justify-center text-white text-sm font-semibold overflow-hidden"
              >
                <img
                  v-if="f.profileImage"
                  :src="f.profileImage"
                  alt="pfp"
                  class="w-full h-full object-cover"
                />
                <span v-else>{{ f.username.slice(0,2).toUpperCase() }}</span>
              </div>
              <span
                :title="f.isOnline ? 'En ligne' : 'Hors ligne'"
                class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 avatar-ring"
                :class="f.isOnline ? 'bg-accent-2' : 'opacity-40 bg-fg'"
              ></span>
            </div>
            <div>
              <p class="text-sm font-medium">{{ f.username }}</p>
              <p class="text-xs opacity-70">Ajouté le {{ formatDate(f.friendshipCreatedAt) }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
            <button
              @click="removeFriend(f)"
              class="friends-btn friends-btn-danger friends-btn-sm"
              :disabled="removingFriendIds.has(f.id)"
            >
              {{ removingFriendIds.has(f.id) ? '...' : 'Suppr' }}
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { API_CONFIG, buildApiUrl } from '@/config/api'

interface Friend {
  id: string
  username: string
  profileImage?: string | null
  isOnline: boolean
  lastOnline: string
  friendshipCreatedAt: string
}

interface FriendSearchResult {
  id: string
  username: string
  profileImage?: string | null
  isOnline: boolean
  isFriend: boolean
}

interface FriendsStats { totalFriends: number; onlineFriends: number; offlineFriends: number }

const auth = useAuthStore()
const friends = ref<Friend[]>([])
const loading = ref(false)
const stats = ref<FriendsStats | null>(null)
const addUsername = ref('')
const adding = ref(false)
const removingFriendIds = ref<Set<string>>(new Set())
const addingFriendIds = ref<Set<string>>(new Set())

const searchQuery = ref('')
const searchResults = ref<FriendSearchResult[]>([])
const searching = ref(false)
let searchTimeout: any = null

function authHeaders() {
  const token = auth.user?.token
  return token ? { 'Authorization': `Bearer ${auth.user?.token}` } : {}
}

async function fetchFriends() {
  loading.value = true
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FRIENDS.LIST), { headers: authHeaders() })
    const data = await res.json()
    if (data.success) {
      friends.value = data.friends
      stats.value = { totalFriends: data.totalFriends, onlineFriends: data.onlineFriends, offlineFriends: data.totalFriends - data.onlineFriends }
    }
  } finally {
    loading.value = false
  }
}

async function fetchStats() {
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FRIENDS.STATS), { headers: authHeaders() })
    const data = await res.json()
    if (data.success) stats.value = data.stats
  } catch {}
}

async function handleAddFriend() {
  if (!addUsername.value.trim()) return
  adding.value = true
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FRIENDS.ADD), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ username: addUsername.value.trim() })
    })
    const data = await res.json()
    if (data.success) {
      addUsername.value = ''
      await fetchFriends()
    }
  } finally {
    adding.value = false
  }
}

async function removeFriend(f: Friend) {
  if (!confirm(`Supprimer ${f.username} ?`)) return
  removingFriendIds.value.add(f.id)
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FRIENDS.REMOVE(f.id)), {
      method: 'DELETE',
      headers: authHeaders()
    })
    const data = await res.json()
    if (data.success) {
      friends.value = friends.value.filter(fr => fr.id !== f.id)
      await fetchStats()
    }
  } finally {
    removingFriendIds.value.delete(f.id)
  }
}

function debounce(fn: Function, delay = 400) {
  return (...args: any[]) => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => fn(...args), delay)
  }
}

const debouncedSearch = debounce(() => performSearch())

async function performSearch() {
  if (!searchQuery.value.trim()) { searchResults.value = []; return }
  if (searchQuery.value.trim().length < 2) return
  searching.value = true
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FRIENDS.SEARCH(searchQuery.value.trim())), { headers: authHeaders() })
    const data = await res.json()
    if (data.success) searchResults.value = data.users
  } finally {
    searching.value = false
  }
}

async function addFriendFromSearch(u: FriendSearchResult) {
  if (u.isFriend) return
  addingFriendIds.value.add(u.id)
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FRIENDS.ADD), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ username: u.username })
    })
    const data = await res.json()
    if (data.success) {
      u.isFriend = true
      await fetchFriends()
    }
  } finally {
    addingFriendIds.value.delete(u.id)
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

onMounted(() => {
  fetchFriends()
  fetchStats()
  const interval = setInterval(() => {
    fetchFriends();
    fetchStats();
  }, 30_000) // refresh plus fréquent (30s)
  // heartbeat pour présence toutes les 60s (offline après 2 min)
  setInterval(async () => {
    try { await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FRIENDS.HEARTBEAT), { method: 'POST', headers: authHeaders() }) } catch {}
  }, 60_000)
  return () => clearInterval(interval)
})
</script>

<style scoped>
</style>