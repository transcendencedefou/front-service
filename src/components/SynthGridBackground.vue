<template>
    <div class="relative isolate w-full h-full bg-bg text-fg">
      <!-- hrizon -->
      <div aria-hidden="true"
           class="pointer-events-none absolute inset-0"
           :style="{
             background: `linear-gradient(180deg, transparent 0%, var(--horizon) 50%, var(--bg) 100%)`
           }" />
      <!-- neon grid au sol -->
      <div aria-hidden="true"
           class="absolute -bottom-40 left-1/2 w-[200vw] h-[120vh] -translate-x-1/2"
           :style="{
             backgroundImage:
               `linear-gradient(transparent 95%, var(--grid-color) 96%),
                linear-gradient(90deg, transparent 95%, var(--grid-color) 96%)`,
             backgroundSize: 'var(--grid-size, 48px) var(--grid-size, 48px)',
             transform: 'perspective(600px) rotateX(70deg)',
             filter: 'blur(.5px)',
           }" />
      <slot />
    </div>
  </template>
  