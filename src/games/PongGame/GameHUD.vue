<script setup lang="ts">
import { onMounted } from 'vue'
import { HUDManager} from "@/games/PongGame/src/Ui/HUDManager.ts";
import PongHUD from "./src/Ui/PongHUD.ts";
import {GameContext} from "@/games/PongGame/src/GameContext.ts";

onMounted(() => {
  console.log("Scene existante ?", GameContext.scene)
  HUDManager.setHud(new PongHUD())

  // button.onPointerUpObservable.add(() => {
  //   GameContext.startGame()
  // })
  // GameContext.setHudTrue()
})

</script>

<template></template>