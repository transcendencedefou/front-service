<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 ref="textRef" class="text-9xl font-bold mb-6 text-gray-700 dark:text-red-500">PONG.</h1>
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
.pong-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 50;
}

.back-link {
  display: inline-block;
  padding: 10px 16px;
  background-color: #111;
  color: #f1f1f1;
  border-radius: 6px;
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.back-link:hover {
  background-color: #333;
  transform: scale(1.05);
}
</style>