<template>
  <div class="relative overflow-hidden w-full h-screen bg-neutral-50 dark:bg-black flex items-center justify-center pt-16">
    <!-- Sphere animée -->
    <section class="h-screen flex items-center justify-center w-full">
      <div
        ref="sphereRef"
        class="absolute top-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-white/20 to-dkpurple/20 shadow-2xl backdrop-blur-sm"
      ></div>

      <!-- Gradient sol -->
      <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-dkpurple/40 to-transparent dark:from-dkpurple/90 pointer-events-none"></div>

      <!-- Texte -->
      <div class="relative z-10 text-center">
        <h1 ref="textRef" class="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tight">
          {{ t('home.title') }}
        </h1>
        <router-link
          to="/pong"
          class="mt-6 inline-block text-lg font-semibold text-purple-600 dark:text-purple-400 hover:underline"
        >
          {{ t('home.cta') }}
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
gsap.registerPlugin(TextPlugin)

const textRef = ref(null)
const sphereRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // Animation texte (cyclique)
  const messages = ['PING.', 'PONG.', 'WIN.', 'LOSE.']
  let i = 0

  const animateText = () => {
    if (!textRef.value) return
    const tl = gsap.timeline({
      repeat: 0,
      onComplete: () => {
        setTimeout(() => {
          i = (i + 1) % messages.length
          animateText()
        }, 1000)
      }
    })

    tl.to(textRef.value, { duration: 0.5, text: '', ease: 'none' })
    tl.to(textRef.value, { duration: 1.5, text: messages[i], ease: 'none' })
  }

  animateText()

  // animate ball as pong game
  if (sphereRef.value) {
    gsap.from(sphereRef.value, {
      x:'-50vw',
      y: '20vh',
      duration: 3,
      ease: 'power1.inOut',
      yoyo: true,
    })
    gsap.to(sphereRef.value, {
      x: '50vw',       
      y: '-20vh',
      duration: 3,     
      ease: 'power1.inOut',
      repeat: -1,      
      yoyo: true,      
    })
  }
})
</script>
