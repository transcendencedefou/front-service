import { defineStore } from "pinia";

interface Position {
    x: number;
    y: number;
    z: number;
}

interface BallHitEvent {
    t: number; // timestamp ms
    by: string; // player name or side
    pos: { x: number; z: number };
    speed: number;
    dir: { x: number; z: number };
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
    hits: BallHitEvent[];
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
        hits: [],
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
        },
        addHit(hit: BallHitEvent) {
            this.hits.push(hit);
        },
        clearHits() {
            this.hits = [];
        }
    },
});
