import { Player } from './Player';

const playerMap: Map<number, Player> = new Map();

export const PlayerManager = {

    addPlayer(name: string) {
        const id = playerMap.size;
        const player = new Player(id, name);
        playerMap.set(id, player);
    },

    getPlayer(id: number): Player | undefined {
        return playerMap.get(id);
    },

    getStore(id: number) {
        const player = playerMap.get(id);
        return player ? player.store : undefined;
    },

    removePlayer(id: number) {
        playerMap.delete(id);
    },

    clearMap() {
        playerMap.clear();
    },

    listPlayers(): Player[] {
        return Array.from(playerMap.values());
    },
};
