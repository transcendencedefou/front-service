<template>
    <Doughnut :data="chartData" :options="chartOptions" />
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
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement)
  
  const props = defineProps<{ matches: any[]; userId: string }>()
  
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
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }
  </script>