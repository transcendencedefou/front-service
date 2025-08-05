import {
    ArcRotateCamera,
    HemisphericLight,
    MeshBuilder,
    Vector3,
    Color3,
    Color4,
    StandardMaterial,
} from '@babylonjs/core';
import {GameContext} from "./GameContext.js";
import {PlayerManager} from "./PlayerManager.js";
import Ball from "@/games/PongGame/src/Ball.js";

function handlePlayerInputs()
{
    // Keyboard Inputs
    if (GameContext.running) {
        if (GameContext.keysPressed[" "]) {
            GameContext.stopGame()
            console.log(GameContext.running)
            console.log(GameContext.keysPressed[" "]);
        }
        if (GameContext.keysPressed["z"]) PlayerManager.getPlayer(0).moveUp()
        if (GameContext.keysPressed["s"]) PlayerManager.getPlayer(0).moveDown()
        if (GameContext.keysPressed["arrowup"]) PlayerManager.getPlayer(1).moveUp()
        if (GameContext.keysPressed["arrowdown"]) PlayerManager.getPlayer(1).moveDown()
    } else {
        if (GameContext.keysPressed[" "]) GameContext.startGame()
    }
}

export default class PongInstance {

    constructor() {
        this.ball = null;
    }

    gameLoop() {

        for (const player of PlayerManager.listPlayers())
            if (player.store.score === 3)
                GameContext.running = false
        handlePlayerInputs();
        if (GameContext.running) {
            this.ball?.move();
        }

        GameContext.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    _initSceneSettings() {
        GameContext.scene.clearColor = new Color4(0.9, 0.7, 0, 1);

        const camera = new ArcRotateCamera("camera",
            -Math.PI / 2,
            Math.PI / 6,
            10,
            new Vector3(0, -1, 0),
            GameContext.scene);
        camera.inputs.clear();

        const light = new HemisphericLight("light",
            new Vector3(-1, 3, 0),
            GameContext.scene);
        light.intensity = 0.9;
    }

    _initPlayGround() {
        GameContext.borders = new Map
        this.ball = new Ball();

        const groundMaterial = new StandardMaterial("groundMaterial", GameContext.scene);
        groundMaterial.diffuseColor = new Color3(0.4, 0, 1);

        const playground = MeshBuilder.CreateGround("ground",
            { width: GameContext.size["width"], height: GameContext.size["depth"] },
            GameContext.scene);
        playground.material = groundMaterial;

        const verticalBorderMaterial = new StandardMaterial("verticalBorderMaterial", GameContext.scene);
        verticalBorderMaterial.diffuseColor = new Color3(0.8, 0.2, 0.2);
        verticalBorderMaterial.alpha = 1;
        verticalBorderMaterial.hasAlpha = true;


        const horizontalBorderMaterial = new StandardMaterial("horizontalBorderMaterial", GameContext.scene);
        horizontalBorderMaterial.diffuseColor = new Color3(0.2, 0.6, 1);
        horizontalBorderMaterial.alpha = 1;
        horizontalBorderMaterial.hasAlpha = true;
        
        
        const leftBorder = MeshBuilder.CreateBox("leftBorder",
            { width: 0.1, height: 0.1, depth: playground._height, updatable: true },
            GameContext.scene);
        leftBorder.position.y = 0.05;
        leftBorder.position.z = 0;
        leftBorder.position.x = -playground._width / 2 - 0.05;
        leftBorder.material = verticalBorderMaterial;
        GameContext.borders.set("left", leftBorder)

        const rightBorder = MeshBuilder.CreateBox("rightBorder",
            { width: 0.1, height: 0.1, depth: playground._height, updatable: true },
            GameContext.scene);
        rightBorder.position.y = 0.05;
        rightBorder.position.z = 0;
        rightBorder.position.x = playground._width / 2 + 0.05;
        rightBorder.material = verticalBorderMaterial;
        GameContext.borders.set("right", rightBorder)

        const upBorder = MeshBuilder.CreateBox("upBorder",
            { width: playground._width, height: 0.1, depth: 0.1, updatable: true },
            GameContext.scene);
        upBorder.position.y = 0.05;
        upBorder.position.z = playground._height / 2 + 0.05;
        upBorder.position.x = 0;
        upBorder.material = horizontalBorderMaterial;
        GameContext.borders.set("up", upBorder)
        
        const downBorder = MeshBuilder.CreateBox("downBorder",
            { width: playground._width, height: 0.1, depth: 0.1, updatable: true },
            GameContext.scene);
        downBorder.position.y = 0.05;
        downBorder.position.z = -playground._height / 2 - 0.05;
        downBorder.position.x = 0;
        downBorder.material = horizontalBorderMaterial;
        GameContext.borders.set("down", downBorder)
    }

    reset() {
        this.ball.reset()
        for (const player of PlayerManager.listPlayers()) { player.resetPosition() }
    }

    hardReset() {
        //avec le reset des scores aussi
    }

    dispose() {
        GameContext.engine.stopRenderLoop();
        GameContext.engine.dispose();
        GameContext.scene.dispose();
    }
}
