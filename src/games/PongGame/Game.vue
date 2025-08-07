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
  PlayerManager.addPlayer('Richard');

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
</style>
