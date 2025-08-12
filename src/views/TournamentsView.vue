<template>
  <div class="min-h-screen bg-bg text-fg">
    <!-- Notification globale -->
    <transition name="notification">
      <div
        v-if="notification.show"
        class="fixed top-6 right-6 z-50 max-w-md"
      >
        <div
          class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border"
          :class="getNotificationClass(notification.type)"
        >
          <div class="flex-shrink-0">
            <span v-if="notification.type === 'success'">✅</span>
            <span v-else-if="notification.type === 'error'">❌</span>
            <span v-else>ℹ️</span>
          </div>
          <div class="flex-1 text-sm font-medium">
            {{ notification.message }}
          </div>
          <button
            @click="hideNotification"
            class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      </div>
    </transition>

    <!-- Header avec gradient -->
    <div class="relative overflow-hidden bg-gradient-to-br from-accent-1/20 via-accent-2/10 to-accent-3/20 pt-24 pb-16">
      <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div class="relative max-w-7xl mx-auto px-6">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-accent-1 to-accent-3 bg-clip-text text-transparent">
            🏆 Tournois
          </h1>
          <p class="text-lg text-fg/70 max-w-2xl mx-auto">
            Créez et participez à des tournois épiques. Affrontez vos amis et gravissez les échelons !
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="panel text-center">
          <div class="text-3xl font-bold text-accent-1">{{ tournaments.length }}</div>
          <div class="text-sm text-fg/60 mt-1">Tournois créés</div>
        </div>
        <div class="panel text-center">
          <div class="text-3xl font-bold text-accent-2">{{ activeTournaments }}</div>
          <div class="text-sm text-fg/60 mt-1">En cours</div>
        </div>
        <div class="panel text-center">
          <div class="text-3xl font-bold text-accent-3">{{ completedTournaments }}</div>
          <div class="text-sm text-fg/60 mt-1">Terminés</div>
        </div>
      </div>

      <!-- Onglets -->
      <div class="flex justify-center">
        <div class="flex bg-fg/5 rounded-xl p-1">
          <button
            @click="activeTab = 'create'"
            :class="[
              'px-6 py-3 rounded-lg font-semibold transition-all duration-200',
              activeTab === 'create'
                ? 'bg-accent-3 text-bg shadow-lg'
                : 'text-fg/70 hover:text-fg hover:bg-fg/10'
            ]"
          >
            ✨ Créer un tournoi
          </button>
          <button
            @click="activeTab = 'list'"
            :class="[
              'px-6 py-3 rounded-lg font-semibold transition-all duration-200',
              activeTab === 'list'
                ? 'bg-accent-3 text-bg shadow-lg'
                : 'text-fg/70 hover:text-fg hover:bg-fg/10'
            ]"
          >
            📋 Mes tournois
          </button>
        </div>
      </div>

      <!-- Contenu des onglets -->
      <div class="min-h-[400px]">
        <!-- Onglet Création -->
        <div v-if="activeTab === 'create'" class="max-w-2xl mx-auto">
          <div class="panel">
            <div class="text-center mb-6">
              <h2 class="text-2xl font-bold text-fg mb-2">Créer un nouveau tournoi</h2>
              <p class="text-fg/60">Configurez votre tournoi et invitez vos amis !</p>
            </div>

            <form @submit.prevent="createTournament" class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="auth-label">
                    <span class="flex items-center gap-2">
                      🏷️ Nom du tournoi
                    </span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="auth-input"
                    placeholder="Ex: Championnat d'été"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <label class="auth-label">
                    <span class="flex items-center gap-2">
                      🎮 Type de jeu
                    </span>
                  </label>
                  <select v-model="form.gameType" class="auth-input">
                    <option value="PONG">🏓 Pong</option>
                    <option value="TICTACTOE">⭕ TicTacToe</option>
                  </select>
                </div>
              </div>

              <div class="space-y-2">
                <label class="auth-label">
                  <span class="flex items-center gap-2">
                    👥 Ajouter des joueurs
                  </span>
                </label>
                <input
                  v-model="guestsInput"
                  type="text"
                  class="auth-input"
                  placeholder="Séparez les noms d'utilisateur par des virgules (ex: player1, player2)"
                />

              </div>


              <button
                type="submit"
                :disabled="loading || !form.name.trim()"
                class="auth-btn-primary group"
              >
                <span v-if="loading" class="flex items-center gap-2">
                  <div class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Création en cours...
                </span>
                <span v-else class="flex items-center gap-2">
                  🚀 Créer le tournoi
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- Onglet Liste -->
        <div v-if="activeTab === 'list'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold">Mes tournois</h2>
            <button
              @click="fetchMine"
              :disabled="loading"
              class="flex items-center gap-2 px-4 py-2 bg-accent-1/20 hover:bg-accent-1/30 text-accent-1 rounded-lg transition-colors disabled:opacity-50"
            >
              <span v-if="loading" class="animate-spin">🔄</span>
              <span v-else>🔄</span>
              {{ loading ? 'Chargement...' : 'Actualiser' }}
            </button>
          </div>

          <!-- Message si aucun tournoi -->
          <div v-if="loading && tournaments.length === 0" class="text-center py-16">
            <div class="text-6xl mb-4 animate-pulse">⚡</div>
            <h3 class="text-xl font-semibold text-fg mb-2">Chargement des tournois...</h3>
            <p class="text-fg/60">Veuillez patienter</p>
          </div>

          <div v-else-if="!loading && tournaments.length === 0" class="text-center py-16">
            <div class="text-6xl mb-4">🏆</div>
            <h3 class="text-xl font-semibold text-fg mb-2">Aucun tournoi pour le moment</h3>
            <p class="text-fg/60 mb-6">Créez votre premier tournoi pour commencer l'aventure !</p>
            <button
              @click="activeTab = 'create'"
              class="auth-btn-primary inline-flex items-center gap-2"
            >
              ✨ Créer mon premier tournoi
            </button>
          </div>

          <!-- Liste des tournois -->
          <div v-else class="grid gap-6">
            <div
              v-for="t in tournaments"
              :key="t.id"
              class="panel hover:shadow-xl transition-all duration-200 border-l-4"
              :class="getStatusBorderClass(t.status)"
            >
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-xl font-bold text-fg truncate">{{ t.name }}</h3>
                    <span class="game-type-badge" :class="getGameTypeBadgeClass(t.gameType)">
                      {{ getGameTypeIcon(t.gameType) }} {{ t.gameType }}
                    </span>
                  </div>

                  <div class="flex items-center gap-4 text-sm text-fg/60 mb-3">
                    <span class="status-badge" :class="getStatusBadgeClass(t.status)">
                      {{ getStatusIcon(t.status) }} {{ getStatusText(t.status) }}
                    </span>
                    <span v-if="t.guestPlayers?.length" class="flex items-center gap-1">
                      👥 {{ t.guestPlayers.length }} invité(s)
                    </span>
                  </div>

                  <div v-if="t.guestPlayers?.length" class="text-sm text-fg/60">
                    <span class="font-medium">Participants :</span>
                    {{ t.guestPlayers.join(', ') }}
                  </div>
                </div>

                <div class="flex gap-2">
                  <button
                    v-if="t.status === 'CREATED'"
                    @click="start(t.id)"
                    class="action-btn start-btn"
                  >
                    🚀 Démarrer
                  </button>
                  <button
                    v-if="t.status === 'IN_PROGRESS'"
                    @click="refreshBracket(t.id)"
                    class="action-btn bracket-btn"
                  >
                    📊 {{ selectedBracketId === t.id ? 'Masquer' : 'Bracket' }}
                  </button>
                  <button
                    v-if="t.status === 'COMPLETED'"
                    @click="refreshBracket(t.id)"
                    class="action-btn results-btn"
                  >
                    🏆 Résultats
                  </button>
                </div>
              </div>

              <!-- Bracket/Résultats -->
              <div v-if="t.id === selectedBracketId && t.bracket?.rounds" class="mt-6 pt-6 border-t border-fg/10">
                <h4 class="text-lg font-semibold mb-4 flex items-center gap-2">
                  📊 Arbre du tournoi
                </h4>
                <div class="overflow-x-auto">
                  <div class="flex items-start gap-8 pb-4" style="min-width: max-content;">
                    <div
                      v-for="(round, rIdx) in t.bracket.rounds"
                      :key="rIdx"
                      class="min-w-[200px]"
                    >
                      <div class="text-center mb-4">
                        <span class="inline-block px-3 py-1 bg-accent-1/20 text-accent-1 rounded-full text-sm font-semibold">
                          {{ getRoundName(rIdx, t.bracket.rounds.length) }}
                        </span>
                      </div>

                      <div class="space-y-4">
                        <div
                          v-for="(slot, sIdx) in round"
                          :key="sIdx"
                          class="match-card"
                          :class="{ 'match-completed': slot.winner }"
                        >
                          <div class="space-y-2">
                            <div
                              v-for="(player, pIdx) in slot.players"
                              :key="pIdx"
                              class="player-slot"
                              :class="{ 'winner': slot.winner?.username === player?.username }"
                            >
                              <span class="player-name">
                                {{ player?.username || 'En attente...' }}
                              </span>
                              <span v-if="slot.winner?.username === player?.username" class="winner-crown">
                                👑
                              </span>
                            </div>
                          </div>

                          <button
                            v-if="slot.matchId && !slot.winner && t.status === 'IN_PROGRESS'"
                            @click="launchMatch(t.id, slot.matchId)"
                            class="w-full mt-3 px-3 py-2 bg-accent-3 hover:bg-accent-1 text-bg rounded-lg font-semibold transition-colors"
                          >
                            ⚔️ Lancer le match
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRuntimeConfig } from '../config/api';

