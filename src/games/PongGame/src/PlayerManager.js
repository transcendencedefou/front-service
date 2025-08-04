import { Player } from './Player.js'

const playerMap = new Map()

export const PlayerManager = {
    addPlayer(id, name) {
        id = playerMap.size
        const player = new Player(id, name)
        playerMap.set(id, player)
    },

    getPlayer(id) {
        return playerMap.get(id)
    },

    getStore(id) {
        const player = playerMap.get(id)
        return player ? player.store : undefined
    },

    removePlayer(id) {
        playerMap.delete(id)
    },

    listPlayers() {
        return Array.from(playerMap.values())
    }
}
