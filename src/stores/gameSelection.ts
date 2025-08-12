import { defineStore } from 'pinia';

interface GameData {
  gameType: string;
  player1Name: string;
  player2Name: string;
  isPlayer2AI: boolean;
}

export const useGameSelectionStore = defineStore('gameSelection', {
  state: (): GameData => ({
    gameType: '',
    player1Name: '',
    player2Name: '',
    isPlayer2AI: false,
  }),

  actions: {
    setGameData(data: GameData) {
      this.gameType = data.gameType;
      this.player1Name = data.player1Name;
      this.player2Name = data.player2Name;
      this.isPlayer2AI = data.isPlayer2AI;
    },

    reset() {
      this.gameType = '';
      this.player1Name = '';
      this.player2Name = '';
      this.isPlayer2AI = false;
    }
  }
});
