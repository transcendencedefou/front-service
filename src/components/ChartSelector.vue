<template>
  <div class="flex flex-col items-center space-y-2">
    <!-- Bouton de reset -->
    <button
      @click="$emit('select', null)"
      class="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-clpurple/10 text-gray-700 dark:text-white"
      :class="{ 'bg-clpurple text-white': selected === null }"
    >
      <span class="text-xl font-bold"><Notebook /></span>
      <span class="text-sm">Statistiques Globales</span>
    </button>

    <!-- Boutons de sélection -->
    <button
      v-for="type in localChartTypes"
      :key="type"
      @click="$emit('select', type)"
      class="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-clpurple/10 transition text-gray-700 dark:text-white"
      :class="{ 'bg-clpurple text-white': selected === type }"
    >
      <component :is="icons[type]" class="w-5 h-5" />
      <span class="text-sm">{{ labels[type] }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { FunctionalComponent } from 'vue'
import { BarChart, PieChart, LineChart, Notebook } from 'lucide-vue-next'
import { type ChartType, chartTypes } from '@/types/chart'

const localChartTypes = chartTypes

const props = defineProps<{
  selected: ChartType | null
}>()

const emit = defineEmits<{
  (e: 'select', type: ChartType | null): void
}>()

const icons: Record<ChartType, FunctionalComponent> = {
  doughnut: PieChart,
  bar: BarChart,
  line: LineChart,
}

const labels: Record<ChartType, string> = {
  doughnut: 'Victoires | Defaites',
  bar: 'PowerUps',
  line: 'Balles Touchees',
}
</script>
