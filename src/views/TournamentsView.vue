<template>
  <div class="p-6 text-white space-y-6">
    <h1 class="text-2xl font-bold mb-4">Tournois</h1>

    <!-- Création -->
    <div class="bg-neutral-800/60 rounded-lg p-4 space-y-4 border border-neutral-700">
      <h2 class="font-semibold">Créer un tournoi</h2>
      <form @submit.prevent="createTournament" class="space-y-3">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm uppercase tracking-wide">Nom</label>
            <input v-model="form.name" type="text" class="mt-1 w-full bg-neutral-900/70 rounded px-3 py-2 focus:ring-2 focus:ring-fuchsia-500 outline-none" placeholder="Mon tournoi"/>
          </div>
          <div>
            <label class="text-sm uppercase tracking-wide">Jeu</label>
            <select v-model="form.gameType" class="mt-1 w-full bg-neutral-900/70 rounded px-3 py-2 focus:ring-2 focus:ring-fuchsia-500 outline-none">
              <option value="PONG">Pong</option>
              <option value="TICTACTOE">TicTacToe</option>
            </select>
          </div>
        </div>
        <div>
          <label class="text-sm uppercase tracking-wide">Invités (usernames séparés par des virgules)</label>
          <input v-model="guestsInput" type="text" class="mt-1 w-full bg-neutral-900/70 rounded px-3 py-2 focus:ring-2 focus:ring-fuchsia-500 outline-none" placeholder="player1, player2, ..."/>
        </div>
        <button :disabled="loading" class="bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 px-4 py-2 rounded font-semibold transition">
          {{ loading ? 'Création...' : 'Créer' }}
        </button>
      </form>
    </div>

    <!-- Liste -->
    <div class="bg-neutral-800/60 rounded-lg p-4 border border-neutral-700">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-semibold">Mes tournois</h2>
        <button @click="fetchMine" class="text-sm text-fuchsia-400 hover:text-fuchsia-300">Rafraîchir</button>
      </div>
      <div v-if="tournaments.length === 0" class="text-neutral-400 text-sm">Aucun tournoi.</div>
      <div v-for="t in tournaments" :key="t.id" class="border border-neutral-700 rounded p-3 mb-3 bg-neutral-900/40">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div class="font-medium">{{ t.name }} <span class="text-xs px-2 py-0.5 rounded bg-neutral-700 ml-2">{{ t.gameType }}</span></div>
            <div class="text-xs text-neutral-400">Status: {{ t.status }}</div>
            <div class="text-xs text-neutral-500">Invités: {{ (t.guestPlayers||[]).join(', ') || '—' }}</div>
          </div>
          <div class="flex gap-2">
            <button v-if="t.status==='CREATED'" @click="start(t.id)" class="text-xs bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded">Start</button>
            <button v-if="t.status==='IN_PROGRESS'" @click="refreshBracket(t.id)" class="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded">Bracket</button>
          </div>
        </div>
        <div v-if="t.id===selectedBracketId" class="mt-3 overflow-x-auto">
          <div class="flex items-start gap-6">
            <div v-for="(round, rIdx) in (t.bracket?.rounds || [])" :key="rIdx" class="min-w-[180px]">
              <div class="font-semibold text-xs mb-2 uppercase">Round {{ rIdx + 1 }}</div>
              <div v-for="(slot, sIdx) in round" :key="sIdx" class="mb-3 p-2 rounded bg-neutral-800/70 border border-neutral-700 text-xs">
                <div v-for="(pl, pIdx) in slot.players" :key="pIdx" class="truncate">• {{ pl?.username || '—' }}</div>
                <div v-if="slot.winner" class="mt-1 text-emerald-400">Winner: {{ slot.winner.username }}</div>
                <button v-if="slot.matchId && !slot.winner && t.status==='IN_PROGRESS'" @click="launchMatch(t.id, slot.matchId)" class="mt-2 w-full bg-fuchsia-600 hover:bg-fuchsia-500 rounded py-1">Lancer le match</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRuntimeConfig } from '../config/api';

const auth = useAuthStore();
const api = useRuntimeConfig();

const form = ref({ name: '', gameType: 'PONG' });
const guestsInput = ref('');
const loading = ref(false);
const tournaments = ref<any[]>([]);
const selectedBracketId = ref<string>('');

function authHeaders(hasBody = false) {
  const token = (auth as any).token ? (typeof (auth as any).token === 'string' ? (auth as any).token : (auth as any).token.value) : localStorage.getItem('token') || '';
  const h: Record<string,string> = { 'Authorization': `Bearer ${token}` };
  if (hasBody) h['Content-Type'] = 'application/json';
  return h;
}

async function createTournament() {
  loading.value = true;
  try {
    const guests = guestsInput.value.split(',').map(s=>s.trim()).filter(Boolean);
    const res = await fetch(`${api.GAME_URL}/tournoi`, { method:'POST', headers: authHeaders(true), body: JSON.stringify({ gameType: form.value.gameType, name: form.value.name, guests }) });
    if (res.ok) {
      form.value.name=''; guestsInput.value='';
      await fetchMine();
    }
  } finally { loading.value=false; }
}

async function fetchMine() {
  const res = await fetch(`${api.GAME_URL}/tournoi/mine`, { headers: authHeaders(false) });
  if (res.ok) tournaments.value = await res.json();
}

async function start(id: string) {
  await fetch(`${api.GAME_URL}/tournoi/${id}/start`, { method:'POST', headers: authHeaders(false) });
  await fetchMine();
}

async function refreshBracket(id: string) {
  selectedBracketId.value = id === selectedBracketId.value ? '' : id;
  if (selectedBracketId.value) await fetchMine();
}

async function launchMatch(tournoiId: string, matchId: string) {
  // Récupérer les infos du match pour connaître le jeu
  const res = await fetch(`${api.GAME_URL}/match/${matchId}`, { headers: authHeaders(false) });
  if (res.ok) {
    const match = await res.json();
    // Stocker dans localStorage pour GameView (simple approche)
    localStorage.setItem('currentTournamentMatch', JSON.stringify({ matchId, tournoiId, gameType: match.tournoi.gameType, participants: match.participants }));
    // Redirection vers la vue de jeu
    window.location.href = '/app/tournament/match/' + matchId;
  }
}

onMounted(fetchMine);
</script>

<style scoped>
</style>
