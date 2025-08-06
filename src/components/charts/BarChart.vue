<template>
    <Bar :data="chartData" :options="chartOptions" />
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
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
  const props = defineProps<{ matches: any[]; userId: string }>()
  
  const chartData = {
    labels: props.matches.map((_, i) => `Match ${i + 1}`),
    datasets: [
      {
        label: 'PowerUps',
        data: props.matches.map((m) => m.powerUp || 0),
        backgroundColor: '#7c3aed',
      },
    ],
  }
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  }
  </script>