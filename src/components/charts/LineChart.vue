<template>
    <Line :data="chartData" :options="chartOptions" />
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
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)
  
  const props = defineProps<{ matches: any[]; userId: string }>()
  
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
  