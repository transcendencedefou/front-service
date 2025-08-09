import { defineStore } from "pinia";

interface Position {
    x: number;
    y: number;
    z: number;
}

interface BallState {
    speed: number;
    def_speed: number;
    max_speed: number;
    acceleration: number;
    pos: Position;
    direction: Position;
    lastBarCollisionTime: number;
    barCollisionCooldown: number;
}

export const useBallStore = defineStore("ball", {
    state: (): BallState => ({
        speed: 0,
        def_speed: 0,
        max_speed: 0,
        acceleration: 0,
        pos: { x: 0, y: 0, z: 0 },
        direction: { x: 0, y: 0, z: 0 },
        lastBarCollisionTime: 0,
        barCollisionCooldown: 200,
    }),
    actions: {
        setDefSpeed(value: number) {
            this.def_speed = value;
        },
        setMaxSpeed(value: number) {
            this.max_speed = value;
        },
        setAcceleration(value: number) {
            this.acceleration = value;
        }
    },
});
