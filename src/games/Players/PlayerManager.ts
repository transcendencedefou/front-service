import { Player } from './Player.ts';
import { initAI, dispose as disposeAI } from '../pong/PongAIController.ts';
import { Mesh, Scene, TransformNode } from '@babylonjs/core';
import { createPlayerBarMesh } from '@/games/meshes/createPlayerBarMesh.ts';

const playerMap: Map<number, Player> = new Map();

export const PlayerManager = {
    addBasicPlayer(name: string) {
        const id = playerMap.size;
        const player = new Player(id, name, { width: 0, depth: 0 });
        playerMap.set(id, player);
    },

    addPlayer(name: string, scene: Scene, size: { width: number; depth: number }, parent?: TransformNode | null) {
        const id = playerMap.size;
        const player = new Player(id, name, size);
        player.initPong(size);
        const bar = createPlayerBarMesh(scene, player.store, parent);
        player.setBarMesh(bar);
        playerMap.set(id, player);
    },

    addAI(name: string, ballMesh: Mesh, scene: Scene, size: { width: number; depth: number }, keys: Record<string, boolean>, parent?: TransformNode | null) {
        const id = playerMap.size;
        const player = new Player(id, name, size);
        player.initPong(size);
        const bar = createPlayerBarMesh(scene, player.store, parent);
        player.setBarMesh(bar);
        playerMap.set(id, player);
        if (ballMesh) {
            initAI({
                ballMesh,
                paddleMesh: bar,
                xAI: bar.position.x,
                bounds: {
                    minZ: -size.depth / 2 + player.store.bar_depth / 2 + 0.15,
                    maxZ: size.depth / 2 - player.store.bar_depth / 2 - 0.185,
                },
                homeZ: 0,
                errorMargin: 0,
            }, keys);
        }
    },

    getPlayer(id: number): Player | undefined {
        return playerMap.get(id);
    },

    getStore(id: number) {
        const player = playerMap.get(id);
        return player ? player.store : undefined;
    },

    removePlayer(id: number) {
        const player = playerMap.get(id);
        if (player) {
            player.dispose();
            playerMap.delete(id);
        }
    },

    clearMap() {
        for (const player of playerMap.values()) {
            player.dispose();
        }
        playerMap.clear();
        disposeAI();
    },

    listPlayers(): Player[] {
        return Array.from(playerMap.values());
    },

    playerMap(): typeof playerMap {
        return playerMap;
    },

    clearLastHit() {
        for (const player of playerMap.values())
            player.store.last_hit = false;
    },

    resetPlayersPos() {
        for (const player of playerMap.values()) {
            player.resetPosition();
        }
    },

    resetPlayersScore() {
        for (const player of playerMap.values()) {
            player.store.score = 0;
        }
    }
};
