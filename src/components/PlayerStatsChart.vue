<template>
  <div class="flex flex-col md:flex-row min-h-screen">
    <!-- Sidebar desktop only -->
    <aside class="hidden md:flex w-64 bg-gray-900 text-white p-4 flex-col  gap-6">
      <h1 class="text-2xl font-bold">DASHBOARD</h1>
      <nav class="flex flex-col gap-4 mt-4">
        <ChartSelector :selected="chartType" @select="chartType = $event" />
      </nav>
    </aside>

    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col border border-red-500">
      <!-- Bannière -->
      <section class="relative h-40 md:h-52">
        <img
          src="/src/assets/img/test_banner.jpg"
          alt="Bannière"
          class="w-full h-full object-cover"
        />

        <!-- Photo de profil -->
        <div
          class="absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 md:translate-y-0 md:-bottom-20 md:left-6 md:transform-none"
        >
          <div class="w-24 h-24 md:w-40 md:h-40 bg-white rounded-full border-4 border-white overflow-hidden shadow-md border border-blue-500">
            <img
              src="/src/assets/img/test_avatar.jpg"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          </div>
          <p class="text-center mt-2 font-semibold">{{ auth.user?.username }}</p>
        </div>
      </section>

      <!-- Nav Dashboard mobile -->
      <nav class="flex justify-around py-4 md:hidden border-t border-b border-gray-300 bg-white border border-green-500">
        <button class="text-sm font-medium text-gray-700">Accueil</button>
        <button class="text-sm font-medium text-gray-700">Matchs</button>
        <button class="text-sm font-medium text-gray-700">Profil</button>
      </nav>

      <!-- Stats -->
      <section class="flex-1 px-6 pt-20 md:pt-28 border border-yellow-500">
        <h4 class="text-lg font-bold mb-6 text-center md:text-left">STATS</h4>
        <div v-if="isLoading">Chargement des stats...</div>
        <div v-else-if="error" class="text-red-500 text-sm">{{ error }}</div>
        <!-- vision numeraire-->
        <div
          v-if="!chartType"
          class="grid grid-cols-2 gap-6 max-w-md mx-auto text-center bg-gray-100 p-10 rounded-md"
        >
          <div>
            <p class="text-3xl font-bold">{{ totalMatches }}</p>
            <p class="text-sm text-gray-500">Matchs joués</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ totalBallHits }}</p>
            <p class="text-sm text-gray-500">Rebonds</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ totalWins }}</p>
            <p class="text-sm text-gray-500">Victoires</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ totalLosses }}</p>
            <p class="text-sm text-gray-500">Défaites</p>
          </div>
          <div class="col-span-2">
            <p class="text-xl font-semibold text-clpurple">{{ winRate }}%</p>
            <p class="text-sm text-gray-500">Winrate</p>
          </div>
        </div>
        <!-- vision charts -->
        <div v-else class="max-w-md mx-auto bg-gray-100 p-10 rounded-md">
          <component
            :is="getChartComponent(chartType)"
            :matches="matches"
            :user-id="auth.user?.id"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import ChartSelector from '@components/ChartSelector.vue'
  import { type ChartType } from '@/types/chart'
  import BarChart from '@/components/charts/BarChart.vue'
  import DoughnutChart from '@/components/charts/DoughnutChart.vue'
  import LineChart from '@/components/charts/LineChart.vue'

  const auth = useAuthStore()
  const matches = ref<any[]>([])
  const isLoading = ref(true)
  const error = ref('')
  const chartType = ref<ChartType | null>(null)
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
      }
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
