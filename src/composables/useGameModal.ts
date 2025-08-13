import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

interface GameData {
  gameType: string;
  player1Name: string;
  player2Name: string;
}

// Global state for the modal
const isGameModalVisible = ref(false);

export function useGameModal() {
  function openGameModal() {
    const authStore = useAuthStore();
    
    // Vérifier si l'utilisateur est connecté avant d'ouvrir la modal
    if (!authStore.isAuthenticated) {
      console.warn('Utilisateur non connecté - impossible d\'ouvrir la modal de jeu');
      return;
    }
    
    isGameModalVisible.value = true;
  }

  function closeGameModal() {
    isGameModalVisible.value = false;
  }

  function onGameSelected(gameData: GameData) {
    // This can be extended to handle the game data globally if needed
    console.log('Game selected:', gameData);
    closeGameModal();
  }

  return {
    isGameModalVisible,
    openGameModal,
    closeGameModal,
    onGameSelected
  };
}
