import {
    ArcRotateCamera,
    Vector3,
} from '@babylonjs/core';
import { GameContext } from '../GameContext.ts';
import { PlayerManager } from '../PlayerManager.ts';
import {createTicTacToePlaygroundMeshes} from "@/games/PongGame/src/meshes/createTicTacToePlaygroundMeshes.ts";
import {useGameStore} from "@/stores/gameStore.ts";

function handlePlayerInputs(): void {
    //A edit

    // const player0 = PlayerManager.getPlayer(0)
    // const player1 = PlayerManager.getPlayer(1)
    // if (GameContext.running && !GameContext.game?.isEnded()) {

    // }
}

export default class TicTacToeInstance {
    private ended: boolean;
    private lastTime: number;

    constructor() {
        useGameStore().game_type = 'tictactoe';
        this.ended = false;
        this.lastTime = performance.now();
    }

    gameLoop(): void {
        const now = performance.now();
        const dt = now - this.lastTime; // for AI implementation
        this.lastTime = now;

        if (!this.ended) {
            handlePlayerInputs();
            if (GameContext.running) {
                this.ball?.move();
            }
        }
        GameContext.loopTimeoutId = window.setTimeout(() => this.gameLoop(), 1000 / 60);
    }

    _initSceneSettings(): void {
        const camera = new ArcRotateCamera('camera',
            -Math.PI / 2,
            Math.PI / 7,
            11,
            new Vector3(0, -1, 0),
            GameContext.scene!);
        // camera.inputs.clear();
        camera.attachControl(camera);
        GameContext.scene!.activeCamera = camera;
    }

    _initPlayGround(): void {
        createTicTacToePlaygroundMeshes();
    }

    isEnded(): boolean {
        return this.ended;
    }

    reset(): void {
        this.ended = false;
        for (const player of PlayerManager.listPlayers()) {
            // player.resetPosition();
        }
    }

    hardReset(): void {
        GameContext.running = false;
        PlayerManager.clearLastHit()
        for (const player of PlayerManager.listPlayers()) {
            player.store.setScore(0);
        }
        this.reset()
    }

    dispose(): void {
        // game meshes dispose && set to null
    }
}
