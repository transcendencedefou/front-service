<template>
  <div class="flex flex-col items-start space-y-2">
    <button
      @click="$emit('select', null)"
      class="side-btn"
      :class="{ 'side-btn--active': selected === null }"
    >
      <Notebook class="w-5 h-5" />
      <span class="text-sm">{{ t('dashboard.nav.global') }}</span>
    </button>

    <button
      v-for="type in chartTypes"
      :key="type"
      @click="$emit('select', type)"
      class="side-btn"
      :class="{ 'side-btn--active': selected === type }"
    >
      <component :is="icons[type]" class="w-5 h-5" />
      <span class="text-sm">{{ t('dashboard.nav.' + type) }}</span>
    </button>

    <button
      v-for="type in staticTabs"
      :key="type"
      @click="$emit('select', type)"
      class="side-btn"
      :class="{ 'side-btn--active': selected === type }"
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
