import {defineStore} from "pinia";

export const useGameStore = defineStore("game", {
    state: () => ({
        ID:'',
        game_type: '',
        running: false,
        player_list: [],
    })
})