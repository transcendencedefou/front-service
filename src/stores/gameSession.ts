import { defineStore } from 'pinia';
import { ref } from 'vue';

interface GameSessionData {
  gameType: string;
  player1Name: string;
  player2Name: string;
  isPlayer2AI: boolean;
  timestamp: number;
}

export const useGameSessionStore = defineStore('gameSession', () => {
  const currentSession = ref<GameSessionData | null>(null);
  const shouldDisableAutoAI = ref<boolean>(false);
  
  function setGameSession(data: Omit<GameSessionData, 'timestamp'>) {
    currentSession.value = {
      ...data,
      timestamp: Date.now()
    };
    
    // Set flag to disable auto AI if we're managing AI ourselves
    shouldDisableAutoAI.value = data.isPlayer2AI || !data.isPlayer2AI;
  }
  
  function getGameSession(): GameSessionData | null {
    // Vérifier si la session n'est pas trop ancienne (5 minutes max)
    if (currentSession.value && (Date.now() - currentSession.value.timestamp > 5 * 60 * 1000)) {
      clearGameSession();
      return null;
    }
    return currentSession.value;
  }
  
  function clearGameSession() {
    currentSession.value = null;
    shouldDisableAutoAI.value = false;
  }
  
  function hasValidSession(): boolean {
    return getGameSession() !== null;
  }
  
  function getShouldDisableAutoAI(): boolean {
    return shouldDisableAutoAI.value;
  }
  
  return {
    currentSession,
    setGameSession,
    getGameSession,
    clearGameSession,
    hasValidSession,
    getShouldDisableAutoAI
  };
});
