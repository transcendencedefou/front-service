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
import {usePongStore} from "@/stores/pongStore.js";

function handlePlayerInputs()
{
    if (GameContext.running) {
        if (GameContext.keysPressed[" "]) GameContext.stopGame()
        if (GameContext.keysPressed["z"]) PlayerManager.getPlayer(0).moveUp()
        if (GameContext.keysPressed["s"]) PlayerManager.getPlayer(0).moveDown()
    } else {
        if (GameContext.keysPressed[" "]) GameContext.startGame()
    }
}

export default class PongInstance {

    constructor() {
        this.ball = null
        this.border = new Map
    }

    gameLoop() {
        for (const player of PlayerManager.listPlayers())
            if (player.store.score === 3)
                GameContext.running = false
        handlePlayerInputs();
        GameContext.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    _initSceneSettings() {
        GameContext.scene.clearColor = new Color4(0.5, 0.8, 0.5, 1.0);

        const camera = new ArcRotateCamera("camera",
            -Math.PI / 2,
            Math.PI / 5,
            10,
            new Vector3(0, -1, 0),
            GameContext.scene);
        camera.inputs.clear();

        const light = new HemisphericLight("light",
            new Vector3(0, 1, -2),
            GameContext.scene);
        light.intensity = 0.9;
    }

    _initPlayGround() {
        const groundMaterial = new StandardMaterial("groundMaterial", GameContext.scene);
        groundMaterial.diffuseColor = new Color3(0.4, 0, 1);

        const playground = MeshBuilder.CreateGround("ground",
            { width: 9, height: 6 },
            GameContext.scene);
        playground.material = groundMaterial;

        const verticalBorderMaterial = new StandardMaterial("verticalBorderMaterial", GameContext.scene);
        verticalBorderMaterial.diffuseColor = new Color3(0.8, 0.2, 0.2);
        verticalBorderMaterial.alpha = 0.5;
        verticalBorderMaterial.hasAlpha = true;


        const horizontalBorderMaterial = new StandardMaterial("horizontalBorderMaterial", GameContext.scene);
        horizontalBorderMaterial.diffuseColor = new Color3(0.2, 0.6, 1);
        horizontalBorderMaterial.alpha = 0.5;
        horizontalBorderMaterial.hasAlpha = true;
        
        
        const leftBorder = MeshBuilder.CreateBox("leftBorder",
            { width: 0.1, height: 0.1, depth: 6, updatable: true },
            GameContext.scene);
        leftBorder.position.y = 0.05;
        leftBorder.position.z = 0;
        leftBorder.position.x = -playground._width / 2 - 0.05;
        leftBorder.material = verticalBorderMaterial;
        this.border.set("leftborder", leftBorder)

        const rightBorder = MeshBuilder.CreateBox("rightBorder",
            { width: 0.1, height: 0.1, depth: 6, updatable: true },
            GameContext.scene);
        rightBorder.position.y = 0.05;
        rightBorder.position.z = 0;
        rightBorder.position.x = playground._width / 2 + 0.05;
        rightBorder.material = verticalBorderMaterial;
        this.border.set("rightborder", rightBorder)

        const upBorder = MeshBuilder.CreateBox("upBorder",
            { width: 9, height: 0.1, depth: 0.1, updatable: true },
            GameContext.scene);
        upBorder.position.y = 0.05;
        upBorder.position.z = playground._height / 2 + 0.05;
        upBorder.position.x = 0;
        upBorder.material = horizontalBorderMaterial;
        this.border.set("upborder", upBorder)
        
        const downBorder = MeshBuilder.CreateBox("downBorder",
            { width: 9, height: 0.1, depth: 0.1, updatable: true },
            GameContext.scene);
        downBorder.position.y = 0.05;
        downBorder.position.z = -playground._height / 2 - 0.05;
        downBorder.position.x = 0;
        downBorder.material = horizontalBorderMaterial;
        this.border.set("downborder", downBorder)
    }


    dispose() {
        GameContext.engine.stopRenderLoop();
        GameContext.engine.dispose();
        GameContext.scene.dispose();
    }
}
