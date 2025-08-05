import {defineStore} from "pinia";

export const usePongStore = defineStore("ponggame", {
    state: () => ({
        ball_speed: 0,
        ball_direction: {x: 0, y: 0, z: 0},
        ball_position: {x: 0, y: 0, z: 0},
    }),
    actions: ({
        setBallSpeed(value) {
            this.ball_speed = value
        },
        setBallDirection(value) {
            this.ball_direction = value
        }
    })
})