const auth = useAuthStore();
const api = useRuntimeConfig();

const form = ref({ name: '', gameType: 'PONG' });
const guestsInput = ref('');
const loading = ref(false);
const tournaments = ref<any[]>([]);
const selectedBracketId = ref<string>('');
const activeTab = ref('create');

// Système de notifications
const notification = ref<{message: string; type: 'success' | 'error' | 'info'; show: boolean}>({
  message: '',
  type: 'info',
  show: false
});

let notificationTimeout: ReturnType<typeof setTimeout> | null = null;

function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }

  notification.value = { message, type, show: true };

  notificationTimeout = setTimeout(() => {
    notification.value.show = false;
  }, duration);
}

function hideNotification() {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
  notification.value.show = false;
}

// Computed properties pour les statistiques
const activeTournaments = computed(() =>
  tournaments.value.filter(t => t.status === 'IN_PROGRESS').length
);

const completedTournaments = computed(() =>
  tournaments.value.filter(t => t.status === 'COMPLETED').length
);

// Fonctions utilitaires pour l'affichage
function getStatusBorderClass(status: string) {
  switch (status) {
    case 'CREATED': return 'border-l-blue-500';
    case 'IN_PROGRESS': return 'border-l-accent-2';
    case 'COMPLETED': return 'border-l-green-500';
    default: return 'border-l-gray-500';
  }
}

