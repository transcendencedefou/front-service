<template>
  <div class="flex flex-col items-center space-y-4">
    <h2 class="text-lg font-semibold text-center text-clpurple">
      Victoires vs Défaites
    </h2>
    <div class="relative w-full h-64">
      <Doughnut :data="chartData" :options="chartOptions" class="absolute top-0 left-0 w-full h-full" />
    </div>
  </div>
</template>

  
  <script setup lang="ts">
  import { Doughnut } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js'
  import { ChartOptions } from 'chart.js'

  ChartJS.register(Title, Tooltip, Legend, ArcElement)
  
  const props = defineProps<{ matches: any[]; userId?: string }>()
  
  const totalWins = props.matches.filter((m) => m.winnerId === props.userId).length
  const totalLosses = props.matches.length - totalWins
  
  const chartData = {
    labels: ['Victoires', 'Défaites'],
    datasets: [
      {
        data: [totalWins, totalLosses],
        backgroundColor: ['#7c3aed', '#e5e7eb'],
      },
    ],
  }
  
  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }
  </script>