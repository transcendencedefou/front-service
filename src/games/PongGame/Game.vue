<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import PongEngine from './src/PongEngine.js'
import Player from './src/Player.js'
import Ball from "./src/Ball.js";

const gameCanvas = ref(null)
const pongInstance = ref(null)
const Player1 = ref(null)
const Player2 = ref(null)
const ball = ref(null)
const running = ref(false)

const keysPressed = ref({
  z: false,
  s: false,
  arrowup: false,
  arrowdown: false,
  ' ': false, // espace
  r: false
})

function handleResize() {
  pongInstance.value?.engine.resize()
}

function handleKeyDown(event) {
  const key = event.key.toLowerCase()
  if (key === ' ') {
    event.preventDefault()
    if (!keysPressed.value[' ']) {
      running.value ? stopGame() : startGame()
    }
  }
  if (key === 'r') resetGame()
  if (key in keysPressed.value) {
    keysPressed.value[key] = true
  }
}

function handleKeyUp(event) {
  const key = event.key.toLowerCase()
  if (key in keysPressed.value) {
    keysPressed.value[key] = false
  }
}

let animationFrameId;


function gameLoop() {
  if (Player1.value?.player_score >= 3 || Player2.value?.player_score >= 3) {
    resetGame();
  }
  if (running.value) {
    if (keysPressed.value.z) Player1.value.moveUp()
    if (keysPressed.value.s) Player1.value.moveDown()
    if (keysPressed.value.arrowup) Player2.value.moveUp()
    if (keysPressed.value.arrowdown) Player2.value.moveDown()
    ball.value?.move()
  }

  animationFrameId = requestAnimationFrame(() => gameLoop());
}

function startGame() {
  if (!running.value) {
    running.value = true;
  }
}

function stopGame() {
  running.value = false;
}

function resetGame() {
  stopGame();
  Player1.value.resetPosition();
  Player2.value.resetPosition();
  Player1.value.player_score = 0;
  Player2.value.player_score = 0;
  ball.value.reset();
}

onMounted(() => {
  pongInstance.value = new PongEngine(gameCanvas.value)
  Player1.value = new Player('left', pongInstance.value.scene)
  Player2.value = new Player('right', pongInstance.value.scene)
  ball.value = new Ball(pongInstance.value, Player1.value, Player2.value)

  resetGame()

  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('resize', handleResize)

  gameLoop()
})
onBeforeUnmount(() => {
  pongInstance.value?.dispose()
  cancelAnimationFrame(animationFrameId)

  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
    <canvas ref="gameCanvas" class="game-canvas"></canvas>
    <div class="infos">
      <p>Player1 score : {{ Player1?.player_score }}</p>
      <p>Player2 score : {{ Player2?.player_score }}</p>
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