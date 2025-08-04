import {defineStore} from "pinia";

export const useGameStore = defineStore("game", {
    state: () => ({
        running: false,
        player_num: 0,
    }),
    actions: ({
        start() {
            this.running = true
        },
        stop() {
            this.running = false
        },
        addPlayer() {
            this.player_num += 1
        },
        removePlayer() {
            this.player_num -= 1
        }
    })
})
