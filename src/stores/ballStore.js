import {defineStore} from "pinia";

export const useBallStore = defineStore("ball", {
    state: () => ({
        speed: 0,
        pos: { x: 0 , y: 0},
        direction: { x: 0, y: 0 },
        lastBarCollisionTime: 0,
        barCollisionCooldown: 200,
    }),
    actions: ({
    })
})
