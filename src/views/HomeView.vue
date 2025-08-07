<template>
  <div class="relative overflow-hidden w-full h-screen">
    <SynthGridBackground>
      <section ref="stage"
               class="relative h-[calc(100vh-4rem)] w-full flex items-center justify-center">
        <!-- balle / soleil -->
        <div ref="ball"
             aria-hidden="true"
             class="motion-ok absolute top-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full"
             :style="{
               background:
                 'radial-gradient(circle at 35% 35%, #fff 0%, rgba(255,255,255,.85) 20%, var(--accent-3) 45%, var(--accent-1) 85%)',
               boxShadow: '0 0 30px rgba(255,107,107,.7), 0 0 60px rgba(122,0,255,.5)',
               filter: 'saturate(1.1)'
             }" />

        <!-- texte -->
        <div class="relative z-10 text-center px-4">
          <h1 ref="title"
              class="text-5xl md:text-7xl font-black tracking-tight text-fg">
            {{ t('home.title') }}
          </h1>
          <router-link
            to="/pong"
            class="mt-6 inline-block text-lg font-semibold text-accent-1 hover:underline focus:outline-none focus:ring-2 focus:ring-accent-2 rounded"
          >
            {{ t('home.cta') }}
          </router-link>
        </div>
      </section>
    </SynthGridBackground>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { useI18n } from 'vue-i18n'
import SynthGridBackground from '@/components/SynthGridBackground.vue'

gsap.registerPlugin(TextPlugin)
const { t } = useI18n()

const stage = ref<HTMLElement | null>(null)
const title = ref<HTMLElement | null>(null)
const ball = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null
let ro: ResizeObserver | null = null

onMounted(() => {
  
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (title.value) {
    if (!reduced) {
      const messages = ['PING.', 'PONG.', 'WIN.', 'LOSE.']
      let i = 0
      const loop = () => {
        if (!title.value) return
        const tl = gsap.timeline({
          onComplete: () => setTimeout(() => (i = (i + 1) % messages.length, loop()), 900),
        })
        tl.to(title.value, { duration: .4, text: '', ease: 'none' })
          .to(title.value, { duration: 1.2, text: messages[i], ease: 'none' })
      }
      loop()
    }
  }

  if (ball.value && stage.value) {
    const animate = () => {
      const w = stage.value!.clientWidth
      const margin = 24
      const left = -w / 2 + margin
      const right = w / 2 - margin

      gsap.killTweensOf(ball.value)
      gsap.set(ball.value, { xPercent: -50, yPercent: -50, x: left })

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.to(ball.value, {
          x: right,
          duration: 2.4,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
        })
      }
    }
    animate()
    ro = new ResizeObserver(animate)
    ro.observe(stage.value)
  }
})

onBeforeUnmount(() => {
  ctx?.revert?.()
  ro?.disconnect?.()
  if (ball.value) gsap.killTweensOf(ball.value)
})
</script>
