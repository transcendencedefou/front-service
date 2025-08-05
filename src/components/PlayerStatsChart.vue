<template>
    <div>
      <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>
  
  <script lang="ts" setup>
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
  
  const chartData = {
    labels: ['Matchs', 'Victoires', 'Défaites', 'Points'],
    datasets: [
      {
        label: 'Statistiques du joueur',
        data: [42, 30, 12, 1000],
        backgroundColor: '#8b5cf6', // violet tailwind
      },
    ],
  }
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Performance Joueur',
        color: '#374151',
        font: {
          size: 18,
        },
      },
    },
  }
  </script>
  