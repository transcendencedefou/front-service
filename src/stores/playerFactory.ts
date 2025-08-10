import { defineStore } from "pinia";
import { PlayerManager } from "@/games/Players/PlayerManager.ts";

interface PlayerState {
    name: string;
    id: number;
    score: number;
    spawn: { x: number; y: number, z: number };
    pos: { x: number; z: number };
    bar_speed: number;
    bar_depth: number;
    last_hit: boolean;
}

export function createPlayerStore(id: number, depth: number) {
    return defineStore(`player-${id}`, {
        state: (): PlayerState => ({
            name: "",
            id: 0,
            score: 0,
            spawn: { x: 0, y: 0, z: 0 },
            pos: { x: 0, z: 0 },
            last_hit: false,
            bar_speed: 0,
            bar_depth: 0,
        }),
        actions: {
            setLastHit() {
                let player;
                for (player of PlayerManager.listPlayers())
                    player.store.last_hit = false
                this.last_hit = true;
            },
            setName(value: string) {
                this.name = value;
            },
            setID(value: number) {
                this.id = value;
            },
            setScore(value: number) {
                this.score = value;
            },
            incrementScore(value: number) {
                this.score += value;
            },
            setSpawn(x: number,y: number, z: number) {
                this.spawn = { x, y, z };
            },
            setPos(x: number, z: number) {
                this.pos = { x, z };
            },
            setBarSpeed(value: number) {
                this.bar_speed = value;
            },
            setBarDepth(value: number) {
                this.bar_depth = value * (1 / 6) * depth;
            },
        },
    })();
}