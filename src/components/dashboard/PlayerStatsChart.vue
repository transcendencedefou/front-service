<template>
  <div class="flex flex-col md:flex-row min-h-screen">
    <!-- sidebar desktop only -->
    <aside class="hidden md:flex w-64 bg-black text-white p-4 flex-col gap-6 justify-center">
      <nav class="flex flex-col gap-4 mt-4">
        <DashboardSidebar :selected="chartType" @select="chartType = $event" />
      </nav>
    </aside>

    <!-- contenu principal -->
    <div class="flex-1 flex flex-col">
      <!-- bannière avec avatar centre -->
      <section class="relative h-40 md:h-52">
        <!-- Banniere -->
        <img
          src="/src/assets/img/test_banner.jpg"
          alt="Bannière"
          class="w-full h-full object-cover"
        />

        <!-- avatar + Username -->
        <div
          class="absolute inset-0 flex flex-col items-center justify-center
              md:inset-auto md:left-6 md:bottom-[-4rem] md:items-start md:justify-end"
        >
          <!-- Avatar -->
          <div class="flex flex-col justify-center items-center">
          <div
            class="w-24 h-24 md:w-40 md:h-40 bg-white rounded-full border-4 border-white overflow-hidden shadow-md"
          >
            <img
              src="/src/assets/img/test_avatar.jpg"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- username -->
          <p
            class="mt-2 text-white md:text-black text-base md:text-xl font-semibold drop-shadow text-center md:drop-shadow-none md:text-left"
          >
            {{ auth.user?.username }}
          </p>
        </div>
        </div>
      </section>
      
      <!-- Navigation mobile -->
      <nav class="flex justify-around py-3 md:hidden border-t border-b border-gray-200 bg-white">
        <button
          class="flex flex-col items-center text-xs"
          :class="{
            'text-clpurple font-semibold': chartType === null,
            'text-gray-500': chartType !== null
          }"
          @click="chartType = null"
        >
          <Notebook class="w-5 h-5 mb-1" />
          Stats
        </button>

        <button
          class="flex flex-col items-center text-xs"
          :class="{
            'text-clpurple font-semibold': chartType === 'settings',
            'text-gray-500': chartType !== 'settings'
          }"
          @click="chartType = 'settings'"
        >
          <Settings class="w-5 h-5 mb-1" />
          Réglages
        </button>

        <button
          class="flex flex-col items-center text-xs"
          :class="{
            'text-clpurple font-semibold': chartType === 'friends',
            'text-gray-500': chartType !== 'friends'
          }"
          @click="chartType = 'friends'"
        >
          <Users class="w-5 h-5 mb-1" />
          Amis
        </button>
      </nav>

      <section class="flex-1 px-6 pt-20 md:pt-10">
        <div v-if="isLoading">Chargement des stats...</div>
        <div v-else-if="error" class="text-red-500 text-sm">{{ error }}</div>

        <!-- friends -->
        <FriendsView v-else-if="chartType === 'friends'" />

        <!-- settings -->
        <PlayerSettings v-else-if="chartType === 'settings'" />

        <!-- charts -->
        <div
          v-else-if="chartType"
          class="max-w-md mx-auto bg-gray-100 p-10 rounded-md"
        >
          <component
            :is="getChartComponent(chartType)"
            :matches="matches"
            :user-id="auth.user?.id"
          />
        </div>

        <!-- stats numeraires -->
        <div
          v-else
          class="grid grid-cols-2 gap-6 max-w-md mx-auto text-center bg-gray-100 p-10 rounded-md"
        >
          <div>
            <p class="text-3xl font-bold">{{ totalMatches }}</p>
            <p class="text-sm text-gray-500">{{ t('dashboard.match-played') }}</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ totalBallHits }}</p>
            <p class="text-sm text-gray-500">{{ t('dashboard.ball-hit') }}</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ totalWins }}</p>
            <p class="text-sm text-gray-500">{{ t('dashboard.wins') }}</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ totalLosses }}</p>
            <p class="text-sm text-gray-500">{{ t('dashboard.losses') }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-xl font-semibold text-clpurple">{{ winRate }}%</p>
            <p class="text-sm text-gray-500">{{ t('dashboard.winrate') }}</p>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script lang="ts" setup>
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

  const { t } = useI18n()
  const auth = useAuthStore()
  const matches = ref<any[]>([])
  const isLoading = ref(true)
  const error = ref('')
  const chartType = ref<ChartType | 'settings' | 'friends' | null>(null)
  // console.log(auth.user?.id) pour fake data
  onMounted(async () => {
    try {
      /*
      const res = await fetch(`https://localhost/users/profiles/${auth.user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) throw new Error('Erreur lors du chargement des matchs.')
      
      matches.value = await res.json()
      */
     matches.value = [
      {
        id:'match1',
        winnerId: '61e2a0ff-2d10-480d-ba0f-98fb1971f332',
        ballHit: 25,
        powerUp: 6,
      },
      {
        id:'match2',
        winnerId: '61e2a0ff-2d10-480d-ba0f-98fb1971f332',
        ballHit: 42,
        powerUp:1,
      },
      {
        id:'match3',
        winnerId: '2',
        ballHit: 34,
        powerUp: 2,
      },
      {
        id:'match4',
        winnerId: '2',
        ballHit: 34,
        powerUp: 2,
      },
      {
        id:'match5',
        winnerId: '2',
        ballHit: 78,
        powerUp: 2,
      },
      {
        id:'match6',
        winnerId: '61e2a0ff-2d10-480d-ba0f-98fb1971f332',
        ballHit: 34,
        powerUp: 2,
      },
     ]
    } catch (err: any) {
      error.value = err.message || 'Erreur inconnue'
    } finally {
      isLoading.value = false
    }
  })

  const totalMatches = computed(() => matches.value.length)

  const totalWins = computed(() =>
    matches.value.filter((m) => m.winnerId === auth.user?.id).length
  )

  const totalLosses = computed(() => totalMatches.value - totalWins.value)

  const totalBallHits = computed(() =>
    matches.value.reduce((acc, m) => acc + (m.ballHit || 0), 0)
  )

  const winRate = computed(() =>
    totalMatches.value > 0 ? Math.round((totalWins.value / totalMatches.value) * 100) : 0
  )

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