function getGameTypeBadgeClass(gameType: string) {
  switch (gameType) {
    case 'PONG': return 'bg-accent-1/20 text-accent-1';
    case 'TICTACTOE': return 'bg-accent-3/20 text-accent-3';
    default: return 'bg-gray-500/20 text-gray-500';
  }
}

function getGameTypeIcon(gameType: string) {
  switch (gameType) {
    case 'PONG': return '🏓';
    case 'TICTACTOE': return '⭕';
    default: return '🎮';
  }
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'CREATED': return 'bg-blue-500/20 text-blue-400';
    case 'IN_PROGRESS': return 'bg-accent-2/20 text-accent-2';
    case 'COMPLETED': return 'bg-green-500/20 text-green-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'CREATED': return '⏳';
    case 'IN_PROGRESS': return '🎯';
    case 'COMPLETED': return '✅';
    default: return '❓';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'CREATED': return 'En attente';
    case 'IN_PROGRESS': return 'En cours';
    case 'COMPLETED': return 'Terminé';
    default: return 'Inconnu';
  }
}

function getRoundName(roundIndex: number, totalRounds: number) {
  if (totalRounds === 1) return 'Finale';
  if (roundIndex === totalRounds - 1) return 'Finale';
  if (roundIndex === totalRounds - 2) return 'Demi-finale';
  if (roundIndex === totalRounds - 3) return 'Quart de finale';
  return `Tour ${roundIndex + 1}`;
}

function getNotificationClass(type: string) {
  switch (type) {
    case 'success':
      return 'bg-green-500/10 border-green-500/20 text-green-400';
    case 'error':
      return 'bg-red-500/10 border-red-500/20 text-red-400';
    default:
      return 'bg-accent-1/10 border-accent-1/20 text-accent-1';
  }
}

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
    const tournamentName = form.value.name || 'Sans nom';
    const res = await fetch(`${api.GAME_URL}/tournoi`, { method:'POST', headers: authHeaders(true), body: JSON.stringify({ gameType: form.value.gameType, name: form.value.name, guests }) });

    if (res.ok) {
      form.value.name='';
      guestsInput.value='';
      activeTab.value = 'list'; // Basculer vers la liste après création
      await fetchMine();
      showNotification(`🎉 Tournoi "${tournamentName}" créé avec succès !`, 'success');
    } else {
      const errorData = await res.json();
      showNotification(`❌ Erreur: ${errorData.message || 'Impossible de créer le tournoi'}`, 'error');
    }
  } catch (error: any) {
    showNotification(`❌ Erreur: ${error.message || 'Erreur de connexion'}`, 'error');
  } finally {
    loading.value=false;
  }
}

