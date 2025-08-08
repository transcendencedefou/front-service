<template>
  <div class="relative isolate w-full min-h-screen bg-bg text-fg">
    <!-- Horizon -->
    <div aria-hidden="true"
         class="pointer-events-none absolute inset-0"
         :style="{ background: `linear-gradient(180deg, transparent 0%, var(--horizon) 50%, var(--bg) 100%)` }" />

    <!-- Wrapper 3D avec perspective -->
    <div aria-hidden="true"
         class="pointer-events-none absolute inset-0"
         :style="{
           perspective: 'var(--grid-persp)',
           perspectiveOrigin: '50% 50%'
         }">
      <!-- Plan de grille -->
      <div
        class="absolute bottom-0 w-[200vw] h-[200vh]"
        :style="{
          transform: `rotateX(70deg) translateX(-50vw)`,                 // 70° = plus visible que 80°
          transformOrigin: 'bottom center',            // pivot depuis le bas
          backgroundImage:
            `repeating-linear-gradient(0deg, var(--grid-color) 0 1px, transparent 1px var(--grid-size)),
            repeating-linear-gradient(90deg, var(--grid-color) 0 1px, transparent 1px var(--grid-size))`,
          backgroundSize: `var(--grid-size) var(--grid-size)`,
          backgroundPosition: 'center bottom',
          // masque plus doux (tu peux commenter pour tester)
          WebkitMaskImage: 'linear-gradient(to top, black 60%, rgba(0,0,0,.4) 65%, transparent 100%)',
          maskImage:       'linear-gradient(to top, black 60%, rgba(0,0,0,.4) 65%, transparent 100%)'
        }"
      />
    </div>

    <!-- Slot pour le contenu -->
    <slot />
  </div>
</template>

<script setup lang="ts">
// rien ici pour Tailwind; tout est global via main.css
</script>

<style scoped>
/* ici seulement des styles locaux au composant si besoin */
</style>
