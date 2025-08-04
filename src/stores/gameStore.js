import { defineStore } from "pinia"

export const useGameStore = defineStore("game", {
    state: () => ({
        ID: '',
        game_type: '',
        player_name: [],
        player_num: 0,
        winner: "",
    }),

    actions: {
        setID(value) {
            this.ID = value
        },
        setGameType(value) {
            this.game_type = value
        },
        setRunning(value) {
            this.running = value
        },
        addPlayer(player) {
            if (this.player_num >= 2) return
            this.player_num += 1
            this.player_name.push(player)
        },
        setWinner(value) {
            this.winner = value
        }
    }
})
