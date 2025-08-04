<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { GameContext } from "@/games/PongGame/src/GameContext.js";
import { PlayerManager } from "@/games/PongGame/src/PlayerManager.js";
import PongInstance from './src/PongInstance.js'

const canvas = ref(null)

function handleResize() {
  GameContext.engine.resize()
}

//faire un init et un destructeur d'evenements pour la lisibilité
//pas oublier les cleans
onMounted(() => {
  GameContext._initGameContext(new PongInstance(), canvas.value)
  GameContext._render()
  PlayerManager.addPlayer('1', "Albert")

  //fonction handleAddEventListener
  window.addEventListener('keydown', GameContext.handleKeyDown)
  window.addEventListener('keyup', GameContext.handleKeyUp)
  window.addEventListener('resize', handleResize)

  if (GameContext.running) {}
    GameContext.game.gameLoop() //mettre la game loop dans l instance du jeu
})
onBeforeUnmount(() => {

  //fonction handleRemoveEventListener
  window.removeEventListener('keydown', GameContext.handleKeyDown)
  window.removeEventListener('keyup', GameContext.handleKeyUp)
  window.removeEventListener('resize', handleResize)

  GameContext.dispose()
})
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
  background-color: rgba(0, 0, 0, 0.7); /* fond semi-transparent */
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
