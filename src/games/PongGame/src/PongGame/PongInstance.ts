import {
    ArcRotateCamera,
    Vector3,
    Color4, Mesh,
} from '@babylonjs/core';
import { GameContext } from '../GameContext.ts';
import { PlayerManager } from '../PlayerManager.ts';
import { setupSynthwaveScene } from '../meshes/setupSynthwaveScene.ts';
import { createPongPlaygroundMeshes } from "@/games/PongGame/src/meshes/createPongPlaygroundMeshes.ts";
import Ball from './Ball.ts';
import { useBallStore } from '@/stores/ballStore.ts'
import { updateAI } from './PongAIController.ts';
import {useGameStore} from "@/stores/gameStore.ts";

function handlePlayerInputs(): void {
    const player0 = PlayerManager.getPlayer(0)
    const player1 = PlayerManager.getPlayer(1)
    if (GameContext.running && !GameContext.game?.isEnded()) {
        if (GameContext.keysPressed['w']) player0?.moveUp();
        if (GameContext.keysPressed['s']) player0?.moveDown();
        if (GameContext.keysPressed['arrowup']) player1?.moveUp();
        if (GameContext.keysPressed['arrowdown']) player1?.moveDown();
    }
}

export default class PongInstance {
    private ball: Ball | null;
    private ended: boolean;
    private lastTime: number;
    private borders: Map<string, Mesh>;

    constructor() {
        useGameStore().game_type = 'pong'
        this.ball = null;
        this.ended = false;
        this.borders = new Map<string, Mesh>();
        this.lastTime = performance.now();
    }

    gameLoop(): void {
        const now = performance.now();
        const dt = now - this.lastTime;
        this.lastTime = now;

        for (let player of PlayerManager.listPlayers()) {
            if (player.store.score === 3) {
                if (useGameStore.winner !== player.store.name) {
                    useGameStore.winner = player.store.namez
                }
                this.ended = true;
            }
        }
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
        this.setBallDefaultSpeed(0.04);
        this.setBallMaxSpeed(0.12);
        this.setBallAcceleration(1.1);
        this.ball = new Ball();
        createPongPlaygroundMeshes();
    }

    isEnded(): boolean {
        return this.ended;
    }

    reset(): void {
        this.ended = false;
        this.ball?.reset();
        useGameStore().winner = null
        for (const player of PlayerManager.listPlayers()) {
            player.resetPosition();
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

    setBallDefaultSpeed(speed: number): void {
        useBallStore().setDefSpeed(speed)
    }

    setBallMaxSpeed(speed: number): void {
        useBallStore().setMaxSpeed(speed)
    }

    setBallAcceleration(speed: number): void {
        useBallStore().setAcceleration(speed)
    }

    setBorders(name: string,border: Mesh) {
        this.borders.set(name, border);
    }

    getBorder(name: string) {
        return this.borders.get(name);
    }

    getBallMesh() {
        return this.ball ? this.ball.getMesh() : null;
    }

    dispose(): void {
        this.ball?.dispose();
        this.ball = null;
        useGameStore().winner = null
        this.borders.forEach((mesh) => mesh.dispose());
        this.borders.clear();
    }
}
