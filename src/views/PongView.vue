<script setup lang="ts">
import Game from '../games/PongGame/Game.vue';
import GameHud  from '../games/PongGame/GameHUD.vue';

window.addEventListener(
  'keydown',
  (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
    }
  },
  { passive: false }
);
</script>

<template>
  <Game />
  <GameHud />
  <div class="home-button">
<!--    <router-link to="/" class="back-link">-->
<!--      Back to Home-->
<!--    </router-link>-->
  </div>
</template>

<style scoped>
.home-button {
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
