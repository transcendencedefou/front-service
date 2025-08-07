<template>
  <div class="flex flex-col items-center space-y-4">
    <h2 class="text-lg font-semibold text-center text-clpurple">
      Rebonds de Balle par Match
    </h2>
    <div class="relative w-full h-64">
      <Line :data="chartData" :options="chartOptions" class="absolute top-0 left-0 w-full h-full" />
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { Line } from 'vue-chartjs'

  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
  } from 'chart.js'

  import { ChartOptions } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)
  
  const props = defineProps<{ matches: any[]; userId?: string }>()
  
  const chartData = {
    labels: props.matches.map((_, i) => `Match ${i + 1}`),
    datasets: [
      {
        label: 'Ball Hits',
        data: props.matches.map((m) => m.ballHit || 0),
        borderColor: '#7c3aed',
        backgroundColor: '#ede9fe',
        tension: 0.3,
      },
      {
        label: 'Wins',
        data: props.matches.map((m) => m.winnerId === props.userId ? 1 : 0),
        borderColor: 'green',
        tension: 1,
      }
    ],
  }
  
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }
  </script>
  