import { Player } from './Player';
import { initAI, dispose as disposeAI } from './PongGame/PongAIController.ts';
import { GameContext } from './GameContext';
import {useGameStore} from "@/stores/gameStore.ts";

const playerMap: Map<number, Player> = new Map();

export const PlayerManager = {

    addPlayer(name: string) {
        const id = playerMap.size;
        const player = new Player(id, name);
        playerMap.set(id, player);
    },

    addAI(name: string) {
        const id = playerMap.size;
        const player = new Player(id, name);
        let ballMesh = null;
        playerMap.set(id, player);
        if (useGameStore().game_type == "pong")
            ballMesh = GameContext.game?.getBallMesh();
        if (ballMesh && player.bar) {
            initAI({
                ballMesh,
                paddleMesh: player.bar,
                xAI: player.bar.position.x,
                bounds: {
                    minZ: -GameContext.size.depth / 2 + player.store.bar_depth / 2 + 0.15,
                    maxZ: GameContext.size.depth / 2 - player.store.bar_depth / 2 - 0.185,
                },
                homeZ: 0,
                errorMargin: 0,
            });
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
    }
};
