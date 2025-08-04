import {defineStore} from "pinia";

export function createPlayerStore(id) {
    return defineStore(`player-${id}`, {
        state: () => ({
            name: "",
            id: 0,
            score: 0,
            spawn: { x: 0, z: 0 },
            pos: { x: 0 , z: 0},
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
            setScore(value) {
                this.score = value
            },
            setSpawn(x, z) {
                this.spawn = { x, z };
            },
            setPos(x, z) {
                this.pos = { x, z }
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