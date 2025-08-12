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
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useRuntimeConfig } from '@/config/api';
import { useGameStore } from '@/stores/gameStore';
import { PlayerManager } from '@/games/Players/PlayerManager.ts';
import { useBallStore } from '@/stores/ballStore.ts';

const canvas = ref<HTMLCanvasElement | null>(null);
let scene: SceneService | null;
let controller: GameController;
let hud: GameSelectionHUD | null;
let disposeHudCheck: (() => void) | null = null;
let pongHud: PongHUD | null = null;
let ttthud: TTTHUD | null = null;

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const api = useRuntimeConfig();

let tournamentContext: any = null;
const gameStore = useGameStore();
// Garde pour éviter les appels multiples à la fin d'une partie
let submitting = false;

function authHeaders(hasBody = false) {
  const token = (authStore as any).token ? (typeof (authStore as any).token === 'string' ? (authStore as any).token : (authStore as any).token.value) : localStorage.getItem('token') || '';
  const h: Record<string,string> = { 'Authorization': `Bearer ${token}` };
  if (hasBody) h['Content-Type'] = 'application/json';
  return h;
}

async function reportAndReturn(winnerUsername: string) {
  if (!tournamentContext) return;
  try {
    const ballStore = useBallStore();
    const ballHit = ballStore.hits.slice();
    await fetch(`${api.GAME_URL}/match/${tournamentContext.matchId}/report`, {
      method: 'POST',
      headers: authHeaders(true),
      body: JSON.stringify({ winner: { username: winnerUsername }, scores: { winner: winnerUsername }, ballHit })
    });
    ballStore.clearHits();
  } catch {}
  // Nettoyage et retour
  localStorage.removeItem('currentTournamentMatch');
  router.push('/tournaments');
}

function normalizeGameType(): 'PONG' | 'TICTACTOE' {
  const t = (gameStore.game_type || '').toLowerCase();
  return t.includes('pong') ? 'PONG' : 'TICTACTOE';
}

function collectScores() {
  // Récupère des scores simples depuis PlayerManager si disponibles
  const players = PlayerManager.listPlayers();
  return {
    players: players.map(p => ({ name: p.store.name, score: p.store.score }))
  };
}

async function saveCasualResult(winnerUsername: string) {
  try {
    // Demander le pseudo invité (mémo dans localStorage)
    let guestUsername = localStorage.getItem('guestUsername') || '';
    if (!guestUsername) {
      guestUsername = window.prompt('Pseudo de l\'invité (adversaire non connecté) ?', 'Guest') || '';
      guestUsername = guestUsername.trim();
      if (guestUsername) localStorage.setItem('guestUsername', guestUsername);
    }
    if (!guestUsername) return; // annulation

    const gameType = normalizeGameType();
    // Déterminer la side gagnante en comparant au joueur index 0 (hôte humain)
    const hostPlayer = PlayerManager.getPlayer(0);
    const hostName = hostPlayer?.store.name || '';
    const winner = winnerUsername === hostName ? 'HOST' : 'GUEST';
    const scores = collectScores();
    const ballStore = useBallStore();
    const ballHit = ballStore.hits.slice();

    await fetch(`${api.GAME_URL}/match`, {
      method: 'POST',
      headers: authHeaders(true),
      body: JSON.stringify({ gameType, guestUsername, winner, scores, ballHit })
    });

    // Nettoyage du journal
    ballStore.clearHits();
  } catch {}
}

onMounted(async () => {
  scene = SceneService.getInstance(canvas.value!);
  controller = new GameController(scene);
  controller.registerGame('TicTacToe', () => new TicTacToeGame(), 'B', CAMERA_POSITIONS.tictactoe);
  controller.registerGame('Pong', () => new PongGame(), 'A', CAMERA_POSITIONS.pong);

  hud = new GameSelectionHUD(scene.scene, controller);

  // Détecter si on est dans un match de tournoi
  const stored = localStorage.getItem('currentTournamentMatch');
  if (stored && route.name === 'TournamentMatch') {
    try { tournamentContext = JSON.parse(stored); } catch {}
  }
  if (tournamentContext) {
    hud?.disableGameSelection();
    if (tournamentContext.gameType === 'PONG') {
      await controller.launchGame('Pong');
      if (!pongHud) pongHud = new PongHUD(scene!.scene, controller);
      pongHud.show();
    } else if (tournamentContext.gameType === 'TICTACTOE') {
      await controller.launchGame('TicTacToe');
      if (!ttthud) ttthud = new TTTHUD(scene!.scene);
      ttthud.show();
    }
  }

  disposeHudCheck = scene.onBeforeRender(() => {
    const active = controller.getActiveGame();
    const cameraStopped = !scene!.isCameraMoving();
    if (!tournamentContext) {
      if (active === null && cameraStopped) {
        hud!.show();
      } else { hud!.hide(); }
      if (active === 'Pong' && cameraStopped) { if (!pongHud) pongHud = new PongHUD(scene!.scene, controller); pongHud.show(); } else { pongHud?.hide(); }
      if (active === 'TicTacToe' && cameraStopped) { if (!ttthud) ttthud = new TTTHUD(scene!.scene); ttthud.show(); } else { ttthud?.hide(); }
    } else {
      // Mode tournoi: s'assurer que le HUD correspondant existe et est visible
      hud?.hide();
      if (active === 'Pong') { if (!pongHud) pongHud = new PongHUD(scene!.scene, controller); pongHud.show(); }
      if (active === 'TicTacToe') { if (!ttthud) ttthud = new TTTHUD(scene!.scene); ttthud.show(); }
    }
    if (tournamentContext && gameStore.winner && !submitting) {
      submitting = true;
      const w = gameStore.winner;
      reportAndReturn(w).finally(() => { submitting = false; });
    }
    if (!tournamentContext && gameStore.winner && !submitting) {
      // Partie casual: envoyer l'enregistrement une seule fois
      submitting = true;
      const w = gameStore.winner;
      saveCasualResult(w).finally(() => { gameStore.setWinner(''); submitting = false; });
    }
  });
});

onBeforeUnmount(() => {
  if (tournamentContext) localStorage.removeItem('currentTournamentMatch');
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
