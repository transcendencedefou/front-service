<template>
  <!-- Curseur principal -->
  <div
    ref="cursor"
    class="pointer-events-none fixed z-50 w-8 h-8 rounded-full blur-[1px] transition-colors duration-300"
    :class="themeClass"
    :style="themeStyle"
  ></div>

  <!-- Onde autour -->
  <div
    ref="ripple"
    class="pointer-events-none fixed z-50 w-8 h-8 rounded-full border"
    :class="themeClass"
    :style="themeStyle"
  ></div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { useTheme } from '@/composables/useTheme'

const cursor = ref(null)
const ripple = ref(null)

const { scheme: theme } = useTheme()

const themeClass = computed(() =>
  theme.value === 'dark'
    ? 'border border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.6)]'
    : 'border border-black/40 shadow-[0_0_12px_rgba(0,0,0,0.4)]'
)

const themeStyle = computed(() => ({
  backgroundColor:
    theme.value === 'dark'
      ? 'rgba(var(--accent-1-rgb), 0.3)'
      : 'rgba(var(--accent-3-rgb), 0.3)'
}))

const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
const mouse = { x: pos.x, y: pos.y }

const updateMouse = (e: MouseEvent) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

const handleMouseOver = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.closest('a, button')) {
    // pulse sur hover
    if (cursor.value) {
      gsap.to(cursor.value, {
        scale: 1.3,
        duration: 0.4,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      })
    }

    // onde circulaire
    if (ripple.value) {
      gsap.fromTo(
        ripple.value,
        {
          scale: 1,
          opacity: 0.6,
          rotation: 0,
        },
        {
          scale: 2.5,
          rotation: 360,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        }
      )
    }
  }
}

const handleMouseOut = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.closest('a, button')) {
    if (cursor.value) {
      gsap.killTweensOf(cursor.value)
      gsap.to(cursor.value, {
        scale: 1,
        duration: 0.2,
        ease: 'power1.out',
      })
    }
  }
}

onMounted(() => {
  window.addEventListener('mousemove', updateMouse)
  document.body.addEventListener('mouseover', handleMouseOver)
  document.body.addEventListener('mouseout', handleMouseOut)

  gsap.ticker.add(() => {
    pos.x += (mouse.x - pos.x) * 0.15
    pos.y += (mouse.y - pos.y) * 0.15

    if (cursor.value) {
      gsap.set(cursor.value, {
        x: pos.x - 16,
        y: pos.y - 16,
      })
    }

    if (ripple.value) {
      gsap.set(ripple.value, {
        x: pos.x - 16,
        y: pos.y - 16,
      })
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', updateMouse)
  document.body.removeEventListener('mouseover', handleMouseOver)
  document.body.removeEventListener('mouseout', handleMouseOut)
  gsap.ticker.remove()
})
</script>

<style scoped>
div {
  mix-blend-mode: normal;
}
</style>
