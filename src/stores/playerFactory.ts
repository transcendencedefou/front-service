import { defineStore } from "pinia";
import { GameContext } from "../games/PongGame/src/GameContext";
import { PlayerManager } from "@/games/PongGame/src/PlayerManager.ts";

interface SpawnPosition {
    x: number;
    z: number;
}

interface PlayerState {
    name: string;
    id: number;
    score: number;
    spawn: SpawnPosition;
    pos: SpawnPosition;
    bar_speed: number;
    bar_depth: number;
    last_hit: boolean;
}

export function createPlayerStore(id: number) {
    return defineStore(`player-${id}`, {
        state: (): PlayerState => ({
            name: "",
            id: 0,
            score: 0,
            spawn: { x: 0, z: 0 },
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
            setSpawn(x: number, z: number) {
                this.spawn = { x, z };
            },
            setPos(x: number, z: number) {
                this.pos = { x, z };
            },
            setBarSpeed(value: number) {
                this.bar_speed = value;
            },
            setBarDepth(value: number) {
                this.bar_depth = value * (1 / 6) * GameContext.size.depth;
            },
        },
    })();
}