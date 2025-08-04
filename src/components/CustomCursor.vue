<template>
    <div
      ref="cursor"
      class="pointer-events-none fixed z-50 w-8 h-8 rounded-full blur-[1px] transition-colors duration-300"
      :class="themeClass"
    ></div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { gsap } from 'gsap'
  import { useTheme } from '@/composables/useTheme'
  
  const cursor = ref(null)
  
  const { theme } = useTheme()
  
  const themeClass = computed(() =>
    theme.value === 'dark'
      ? 'bg-clpurple/30 border border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.6)]'
      : 'bg-black/30 border border-black/40 shadow-[0_0_12px_rgba(0,0,0,0.4)]'
  )
  
  onMounted(() => {
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const mouse = { x: pos.x, y: pos.y }
  
    const updateMouse = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
  
    window.addEventListener('mousemove', updateMouse)
  
    gsap.ticker.add(() => {
      pos.x += (mouse.x - pos.x) * 0.15
      pos.y += (mouse.y - pos.y) * 0.15
  
      if (cursor.value) {
        gsap.set(cursor.value, {
          x: pos.x - 24,
          y: pos.y - 24,
        })
      }
    })
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', () => {})
    gsap.ticker.remove()
  })
  </script>
  
  <style scoped>
  div {
    mix-blend-mode: normal;
  }
  </style>
  