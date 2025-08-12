<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import SceneService from '@/games/services/SceneService';
import GameController from '@/games/services/GameController';
import PongGame from '@/games/pong/PongGame';
import TicTacToeGame from '@/games/ticTacToe/TicTacToeGame';
import { CAMERA_POSITIONS } from '@/games/services/cameraPositions';
import PongHUD from '@/games/Ui/PongHUD';
import TTTHUD from '@/games/Ui/TTTHUD';
import { PlayerManager } from '@/games/Players/PlayerManager';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useRuntimeConfig } from '@/config/api';
import { useGameStore } from '@/stores/gameStore';
import { useBallStore } from '@/stores/ballStore';
import { useGameSessionStore } from '@/stores/gameSession';
import { aiControlStore } from '@/stores/aiControl';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const canvas = ref<HTMLCanvasElement | null>(null);
let scene: SceneService | null;
let controller: GameController;
let disposeHudCheck: (() => void) | null = null;
let pongHud: PongHUD | null = null;
let ttthud: TTTHUD | null = null;

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const api = useRuntimeConfig();
const gameStore = useGameStore();
const gameSessionStore = useGameSessionStore();

let tournamentContext: any = null;
// Garde pour éviter les appels multiples à la fin d'une partie
let submitting = false;
let readyToSubmit = false;
let currentGameType: 'PONG' | 'TICTACTOE' | null = null;


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
    const scores = collectScores();
    await fetch(`${api.GAME_URL}/match/${tournamentContext.matchId}/report`, {
      method: 'POST',
      headers: authHeaders(true),
      body: JSON.stringify({ winner: { username: winnerUsername }, scores, ballHit })
    });
    ballStore.clearHits();
  } catch {}
  localStorage.removeItem('currentTournamentMatch');
  router.push('/tournaments');
}

