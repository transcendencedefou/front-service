import {
    ArcRotateCamera,
    MeshBuilder,
    Vector3,
    Color3,
    Color4,
    StandardMaterial,
    Mesh,
} from '@babylonjs/core';
import { GameContext } from './GameContext';
import { PlayerManager } from './PlayerManager';
import { setupSynthwaveScene } from './setupSynthwaveScene';
import Ball from './Ball';

function handlePlayerInputs(): void {
    // Keyboard Inputs
    if (GameContext.running) {
        if (GameContext.keysPressed[' ']) {
            GameContext.stopGame();
            console.log(GameContext.running);
            console.log(GameContext.keysPressed[' ']);
        }
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

    constructor() {
        this.ball = null;
    }

    gameLoop(): void {
        for (const player of PlayerManager.listPlayers()) {
            if (player.store.score === 3) {
                GameContext.running = false;
            }
        }
        handlePlayerInputs();
        if (GameContext.running) {
            this.ball?.move();
        }

        GameContext.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    _initSceneSettings(): void {
        GameContext.scene!.clearColor = new Color4(1, 1, 1, 0);

        const camera = new ArcRotateCamera('camera',
            -Math.PI / 2,
            Math.PI / 7,
            10,
            new Vector3(0, -1, 0),
            GameContext.scene!);
        // camera.inputs.clear();
        camera.attachControl(camera);
        GameContext.scene!.activeCamera = camera;

        setupSynthwaveScene(GameContext.scene!);
    }

    _initPlayGround(): void {
        GameContext.borders = new Map<string, Mesh>();
        this.ball = new Ball();

        const groundMaterial = new StandardMaterial('groundMaterial', GameContext.scene!);
        groundMaterial.emissiveColor = Color3.Black();
        groundMaterial.alpha = 0.95;

        const playground = MeshBuilder.CreateGround('ground',
            { width: GameContext.size.width, height: GameContext.size.depth },
            GameContext.scene!);
        playground.material = groundMaterial;


        const centerLineMaterial = new StandardMaterial("lineMat", GameContext.scene!);
        centerLineMaterial.emissiveColor = Color3.White();
        centerLineMaterial.alpha = 0.5;

        const centerLine = MeshBuilder.CreatePlane("centerLine", {
            width: 0.1,
            height: GameContext.size.depth,
        }, GameContext.scene!);
        centerLine.position = new Vector3(0, 0.01, 0);
        centerLine.rotation.x = Math.PI / 2;
        centerLine.material = centerLineMaterial;


        const verticalBorderMaterial = new StandardMaterial('verticalBorderMaterial', GameContext.scene!);
        verticalBorderMaterial.diffuseColor = new Color3(0.8, 0.01, 0.2);
        verticalBorderMaterial.alpha = 0;
        verticalBorderMaterial.hasAlpha = true;

        const horizontalBorderMaterial = new StandardMaterial('horizontalBorderMaterial', GameContext.scene!);
        horizontalBorderMaterial.emissiveColor = Color3.White();
        horizontalBorderMaterial.alpha = 0.95;
        horizontalBorderMaterial.hasAlpha = true;

        const leftBorder = MeshBuilder.CreateBox('leftBorder',
            { width: 0.1, height: 0.01, depth: playground._height + 0.1, updatable: true },
            GameContext.scene!);
        leftBorder.position.z = 0;
        leftBorder.position.x = -playground._width / 2 - 0.05;
        leftBorder.material = horizontalBorderMaterial;
        GameContext.borders.set('left', leftBorder);

        const rightBorder = MeshBuilder.CreateBox('rightBorder',
            { width: 0.1, height: 0.01, depth: playground._height + 0.1, updatable: true },
            GameContext.scene!);
        rightBorder.position.z = 0;
        rightBorder.position.x = playground._width / 2 + 0.05;
        rightBorder.material = horizontalBorderMaterial;
        GameContext.borders.set('right', rightBorder);

        const upBorder = MeshBuilder.CreateBox('upBorder',
            { width: playground._width, height: 0.01, depth: 0.1, updatable: true },
            GameContext.scene!);
        upBorder.position.z = playground._height / 2;
        upBorder.position.x = 0;
        upBorder.material = horizontalBorderMaterial;
        GameContext.borders.set('up', upBorder);

        const downBorder = MeshBuilder.CreateBox('downBorder',
            { width: playground._width, height: 0.01, depth: 0.1, updatable: true },
            GameContext.scene!);
        downBorder.position.z = -playground._height / 2;
        downBorder.position.x = 0;
        downBorder.material = horizontalBorderMaterial;
        GameContext.borders.set('down', downBorder);
    }

    getBall (): any {
        return this.ball
    }

    reset(): void {
        this.ball?.reset();
        for (const player of PlayerManager.listPlayers()) {
            player.resetPosition();
            player.store.score = 0;
        }
    }

    hardReset(): void {
        // avec le reset des scores aussi
    }

    dispose(): void {
        GameContext.engine?.stopRenderLoop();
        GameContext.engine?.dispose();
        GameContext.scene?.dispose();
    }
}
