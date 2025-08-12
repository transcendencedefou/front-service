import { ref } from 'vue';

interface GameData {
  gameType: string;
  player1Name: string;
  player2Name: string;
}

// Global state for the modal
const isGameModalVisible = ref(false);

export function useGameModal() {
  function openGameModal() {
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
