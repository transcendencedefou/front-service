import {defineStore} from "pinia";

export const usePlayerStore = defineStore("player", {
    state: () => ({
        name: "",
        number: 0,
        player_score: 0,
        bar_speed: 0,
        bar_height: 1,
    }),
    actions: {
        setName(value) {
            this.name = value
        },
        setNumber(value) {
            this.number = value
        },
        setPlayerScore(value) {
            this.player_score = value
        },
        setBarSpeed(value) {
            this.bar_speed = value
        },
        setBarHeight(bar_height) {
            this.bar_height = bar_height
        }
    }
})