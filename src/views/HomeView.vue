<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 ref="textRef" class="text-9xl font-bold mb-6">PONG.</h1>
      <router-link to="/pong" class="text-blue-500 underline hover:text-blue-700">
        Aller jouer au Pong
      </router-link>
    </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { gsap } from 'gsap'
  import { TextPlugin } from 'gsap/TextPlugin'
  gsap.registerPlugin(TextPlugin)

  const textRef = ref(null)

  onMounted(() =>{
    const messages = [
      "PING.",
      "PONG.",
      "WIN.",
      "LOSE.",
    ]

    let i = 0

    const animateText = () => {
    const tl = gsap.timeline({
      repeat: 0,
      onComplete: () => {
        setTimeout(() => {
          i = (i + 1) % messages.length
          animateText()
        }, 1000)
      }
    })

    // erase text
    tl.to(textRef.value, {
      duration: 0.5,
      text: "",
      ease: "none",
    })

    // writer again
    tl.to(textRef.value, {
      duration: 1.5,
      text: messages[i],
      ease: "none",
    })
  }

  animateText()
})
</script>

<style scoped>

</style>