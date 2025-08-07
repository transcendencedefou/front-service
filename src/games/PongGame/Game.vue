<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { GameContext } from '@/games/PongGame/src/GameContext';
import { PlayerManager } from '@/games/PongGame/src/PlayerManager';
import PongInstance from './src/PongInstance';

const canvas = ref<HTMLCanvasElement | null>(null);

function handleResize(): void {
  GameContext.engine?.resize();
}

function handleAddEventListener(): void {
  window.addEventListener('keydown', GameContext.handleKeyDown.bind(GameContext));
  window.addEventListener('keyup', GameContext.handleKeyUp.bind(GameContext));
  window.addEventListener('keyup', GameContext.switchRunningState);
  window.addEventListener('keyup', GameContext.resetGame);
  window.addEventListener('resize', handleResize);
}

function handleRemoveEventListener(): void {
  window.removeEventListener('keydown', GameContext.handleKeyDown);
  window.removeEventListener('keyup', GameContext.handleKeyUp);
  window.removeEventListener('resize', handleResize);
}

onMounted(() => {
  // temp
  GameContext.setSize(9, 6);

  GameContext._initGameContext(new PongInstance(), canvas.value!);

  // Ca c est temporaire, juste au moins on a les methodes
  PlayerManager.addPlayer('Albert');
  PlayerManager.addPlayer('Albert0');

  GameContext._render();

  handleAddEventListener();
  GameContext.game!.gameLoop();
});
onBeforeUnmount(() => {
  handleRemoveEventListener();

  PlayerManager.clearMap();
  GameContext.dispose();
});
</script>

<template>
    <canvas ref="canvas" class="game-canvas"></canvas>
    <div class="infos">
      <p>Space to start/pause</p>
      <p>R to reset the game</p>
      <p>Player1: Z/S</p>
      <p>Player2: ArrowUp/ArrowDown</p>
    </div>
</template>

<style scoped>
.game-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #000;
}

.infos {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #f1f1f1;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  max-width: 200px;
}

.infos p {
  margin: 4px 0;
}
</style>