function normalizeGameType(): 'PONG' | 'TICTACTOE' {
  if (currentGameType) return currentGameType;
  const active = controller?.getActiveGame?.();
  if (active) return active === 'Pong' ? 'PONG' : 'TICTACTOE';
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
    // Récupérer le pseudo invité depuis les joueurs initialisés dans le jeu
    let guestUsername = (PlayerManager.getPlayer(1)?.store.name || '').trim();
    // Fallback (ancien comportement) si non défini
    if (!guestUsername) {
      guestUsername = (localStorage.getItem('guestUsername') || '').trim();
    }
    if (!guestUsername) guestUsername = 'Guest';

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

  // Reset state at game start to avoid stale submissions
  const ballStore = useBallStore();
  ballStore.clearHits();
  gameStore.setWinner('');

  // Check for tournament context
  const stored = localStorage.getItem('currentTournamentMatch');
  if (stored && route.name === 'TournamentMatch') {
    try { tournamentContext = JSON.parse(stored); } catch {}
  }

  // Get game session from store
  const gameSession = gameSessionStore.getGameSession();
  
  // If we have a game session from the modal, use it
  if (gameSession) {
    // Disable auto AI addition since we're controlling it manually
    aiControlStore.setDisableAutoAI(true);
    
    PlayerManager.clearMap();
    
    // Launch game first to initialize scene and get proper sizing
    await controller.launchGame(gameSession.gameType);
    currentGameType = gameSession.gameType === 'Pong' ? 'PONG' : 'TICTACTOE';
    
    // Now add players with proper scene and sizing information
    if (gameSession.gameType === 'Pong' && scene) {
      const size = { width: 9, depth: 6 }; // Standard Pong size
      
      // Add first player
      PlayerManager.addPlayer(gameSession.player1Name, scene.scene, size, scene.zoneGameA);
      
      // Add second player (either human or AI)
      if (gameSession.isPlayer2AI) {
        const pongGame = controller.getGame('Pong') as any;
        const ballMesh = pongGame?.ball?.getMesh();
        const keys = pongGame?.keysPressed || {};
        
        if (ballMesh) {
          PlayerManager.addAI(gameSession.player2Name, ballMesh, scene.scene, size, keys, scene.zoneGameA);
        }
      } else {
        PlayerManager.addPlayer(gameSession.player2Name, scene.scene, size, scene.zoneGameA);
      }
    } else if (gameSession.gameType === 'TicTacToe') {
      // TicTacToe: si des joueurs par défaut existent déjà (Player 1 / Player 2), on les renomme
      const players = PlayerManager.listPlayers();
      if (players.length >= 2) {
        players[0].store.setName(gameSession.player1Name);
        players[1].store.setName(gameSession.player2Name);
      } else {
        PlayerManager.addBasicPlayer(gameSession.player1Name);
        PlayerManager.addBasicPlayer(gameSession.player2Name);
      }
    }
    
    // Clear session after use
    gameSessionStore.clearGameSession();
    // Allow submissions after clean start
    readyToSubmit = true;
  }
  // If we have tournament context, use it
  else if (tournamentContext) {
    // Ne pas nettoyer les joueurs ici: le jeu a déjà été initialisé à l'enregistrement
    // Assurer que le jeu Pong est bien prêt avec les joueurs du tournoi
    if (tournamentContext.gameType === 'PONG') {
      // Si pour une raison quelconque il n'y a pas 2 joueurs, on réenregistre le jeu pour relancer init()
      if (PlayerManager.listPlayers().length < 2) {
        controller.disposeGame('Pong');
        controller.registerGame('Pong', () => new PongGame(), 'A', CAMERA_POSITIONS.pong);
      }
      await controller.launchGame('Pong');
    } else if (tournamentContext.gameType === 'TICTACTOE') {
      await controller.launchGame('TicTacToe');
    }
    currentGameType = tournamentContext.gameType === 'PONG' ? 'PONG' : 'TICTACTOE';
    // Autoriser l'envoi de résultat après un démarrage propre
    readyToSubmit = true;
  }
  // Otherwise redirect to home (no game selection HUD)
  else {
    router.push('/');
    return;
  }

  disposeHudCheck = scene.onBeforeRender(() => {
    const active = controller.getActiveGame();
    const cameraStopped = !scene!.isCameraMoving();
    
    if (active === 'Pong' && cameraStopped) {
      if (!pongHud) pongHud = new PongHUD(scene!.scene, controller, t);
      pongHud.show();
    } else {
      pongHud?.hide();
    }
    
    if (active === 'TicTacToe' && cameraStopped) {
      if (!ttthud) {
        ttthud = new TTTHUD(scene!.scene, controller);
        // Connect HUD to the TicTacToe game
        const tttGame = controller.getGame('TicTacToe');
        if (tttGame && (tttGame as any).setHUD) {
          (tttGame as any).setHUD(ttthud);
        }
        // Refresh display to show correct player names
        if (ttthud.refreshDisplay) {
          ttthud.refreshDisplay();
        }
      }
      ttthud.show();
    } else {
      ttthud?.hide();
    }

    if (tournamentContext && readyToSubmit && gameStore.winner && !submitting) {
      submitting = true;
      const w = gameStore.winner;
      reportAndReturn(w).finally(() => { submitting = false; });
    }
    if (!tournamentContext && readyToSubmit && gameStore.winner && !submitting) {
      // Partie casual: envoyer l'enregistrement une seule fois
      submitting = true;
      const w = gameStore.winner;
      saveCasualResult(w).finally(() => { gameStore.setWinner(''); submitting = false; });
    }
  });

  window.addEventListener('resize', handleResize);
  handleResize();
});

function handleResize() {
  if (scene) {
    scene.engine.resize();
  }
}

onBeforeUnmount(() => {
  if (tournamentContext) localStorage.removeItem('currentTournamentMatch');
  disposeHudCheck?.();
  pongHud?.dispose();
  ttthud?.dispose();
  controller.dispose();
  
  // Reset AI control
  aiControlStore.setDisableAutoAI(false);
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
