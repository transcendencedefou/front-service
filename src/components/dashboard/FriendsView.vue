<template>
  <div class="p-4 space-y-6">
    <!-- Messages -->
    <transition name="fade">
      <div v-if="feedback.message" :class="['rounded-md px-4 py-2 text-sm flex items-start gap-2', feedback.type==='success' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300']">
        <span class="font-medium" v-if="feedback.type==='success'">Succès:</span>
        <span class="font-medium" v-else>Erreur:</span>
        <span class="flex-1">{{ feedback.message }}</span>
        <button class="text-xs opacity-60 hover:opacity-100" @click="clearFeedback">✕</button>
      </div>
    </transition>
    <!-- Header + stats -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Amis</h2>
        <p class="text-sm text-gray-500" v-if="stats">Total: {{ stats.totalFriends }} · En ligne: <span :class="stats.onlineFriends ? 'text-green-600' : 'text-gray-400'">{{ stats.onlineFriends }}</span></p>
      </div>
      <!-- Form ajout -->
      <form @submit.prevent="handleAddFriend" class="flex gap-2">
        <input v-model="addUsername" type="text" placeholder="Ajouter par pseudo" class="px-3 py-2 rounded-md bg-white/70 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-clpurple" />
        <button :disabled="adding" type="submit" class="px-4 py-2 rounded-md bg-clpurple text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed">{{ adding ? '...' : 'Ajouter' }}</button>
      </form>
    </div>

    <!-- Barre de recherche -->
    <div class="flex items-center gap-3">
      <input v-model="searchQuery" @input="debouncedSearch" type="text" placeholder="Rechercher des utilisateurs" class="flex-1 px-3 py-2 rounded-md bg-white/70 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-clpurple" />
      <button @click="performSearch" class="px-3 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">Chercher</button>
    </div>

    <!-- Résultats de recherche -->
    <div v-if="searching" class="text-sm text-gray-500">Recherche...</div>
    <div v-else-if="searchQuery && searchResults.length" class="space-y-2">
      <h3 class="text-sm font-medium text-gray-600 dark:text-gray-300">Résultats</h3>
      <ul class="space-y-2">
        <li v-for="u in searchResults" :key="u.id" class="flex items-center justify-between p-3 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-clpurple to-indigo-500 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
              <img v-if="u.profileImage" :src="u.profileImage" alt="pfp" class="w-full h-full object-cover" />
              <span v-else>{{ u.username.slice(0,2).toUpperCase() }}</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2">
                {{ u.username }}
                <span :class="['inline-block w-2 h-2 rounded-full', u.isOnline ? 'bg-green-500' : 'bg-gray-400']"></span>
              </p>
              <p class="text-xs text-gray-500" v-if="u.isFriend">Déjà ami</p>
            </div>
          </div>
          <button
            class="px-3 py-1.5 rounded-md text-xs font-medium"
            :class="u.isFriend ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed' : 'bg-clpurple text-white hover:opacity-90'"
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
        <h3 class="text-sm font-medium text-gray-600 dark:text-gray-300">Votre liste</h3>
        <button @click="fetchFriends" class="text-xs text-clpurple hover:underline">Rafraîchir</button>
      </div>
      <div v-if="loading" class="text-sm text-gray-500">Chargement...</div>
      <div v-else-if="!friends.length" class="text-sm text-gray-500">Aucun ami pour l'instant.</div>
      <ul v-else class="space-y-2 max-h-96 overflow-auto pr-1">
        <li v-for="f in friends" :key="f.id" class="flex items-center justify-between p-3 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-clpurple to-indigo-500 flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                <img v-if="f.profileImage" :src="f.profileImage" alt="pfp" class="w-full h-full object-cover" />
                <span v-else>{{ f.username.slice(0,2).toUpperCase() }}</span>
              </div>
              <span :title="f.isOnline ? 'En ligne' : 'Hors ligne'" class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800" :class="f.isOnline ? 'bg-green-500' : 'bg-gray-400'"></span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-800 dark:text-gray-100">{{ f.username }}</p>
              <p class="text-xs text-gray-500">Ajouté le {{ formatDate(f.friendshipCreatedAt) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
            <button @click="removeFriend(f)" class="px-2 py-1 rounded-md bg-red-500/90 hover:bg-red-600 text-white text-xs" :disabled="removingFriendIds.has(f.id)">
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

const feedback = ref<{message: string|null; type: 'success'|'error'}>({ message: null, type: 'success' })
let feedbackTimeout: any = null

function authHeaders() {
  return { 'Authorization': `Bearer ${auth.user?.token}` }
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

function showFeedback(message: string, type: 'success'|'error'='success', autoHideMs=4000) {
  feedback.value = { message, type }
  if (feedbackTimeout) clearTimeout(feedbackTimeout)
  if (autoHideMs) feedbackTimeout = setTimeout(() => { feedback.value.message = null }, autoHideMs)
}

function clearFeedback() { if (feedbackTimeout) clearTimeout(feedbackTimeout); feedback.value.message = null }

async function handleAddFriend() {
  if (!addUsername.value.trim()) { showFeedback('Pseudo requis', 'error'); return }
  adding.value = true
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FRIENDS.ADD), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ username: addUsername.value.trim() })
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      showFeedback(data.error || data.message || 'Impossible d\'ajouter cet utilisateur', 'error')
      return
    }
    addUsername.value = ''
    await fetchFriends()
    showFeedback(data.message || 'Ami ajouté', 'success')
  } catch (e:any) {
    showFeedback(e.message || 'Erreur réseau', 'error')
  } finally { adding.value = false }
}

async function removeFriend(f: Friend) {
  if (!confirm(`Supprimer ${f.username} ?`)) return
  removingFriendIds.value.add(f.id)
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FRIENDS.REMOVE(f.id)), { method: 'DELETE', headers: authHeaders() })
    const data = await res.json()
    if (!res.ok || !data.success) {
      showFeedback(data.error || data.message || 'Suppression impossible', 'error')
      return
    }
    friends.value = friends.value.filter(fr => fr.id !== f.id)
    await fetchStats()
    showFeedback(data.message || 'Ami supprimé', 'success')
  } catch (e:any) { showFeedback(e.message || 'Erreur réseau', 'error') }
  finally { removingFriendIds.value.delete(f.id) }
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
  if (searchQuery.value.trim().length < 2) { showFeedback('Min 2 caractères pour rechercher', 'error', 2500); return }
  searching.value = true
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FRIENDS.SEARCH(searchQuery.value.trim())), { headers: authHeaders() })
    const data = await res.json()
    if (!res.ok || !data.success) {
      showFeedback(data.error || data.message || 'Recherche impossible', 'error')
      return
    }
    searchResults.value = data.users
    if (!data.users.length) showFeedback('Aucun utilisateur trouvé', 'error', 2500)
  } catch (e:any) { showFeedback(e.message || 'Erreur réseau', 'error') }
  finally { searching.value = false }
}

async function addFriendFromSearch(u: FriendSearchResult) {
  if (u.isFriend) { showFeedback('Déjà dans vos amis', 'error', 2500); return }
  addingFriendIds.value.add(u.id)
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FRIENDS.ADD), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ username: u.username })
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      showFeedback(data.error || data.message || 'Ajout impossible', 'error')
      return
    }
    u.isFriend = true
    await fetchFriends()
    showFeedback(data.message || `${u.username} ajouté`, 'success')
  } catch (e:any) { showFeedback(e.message || 'Erreur réseau', 'error') }
  finally { addingFriendIds.value.delete(u.id) }
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
.fade-enter-active,.fade-leave-active{transition:opacity .25s}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>