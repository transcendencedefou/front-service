<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center">
    <div class="bg-bg border border-accent rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-display text-fg">{{ $t('game.selectGame') }}</h2>
        <button @click="closeModal" class="text-fg/60 hover:text-fg transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Game Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-fg mb-3">{{ $t('game.chooseGame') }}</label>
        <div class="grid grid-cols-2 gap-3">
          <button 
            v-for="game in games" 
            :key="game.id"
            @click="selectedGame = game.id"
            :class="[
              'p-4 border-2 rounded-lg transition font-medium',
              selectedGame === game.id 
                ? 'border-accent bg-accent/20 text-accent' 
                : 'border-fg/30 hover:border-accent/50 text-fg'
            ]"
          >
            {{ game.name }}
          </button>
        </div>
      </div>

      <!-- Player Names -->
      <div class="mb-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-fg mb-2">{{ $t('game.player1Name') }}</label>
          <input 
            v-model="player1Name" 
            type="text" 
            :placeholder="$t('game.player1Placeholder')"
            :disabled="true"
            class="w-full px-4 py-2 bg-bg-2/50 border border-fg/30 rounded-lg text-fg placeholder-fg/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent opacity-75 cursor-not-allowed"
          />
          <p class="text-xs text-fg/60 mt-1">{{ $t('game.currentUserNote') }}</p>
        </div>
        
        <!-- Player 2 Selection -->
        <div>
          <label class="block text-sm font-medium text-fg mb-2">{{ $t('game.player2') }}</label>
          <div class="flex gap-3 mb-3">
            <button 
              @click="isPlayer2AI = false"
              :class="[
                'flex-1 px-4 py-2 border-2 rounded-lg font-medium transition',
                !isPlayer2AI 
                  ? 'border-accent bg-accent/20 text-accent' 
                  : 'border-fg/30 hover:border-accent/50 text-fg'
              ]"
            >
              👤 {{ $t('game.humanPlayer') }}
            </button>
            <button 
              @click="isPlayer2AI = true"
              :class="[
                'flex-1 px-4 py-2 border-2 rounded-lg font-medium transition',
                isPlayer2AI 
                  ? 'border-accent bg-accent/20 text-accent' 
                  : 'border-fg/30 hover:border-accent/50 text-fg'
              ]"
            >
              🤖 {{ $t('game.aiPlayer') }}
            </button>
          </div>
          
          <input 
            v-if="!isPlayer2AI"
            v-model="player2Name" 
            type="text" 
            :placeholder="$t('game.player2Placeholder')"
            class="w-full px-4 py-2 bg-bg-2 border border-fg/30 rounded-lg text-fg placeholder-fg/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          <div 
            v-else
            class="w-full px-4 py-2 bg-bg-2/50 border border-fg/30 rounded-lg text-fg/70 italic"
          >
            🤖 {{ $t('game.aiOpponent') }}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button 
          @click="closeModal" 
          class="flex-1 px-4 py-2 border border-fg/30 rounded-lg text-fg hover:bg-fg/10 transition"
        >
          {{ $t('common.cancel') }}
        </button>
        <button 
          @click="startGame" 
          :disabled="!canStartGame"
          :class="[
            'flex-1 px-4 py-2 rounded-lg font-medium transition',
            canStartGame 
              ? 'bg-accent text-white hover:bg-accent/90' 
              : 'bg-fg/20 text-fg/50 cursor-not-allowed'
          ]"
        >
          {{ $t('game.startGame') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useGameSessionStore } from '@/stores/gameSession';
import { useAuthStore } from '@/stores/auth';

interface GameData {
  gameType: string;
  player1Name: string;
  player2Name: string;
  isPlayer2AI: boolean;
}

interface Game {
  id: string;
  name: string;
}

const props = defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits<{
  close: [];
  gameSelected: [data: GameData];
}>();

const { t } = useI18n();
const router = useRouter();
const gameSessionStore = useGameSessionStore();
const authStore = useAuthStore();

const games: Game[] = [
  { id: 'Pong', name: 'Pong' },
  { id: 'TicTacToe', name: 'Tic-Tac-Toe' }
];

const selectedGame = ref<string>('');
const player1Name = ref<string>('');
const player2Name = ref<string>('');
const isPlayer2AI = ref<boolean>(false);

const canStartGame = computed(() => {
  return selectedGame.value && 
         player1Name.value.trim() && 
         (isPlayer2AI.value || player2Name.value.trim());
});

// Reset form when modal opens
watch(() => props.isVisible, (visible) => {
  if (visible) {
    selectedGame.value = '';
    // Set player 1 name to current user's username
    player1Name.value = authStore.user?.username || 'Player1';
    player2Name.value = '';
    isPlayer2AI.value = false;
  }
});

// Initialize player 1 name on component mount
onMounted(() => {
  // Load user from localStorage if not already loaded
  authStore.loadUserFromLocalStorage();
  player1Name.value = authStore.user?.username || 'Player1';
});

function closeModal() {
  emit('close');
}

function startGame() {
  if (!canStartGame.value) return;
  
  const gameData: GameData = {
    gameType: selectedGame.value,
    player1Name: player1Name.value.trim(),
    player2Name: isPlayer2AI.value ? 'AI' : player2Name.value.trim(),
    isPlayer2AI: isPlayer2AI.value
  };

  emit('gameSelected', gameData);
  
  // Stocker les données dans le store
  gameSessionStore.setGameSession(gameData);
  
  // Naviguer vers la page de jeu sans paramètres
  router.push('/game');
  
  closeModal();
}
</script>