async function fetchMine() {
  loading.value = true;
  try {
    const res = await fetch(`${api.GAME_URL}/tournoi/mine`, { headers: authHeaders(false) });
    if (res.ok) {
      tournaments.value = await res.json();
    } else {
      showNotification('❌ Impossible de charger les tournois', 'error');
    }
  } catch (error: any) {
    showNotification(`❌ Erreur: ${error.message || 'Erreur de connexion'}`, 'error');
  } finally {
    loading.value = false;
  }
}

async function start(id: string) {
  try {
    const res = await fetch(`${api.GAME_URL}/tournoi/${id}/start`, { method:'POST', headers: authHeaders(false) });
    if (res.ok) {
      await fetchMine();
      showNotification('🚀 Tournoi démarré ! Les participants peuvent maintenant jouer.', 'success');
    } else {
      const errorData = await res.json();
      showNotification(`❌ Impossible de démarrer: ${errorData.message || 'Erreur inconnue'}`, 'error');
    }
  } catch (error: any) {
    showNotification(`❌ Erreur: ${error.message || 'Erreur de connexion'}`, 'error');
  }
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
/* Motif de grille pour le header */
.bg-grid-pattern {
  background-image:
    repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 20px),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 20px);
}

/* Badges et étiquettes */
.game-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Boutons d'action */
.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  transform: scale(1);
}

.action-btn:hover {
  transform: scale(1.05);
}

.start-btn {
  background-color: #10b981;
  color: white;
}

.start-btn:hover {
  background-color: #059669;
}

.bracket-btn {
  background-color: var(--accent-1);
  color: white;
}

.bracket-btn:hover {
  background-color: color-mix(in srgb, var(--accent-1) 80%, black 20%);
}

.results-btn {
  background-color: var(--accent-3);
  color: var(--bg);
}

.results-btn:hover {
  background-color: var(--accent-1);
}

/* Cards de match dans le bracket */
.match-card {
  background-color: color-mix(in srgb, var(--fg) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--fg) 10%, transparent);
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: all 0.2s ease;
}

.match-card:hover {
  background-color: color-mix(in srgb, var(--fg) 8%, transparent);
  border-color: color-mix(in srgb, var(--fg) 20%, transparent);
}

.match-completed {
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--accent-3) 10%, transparent) 0%,
    color-mix(in srgb, var(--accent-1) 10%, transparent) 100%);
  border-color: color-mix(in srgb, var(--accent-3) 30%, transparent);
}

/* Slots des joueurs */
.player-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background-color: color-mix(in srgb, var(--fg) 5%, transparent);
  border-radius: 0.375rem;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.player-slot.winner {
  background: linear-gradient(90deg,
    color-mix(in srgb, var(--accent-3) 20%, transparent) 0%,
    color-mix(in srgb, var(--accent-1) 20%, transparent) 100%);
  border-color: color-mix(in srgb, var(--accent-3) 50%, transparent);
  color: var(--accent-3);
  font-weight: 600;
}

.player-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.winner-crown {
  margin-left: 0.5rem;
  font-size: 1.125rem;
  animation: pulse 2s infinite;
}

/* Responsive design amélioré */
@media (max-width: 768px) {
  .action-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }

  .match-card {
    padding: 0.5rem;
  }

  .player-slot {
    padding: 0.375rem 0.5rem;
    font-size: 0.875rem;
  }
}

/* Animation pour les nouveaux tournois */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.panel {
  animation: slideInUp 0.3s ease-out;
}

/* Hover effects pour les cartes de tournoi */
.panel:hover {
  transform: translateY(-2px);
}

/* Style pour les liens/boutons inactifs */
.disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* Amélioration du focus pour l'accessibilité */
.action-btn:focus,
.auth-btn-primary:focus {
  outline: 2px solid var(--accent-2);
  outline-offset: 2px;
}

/* Animation pour les notifications */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
