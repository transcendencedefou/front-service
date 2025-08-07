import {
    ArcRotateCamera,
    Vector3,
    Color4,
} from '@babylonjs/core';
import { GameContext } from './GameContext';
import { PlayerManager } from './PlayerManager';
import { setupSynthwaveScene } from './meshes/setupSynthwaveScene.ts';
import { createPlaygroundMeshes } from "@/games/PongGame/src/meshes/createPlaygroundMeshes.ts";
import Ball from './Ball';

function handlePlayerInputs(): void {
    if (GameContext.running && !GameContext.game?.isEnded()) {
        if (GameContext.keysPressed[' ']) GameContext.stopGame();
        if (GameContext.keysPressed['w']) PlayerManager.getPlayer(0)?.moveUp();
        if (GameContext.keysPressed['s']) PlayerManager.getPlayer(0)?.moveDown();
        if (GameContext.keysPressed['arrowup']) PlayerManager.getPlayer(1)?.moveUp();
        if (GameContext.keysPressed['arrowdown']) PlayerManager.getPlayer(1)?.moveDown();
    } else {
        if (GameContext.keysPressed[' ']) GameContext.startGame();
    }
}

export default class PongInstance {
    private ball: Ball | null;
    private ended: boolean;

    constructor() {
        this.ball = null;
        this.ended = false;
    }

    gameLoop(): void {
        for (let player of PlayerManager.listPlayers()) {
            if (player.store.score === 3) {
                this.ended = true;
            }
        }
        if (!this.ended) {
            handlePlayerInputs();
            if (GameContext.running) {
                this.ball?.move();
            }
        }
        GameContext.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    _initSceneSettings(): void {
        GameContext.scene!.clearColor = new Color4(1, 1, 1, 0);

        const camera = new ArcRotateCamera('camera',
            -Math.PI / 2,
            Math.PI / 7,
            11,
            new Vector3(0, -1, 0),
            GameContext.scene!);
        camera.inputs.clear();
        GameContext.scene!.activeCamera = camera;

        setupSynthwaveScene(GameContext.scene!);
    }

    _initPlayGround(): void {
        this.ball = new Ball();
        createPlaygroundMeshes();
    }

    isEnded(): boolean {
        return this.ended;
    }

    reset(): void {
        this.ended = false;
        this.ball?.reset();
        for (const player of PlayerManager.listPlayers()) {
            player.resetPosition();
        }
    }

    hardReset(): void {
        GameContext.running = false;
        PlayerManager.clearLastHit()
        for (const player of PlayerManager.listPlayers()) {
            player.store.setScore(0);
            player.resetPosition();
        }
        this.reset()
    }
}
