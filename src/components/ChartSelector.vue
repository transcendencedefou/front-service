<template>
    <div class="flex flex-col items-center space-y-4">
      <button
        @click="$emit('select', null)"
        class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-clpurple/20 text-gray-700"
        :class="{ 'text-white': selected === null }"
      >
        <span class="text-xl font-bold">×</span>
    </button>
      <button
        v-for="type in localChartTypes"
        :key="type"
        @click="$emit('select', type)"
        class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-clpurple/20 transition"
        :class="{ 'bg-clpurple text-white': selected === type }"
      >
        <component :is="icons[type]" class="w-5 h-5" />
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  import { FunctionalComponent } from 'vue'
  import { BarChart, PieChart, LineChart } from 'lucide-vue-next'
  import { type ChartType, chartTypes } from '@/types/chart'

  const localChartTypes = chartTypes

  const props = defineProps<{
    selected: ChartType | null
  }>()
  const { selected } = props

  const emit = defineEmits<{
    (e: 'select', type: ChartType | null): void
  }>()

  const icons: Record<ChartType, FunctionalComponent> = {
    doughnut: PieChart,
    bar: BarChart,
    line: LineChart,
  }
  </script>
  