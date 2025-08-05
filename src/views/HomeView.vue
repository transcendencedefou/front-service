<template>
  <div class="relative overflow-hidden w-full h-screen bg-neutral-50 dark:bg-black flex items-center justify-center">
    <!-- Sphere simulee -->
    <section class="h-screen flex items-center justify-center">
    <div
      ref="sphereRef"
      class="absolute w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-white/20 to-dkpurple/20 shadow-2xl blur-md -translate-y-24 md:-translate-y-32"
    ></div>
    <!-- Gradient de sol fondu -->
    <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-dkpurple/40 to-transparent dark:from-dkpurple/90 pointer-events-none"></div>

    <!-- Texte au-dessus -->
    <div class="relative z-10 text-center">
      <h1 ref="textRef" class="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tight">{{ t('home.title') }}</h1>
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
})
</script>
