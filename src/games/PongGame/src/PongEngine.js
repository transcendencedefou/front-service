import {
    Engine,
    Scene,
    ArcRotateCamera,
    HemisphericLight,
    MeshBuilder,
    Vector3,
    Color3,
    Color4,
    StandardMaterial,
} from '@babylonjs/core';

// Class representing the Pong game engine
// It initializes the scene, camera, lights, and playground
// It also creates the win surfaces and borders for the game
// The engine runs the render loop to continuously update the scene
export default class PongEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.engine = new Engine(canvas, true);
        this.scene = new Scene(this.engine);
        this._init();
        this._render();
    }

    _init() {
        const scene = this.scene;
        scene.clearColor = new Color4(0.5, 0.8, 0.5, 1.0);

        const camera = new ArcRotateCamera("camera",
            -Math.PI / 2,
            Math.PI / 5,
            10,
            new Vector3(0, -1, 0),
            scene);
        camera.inputs.clear();

        const light = new HemisphericLight("light",
            new Vector3(0, 1, -2),
            scene);
        light.intensity = 0.9;

        this._initPlayGround();
    }

    _initPlayGround() {
        const groundMaterial = new StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseColor = new Color3(0.4, 0, 1);

        const playground = MeshBuilder.CreateGround("ground",
            { width: 9, height: 6 },
            this.scene);
        playground.material = groundMaterial;

        const winsurfaceMaterial = new StandardMaterial("winsurfaceMaterial", this.scene);
        winsurfaceMaterial.diffuseColor = new Color3(0.8, 0.2, 0.2);
        winsurfaceMaterial.alpha = 0.5;
        winsurfaceMaterial.hasAlpha = true;

        this.winSurfaceLeft = MeshBuilder.CreateBox("winSurfaceLeft",
            { width: 0.1, height: 0.1, depth: 6, updatable: true },
            this.scene);
        this.winSurfaceLeft.position.y = 0.05;
        this.winSurfaceLeft.position.z = 0;
        this.winSurfaceLeft.position.x = -playground._width / 2 - 0.05;
        this.winSurfaceLeft.material = winsurfaceMaterial;

        this.winSurfaceRight = MeshBuilder.CreateBox("winSurfaceRight",
            { width: 0.1, height: 0.1, depth: 6, updatable: true },
            this.scene);
        this.winSurfaceRight.position.y = 0.05;
        this.winSurfaceRight.position.z = 0;
        this.winSurfaceRight.position.x = playground._width / 2 + 0.05;
        this.winSurfaceRight.material = winsurfaceMaterial;

        const borderMaterial = new StandardMaterial("borderMaterial", this.scene);
        borderMaterial.diffuseColor = new Color3(0.2, 0.6, 1);
        borderMaterial.alpha = 0;
        borderMaterial.hasAlpha = true;

        this.upBorder = MeshBuilder.CreateBox("border",
            { width: 9, height: 0.1, depth: 0.1, updatable: true },
            this.scene);
        this.upBorder.position.y = 0.05;
        this.upBorder.position.z = playground._height / 2 + 0.05;
        this.upBorder.position.x = 0;
        this.upBorder.material = borderMaterial;

        this.downBorder = MeshBuilder.CreateBox("border",
            { width: 9, height: 0.1, depth: 0.1, updatable: true },
            this.scene);
        this.downBorder.position.y = 0.05;
        this.downBorder.position.z = -playground._height / 2 - 0.05;
        this.downBorder.position.x = 0;
        this.downBorder.material = borderMaterial;
    }

    _render() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    dispose() {
        this.engine.stopRenderLoop();
        this.scene.dispose();
        this.engine.dispose();
    }
}
