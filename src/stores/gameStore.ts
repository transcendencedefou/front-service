import { defineStore } from "pinia";

interface GameState {
    ID: string;
    game_type: string;
    player_name: string[];
    player_count: number;
    winner: string;
}

export const useGameStore = defineStore("game", {
    state: (): GameState => ({
        ID: '',
        game_type: '',
        player_name: [],
        player_count: 0,
        winner: '',
    }),

    actions: {
        setID(value: string) {
            this.ID = value;
        },
        setGameType(value: string) {
            this.game_type = value;
        },
        setRunning(value: boolean) {
            (this as any).running = value; // running is dynamically added
        },
        addPlayer(player: string) {
            if (this.player_count >= 2) return;
            this.player_count += 1;
            this.player_name.push(player);
        },
        setWinner(value: string) {
            this.winner = value;
        },
    },
});
