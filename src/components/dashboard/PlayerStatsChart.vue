<template>
  <div class="dashboard">
    <!-- sidebar desktop -->
    <aside class="dashboard-aside">
      <nav class="flex flex-col gap-2 mt-4">
        <DashboardSidebar :selected="chartType" @select="chartType = $event" />
      </nav>
    </aside>

    <!-- main -->
    <div class="dashboard-main">
      <!-- banniere -->
      <section class="banner">
        <img 
          :src="currentBanner || fallbackBanner" 
          alt="Bannière" 
          class="banner-img" />

        <div class="avatar-wrap">
          <div class="flex flex-col items-center md:items-start">
            <div class="avatar avatar-ring overflow-hidden">
              <img 
                :src="currentAvatar || fallbackAvatar" 
                alt="Avatar" 
                class="w-full h-full object-cover" />
            </div>
            <p class="username">{{ auth.user?.username }}</p>
          </div>
        </div>
      </section>

      <!-- tabs mobile -->
      <nav class="dashboard-tabs">
        <button class="tab-btn" :class="{ 'tab-btn--active': chartType === null }" @click="chartType = null">
          <Notebook class="w-5 h-5 mb-1" /> Stats
        </button>
        <button class="tab-btn" :class="{ 'tab-btn--active': chartType === 'settings' }" @click="chartType = 'settings'">
          <Settings class="w-5 h-5 mb-1" /> {{ t('dashboard.nav.settings') }}
        </button>
        <button class="tab-btn" :class="{ 'tab-btn--active': chartType === 'friends' }" @click="chartType = 'friends'">
          <Users class="w-5 h-5 mb-1" /> {{ t('dashboard.nav.friends') }}
        </button>
      </nav>

      <section class="flex-1 px-6 pt-20 md:pt-10">
        <div v-if="isLoading">Chargement des stats...</div>
        <div v-else-if="error" class="msg-err">{{ error }}</div>

        <FriendsView v-else-if="chartType === 'friends'" />

        <PlayerSettings v-else-if="chartType === 'settings'" />

        <!-- un seul chart -->
        <div v-else-if="chartType" class="panel max-w-md mx-auto">
          <component :is="getChartComponent(chartType)" :matches="matches" :user-id="userId" />
        </div>

        <!-- tuiles chiffrees -->
        <div v-else class="panel stats-grid">
          <div>
            <p class="stat-value">{{ totalMatches }}</p>
            <p class="stat-label">{{ t('dashboard.match-played') }}</p>
          </div>
          <div>
            <p class="stat-value">{{ totalBallHits }}</p>
            <p class="stat-label">{{ t('dashboard.ball-hit') }}</p>
          </div>
          <div>
            <p class="stat-value">{{ totalWins }}</p>
            <p class="stat-label">{{ t('dashboard.wins') }}</p>
          </div>
          <div>
            <p class="stat-value">{{ totalLosses }}</p>
            <p class="stat-label">{{ t('dashboard.losses') }}</p>
          </div>
          <div class="winrate">{{ winRate }}%</div>
          <p class="stat-label col-span-2 text-center">{{ t('dashboard.winrate') }}</p>
        </div>

        <!-- Matchs récents -->
        <div v-if="!chartType" class="panel mt-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold">Matchs récents</h3>
            <span class="text-xs text-gray-400">{{ recentMatches.length }} derniers</span>
          </div>
          <ul class="divide-y divide-gray-700/40">
            <li v-for="m in recentMatches" :key="m.id" class="py-3 flex items-center gap-3">
              <span class="text-[10px] px-2 py-1 rounded-full"
                    :class="m.gameType === 'PONG' ? 'bg-indigo-600/30 text-indigo-200' : 'bg-emerald-600/30 text-emerald-200'">
                {{ m.gameType || 'N/A' }}
              </span>
              <div class="flex-1 min-w-0">
                <p class="truncate">
                  <span class="font-medium">{{ displayNames(m)[0] }}</span>
                  <span class="mx-2 text-gray-400">vs</span>
                  <span class="font-medium">{{ displayNames(m)[1] }}</span>
                </p>
                <p class="text-xs text-gray-400">{{ formatDate(m.createdAt) }}</p>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-sm font-semibold">{{ m.scores.player1 }} - {{ m.scores.player2 }}</span>
                <span class="text-[11px] px-2 py-0.5 rounded"
                      :class="m.winnerId === userId ? 'bg-green-600/30 text-green-200' : 'bg-red-600/30 text-red-200'">
                  {{ m.winnerId === userId ? 'Victoire' : 'Défaite' }}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import DashboardSidebar from '@components/dashboard/DashboardSidebar.vue'
import { type ChartType } from '@/types/chart'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import FriendsView from './FriendsView.vue'
import PlayerSettings from './PlayerSettings.vue'
import { Notebook, Settings, Users } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useImageUpload } from '@/composables/useImageUpload'
import { useMatchStats, type Match } from '@/composables/useMatchStats'
import { normalizeMatches } from '@/composables/normalizeMatches'

const { t } = useI18n()
const auth = useAuthStore()

const isLoading = ref(true)
const error = ref('')
const chartType = ref<ChartType | 'settings' | 'friends' | null>(null)

const avatar = useImageUpload('avatar')
const banner = useImageUpload('banner')
const fallbackAvatar = '/src/assets/img/test_avatar.jpg'
const fallbackBanner = '/src/assets/img/test_banner.jpg'
const currentAvatar = ref<string | null>(null)
const currentBanner = ref<string | null>(null)

const matches = ref<Match[]>([])

const userId = computed(() => auth.user?.id ?? '')

onMounted(async () => {
  currentAvatar.value = await avatar.fetchCurrent()
  currentBanner.value = await banner.fetchCurrent()
})

async function fetchMatches(id: string) {
  try {
    isLoading.value = true
    const res = await fetch(`https://localhost/games/matches/user/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Erreur lors du chargement des matchs.')
    const raw = await res.json()
    matches.value = normalizeMatches(raw)
  } catch (err: any) {
    error.value = err.message || 'Erreur inconnue'
  } finally {
    isLoading.value = false
  }
}

watch(
  userId,
  (id) => {
    if (id) fetchMatches(id)
  },
  { immediate: true }
)

const { totalMatches, totalWins, totalLosses, totalBallHits, winRate } =
  useMatchStats(matches, userId)

const recentMatches = computed(() => matches.value.slice(0, 10))

const getChartComponent = (type: ChartType) => {
  switch (type) {
    case 'doughnut':
      return DoughnutChart
    case 'line':
      return LineChart
    default:
      return LineChart
  }
}

function formatDate(d: string) {
  try { return new Date(d).toLocaleString() } catch { return d }
}

function displayNames(m: Match): [string, string] {
  // Utiliser les noms s’ils sont disponibles (participantsNames), sinon masquer les IDs
  const names = (m as any).participantsNames as [string, string] | undefined
  if (names && (names[0] || names[1])) return [names[0] || 'Joueur 1', names[1] || 'Joueur 2']
  return ['Joueur 1', 'Joueur 2']
}
</script>

<style scoped>
/* vous pouvez ajuster le style si nécessaire */
</style>