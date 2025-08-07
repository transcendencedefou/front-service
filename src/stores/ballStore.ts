import { defineStore } from "pinia";

interface Position {
    x: number;
    y: number;
    z: number;
}

interface BallState {
    speed: number;
    acceleration: number;
    pos: Position;
    direction: Position;
    lastBarCollisionTime: number;
    barCollisionCooldown: number;
}

export const useBallStore = defineStore("ball", {
    state: (): BallState => ({
        speed: 0,
        acceleration: 1.08,
        pos: { x: 0, y: 0, z: 0 },
        direction: { x: 0, y: 0, z: 0 },
        lastBarCollisionTime: 0,
        barCollisionCooldown: 200,
    }),
    actions: {},
});
