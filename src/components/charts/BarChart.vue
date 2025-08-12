<template>
  <div class="flex flex-col items-center space-y-4">
    <h2 class="text-lg font-semibold text-center text-clpurple">
      Ball Hits par Match
    </h2>
    <div class="relative w-full h-64">
      <Bar :data="chartData" :options="chartOptions" class="absolute top-0 left-0 w-full h-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { ChartOptions } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{ matches: any[]; userId?: string }>()

const chartData = {
  labels: props.matches.map((_, i) => `Match ${i + 1}`),
  datasets: [
    {
      label: 'Ball Hits',
      data: props.matches.map((m) => m.ballHit || 0),
      backgroundColor: '#7c3aed',
    },
  ],
}

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
}
</script>