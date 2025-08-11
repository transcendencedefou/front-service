<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import SceneService from '@/games/services/SceneService';
import GameController from '@/games/services/GameController';
import PongGame from '@/games/pong/PongGame';
import TicTacToeGame from '@/games/ticTacToe/TicTacToeGame';
import { CAMERA_POSITIONS } from '@/games/services/cameraPositions';
import GameSelectionHUD from '@/games/Ui/GameSelectionHUD';
import PongHUD from '@/games/Ui/PongHUD';
import TTTHUD from '@/games/Ui/TTTHUD';

const canvas = ref<HTMLCanvasElement | null>(null);
let scene: SceneService | null;
let controller: GameController;
let hud: GameSelectionHUD | null;
let disposeHudCheck: (() => void) | null = null;
let pongHud: PongHUD | null = null;
let ttthud: TTTHUD | null = null;

function handleResize(): void {
  scene!.engine?.resize();
}

onMounted(() => {
  scene = SceneService.getInstance(canvas.value!);
  controller = new GameController(scene);
  controller.registerGame('TicTacToe', () => new TicTacToeGame(), 'B', CAMERA_POSITIONS.tictactoe);
  controller.registerGame('Pong', () => new PongGame(), 'A', CAMERA_POSITIONS.pong);

  hud = new GameSelectionHUD(scene.scene, controller);
  disposeHudCheck = scene.onBeforeRender(() => {
    const active = controller.getActiveGame();
    const cameraStopped = !scene!.isCameraMoving();
    if (active === null && cameraStopped) {
      hud!.show();
    } else {
      hud!.hide();
    }
    if (active === 'Pong' && cameraStopped) {
      if (!pongHud) pongHud = new PongHUD(scene!.scene, controller);
      pongHud.show();
    } else {
      pongHud?.hide();
    }
    if (active === 'TicTacToe' && cameraStopped) {
      if (!ttthud) ttthud = new TTTHUD(scene!.scene, controller);
      ttthud.show();
    } else {
      ttthud?.hide();
    }
  });

  window.addEventListener('resize', handleResize);
  handleResize();
});

onBeforeUnmount(() => {
  disposeHudCheck?.();
  hud?.dispose();
  pongHud?.dispose();
  controller.dispose();
});
</script>

<template>
  <canvas ref="canvas" class="game-canvas"></canvas>
</template>

<style scoped>
.game-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
