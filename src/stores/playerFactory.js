import {defineStore} from "pinia";

export function createPlayerStore(id) {
    return defineStore(`player-${id}`, {
        state: () => ({
            name: "",
            id: 0,
            player_score: 0,
            spawn: { x: 0, y: 0 },
            pos: { x: 0 , y: 0},
            bar_speed: 0,
            bar_height: 1,
        }),
        actions: {
            setName(value) {
                this.name = value
            },
            setID(value) {
                this.id = value
            },
            setPlayerScore(value) {
                this.player_score = value
            },
            setSpawn(x, y) {
                this.spawn = { x, y };
            },
            setPos(x, y) {
                this.pos = {x, y}
            },
            setBarSpeed(value) {
                this.bar_speed = value
            },
            setBarHeight(value) {
                this.bar_height = value
            },
        }
    }) ()
}