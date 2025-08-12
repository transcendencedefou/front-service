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
      <!-- bannière -->
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

        <!-- tuiles chiffrées -->
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
      </section>
    </div>
  </div>
</template>

<!-- <script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import DashboardSidebar from '@components/dashboard/DashboardSidebar.vue'
  import { type ChartType } from '@/types/chart'
  import BarChart from '@/components/charts/BarChart.vue'
  import DoughnutChart from '@/components/charts/DoughnutChart.vue'
  import LineChart from '@/components/charts/LineChart.vue'
  import FriendsView from './FriendsView.vue'
  import PlayerSettings from './PlayerSettings.vue'
  import { Notebook, Settings, Users } from 'lucide-vue-next'
  import { useI18n } from 'vue-i18n'
  import { useImageUpload } from '@/composables/useImageUpload'

  const { t } = useI18n()
  const auth = useAuthStore()
  const isLoading = ref(true)
  const error = ref('')
  const chartType = ref<ChartType | 'settings' | 'friends' | null>(null)
  
  const avatar = useImageUpload('avatar')
  const banner = useImageUpload('banner')
  const fallbackAvatar = "/src/assets/img/test_avatar.jpg"
  const fallbackBanner = "/src/assets/img/test_banner.jpg"
  const currentAvatar = ref<string | null>(null)
  const currentBanner = ref<string | null>(null)
  // console.log(auth.user?.id) pour fake data
  const matches = ref<Match[]>([])

  onMounted(async () =>{
    currentAvatar.value = await avatar.fetchCurrent()
    currentBanner.value = await banner.fetchCurrent()
  })

  onMounted(async () => {
    try {

      const res = await fetch(`https://localhost/games/matches/user/${auth.user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) throw new Error('Erreur lors du chargement des matchs.')
      
      matches.value = await res.json()
    } catch (err: any) {
      error.value = err.message || 'Erreur inconnue'
    } finally {
      isLoading.value = false
    }
  })

  const getChartComponent = (type: ChartType) => {
  switch (type) {
    case 'doughnut':
      return DoughnutChart
    case 'line':
      return LineChart
    default:
      return BarChart
  }
}
</script> -->

<script lang="ts" setup>
import { ref, onMounted, computed, toRef } from 'vue'          // + toRef
import { useAuthStore } from '@/stores/auth'
import DashboardSidebar from '@components/dashboard/DashboardSidebar.vue'
import { type ChartType } from '@/types/chart'
import BarChart from '@/components/charts/BarChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import FriendsView from './FriendsView.vue'
import PlayerSettings from './PlayerSettings.vue'
import { Notebook, Settings, Users } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useImageUpload } from '@/composables/useImageUpload'

// 👉 importe le type + le composable
import { useMatchStats, type Match } from '@/composables/useMatchStats'

const { t } = useI18n()
const auth = useAuthStore()
const isLoading = ref(true)
const error = ref('')
const chartType = ref<ChartType | 'settings' | 'friends' | null>(null)

const avatar = useImageUpload('avatar')
const banner = useImageUpload('banner')
const fallbackAvatar = "/src/assets/img/test_avatar.jpg"
const fallbackBanner = "/src/assets/img/test_banner.jpg"
const currentAvatar = ref<string | null>(null)
const currentBanner = ref<string | null>(null)

const matches = ref<Match[]>([])

const userId = computed(() => auth.user?.id ?? '')

onMounted(async () => {
  currentAvatar.value = await avatar.fetchCurrent()
  currentBanner.value = await banner.fetchCurrent()
})

onMounted(async () => {
  try {
    if (!userId.value) return 
    const res = await fetch(`https://localhost/games/matches/user/${userId.value}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Erreur lors du chargement des matchs.')
    matches.value = await res.json()
  } catch (err: any) {
    error.value = err.message || 'Erreur inconnue'
  } finally {
    isLoading.value = false
  }
})

const {
  totalMatches,
  totalWins,
  totalLosses,
  totalBallHits,
  winRate,
} = useMatchStats(toRef({ value: matches.value }, 'value') as any ?? toRef({value: matches.value}, 'value'), toRef({ value: userId.value }, 'value') as any ?? toRef({value: userId.value}, 'value'))

const getChartComponent = (type: ChartType) => {
  switch (type) {
    case 'doughnut':
      return DoughnutChart
    case 'line':
      return LineChart
    default:
      return BarChart
  }
}
</script>