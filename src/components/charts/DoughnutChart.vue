<!-- DonutWinsLosses.vue -->
<template>
  <div class="flex flex-col items-center space-y-4">
    <h2 class="text-lg font-semibold text-center text-clpurple">
      Victoires vs Défaites
    </h2>

    <div class="relative w-full h-64">
      <Doughnut
        :data="chartData"
        :options="chartOptions"
        class="absolute inset-0 w-full h-full"
      />

      <!-- Data au centre du donut -->
      <div class="absolute inset-0 grid place-items-center pointer-events-none">
        <div class="text-center leading-tight">
          <div class="text-xs opacity-70">Win rate</div>
          <div class="text-2xl font-bold">{{ winRate }}%</div>
          <div class="mt-1 text-xs">
            W {{ totalWins }} · L {{ totalLosses }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartOptions
} from 'chart.js'
import { useMatchStats, type Match } from '@/composables/useMatchStats'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps<{ matches: Match[]; userId: string }>()

// Stats réactives depuis le composable
const { totalWins, totalLosses, winRate } =
  useMatchStats(toRef(props, 'matches'), toRef(props, 'userId'))

// Données du donut (réactives)
const chartData = computed(() => ({
  labels: ['Victoires', 'Défaites'],
  datasets: [
    {
      data: [totalWins.value, totalLosses.value],
      // Tu peux remplacer par des variables CSS si tu veux respecter ton thème :
      // backgroundColor: ['var(--accent-1)', 'var(--fg-muted)'],
      backgroundColor: ['#7c3aed', '#e5e7eb'],
      borderWidth: 0
    }
  ]
}))

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: { position: 'bottom' },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.label}: ${ctx.parsed}`
      }
    }
  }
}
</script>
