<template>
  <div class="flex flex-col items-start space-y-2">
    <!-- Bouton Statistiques globales -->
    <button
      @click="$emit('select', null)"
      class="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-clpurple/10 text-gray-700 dark:text-white"
      :class="{ 'bg-clpurple text-white': selected === null }"
    >
      <Notebook class="w-5 h-5" />
      <span class="text-sm">{{ t('dashboard.nav.global') }}</span>
    </button>

    <!-- Boutons des types de graphiques -->
    <button
      v-for="type in chartTypes"
      :key="type"
      @click="$emit('select', type)"
      class="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-clpurple/10 text-gray-700 dark:text-white transition"
      :class="{ 'bg-clpurple text-white': selected === type }"
    >
      <component :is="icons[type]" class="w-5 h-5" />
      <span class="text-sm">{{ t('dashboard.nav.' + type) }}</span>
    </button>

    <!-- Boutons fixes (Réglages, Amis) -->
    <button
      v-for="type in staticTabs"
      :key="type"
      @click="$emit('select', type)"
      class="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-clpurple/10 text-gray-700 dark:text-white"
      :class="{ 'bg-clpurple text-white': selected === type }"
    >
      <component :is="icons[type]" class="w-5 h-5" />
      <span class="text-sm">{{ t('dashboard.nav.' + type) }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import {
  BarChart,
  PieChart,
  LineChart,
  Notebook,
  Settings,
  Users,
} from 'lucide-vue-next'

import { type ChartType, chartTypes } from '@/types/chart'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type SidebarTab = ChartType | 'settings' | 'friends' | null

const { selected } = defineProps<{
  selected: SidebarTab
}>()

const emit = defineEmits<{
  (e: 'select', type: SidebarTab): void
}>()

const staticTabs: ('settings' | 'friends')[] = ['settings', 'friends']

const icons = {
  doughnut: PieChart,
  bar: BarChart,
  line: LineChart,
  settings: Settings,
  friends: Users,
  global: Notebook,
}
</script>
