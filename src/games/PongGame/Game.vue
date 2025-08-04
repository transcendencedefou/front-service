<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { PlayerManager } from "@/games/PongGame/src/PlayerManager.js";
import PongInstance from './src/PongInstance.js'
import Ball from "./src/Ball.js";
import {GameContext} from "@/games/PongGame/src/GameContext.js";

// Il faut que je vois si j'ai encore besoin des refs ici, je ne pense pas pour tout
const gameCanvas = ref(null)
const ball = ref(null)

// Pour l'adaptabilité à l'ecran--------------
function handleResize() {
  pongInstance.value?.engine.resize()
}
//---------------------------------------------


// Gestion des inputs -------------------------
const keysPressed = ref({
  z: false,
  s: false,
  arrowup: false,
  arrowdown: false,
  ' ': false, // espace
  r: false
})

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
// fin ---------------------------------------------------



// main loop-----------------------------------------------
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
//--------------------------------------------------------------



//--Start, Stop et Reset ----------------------------------------

function startGame() {
  if (!running.value) {
    running.value = true;
  }
}

function stopGame() {
}

function resetGame() {
}
//-----------------------------------------------------------



//Ca ca reste ici c'est pour le chargement et le dechargement de la page
//faire un init et un destructeur d'evenements pour la lisibilité
//Le systeme d'init au debut va bouger, pas oublier les cleans
onMounted(() => {
  GameContext._initGameContext(new PongInstance(), gameCanvas)
  PlayerManager.addPlayer('1', "Albert")
  resetGame()

  //handleAddEventListener
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('resize', handleResize)

  gameLoop()
})
onBeforeUnmount(() => {
  pongInstance.value?.dispose()
  cancelAnimationFrame(animationFrameId)

  //handleRemoveEventListener
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

<!--Pour tester les dicos pinia-->

<!--<template>-->
<!--  <div>-->
<!--    <div v-for="(name, index) in gameStore.player_name" :key="index">-->
<!--      {{ name }}-->
<!--    </div>-->
<!--    <button @click="add">Add player</button>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { useGameStore } from '@/stores/gameStore';-->

<!--const gameStore = useGameStore();-->

<!--function add() {-->
<!--  gameStore.addPlayer('Jonas');-->
<!--}-->
<!--</script>-->