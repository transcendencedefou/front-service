import { useGameStore } from "@/stores/gameStore";
import { PlayerManager } from "./PlayerManager.js";
import {Engine, Scene} from "@babylonjs/core";

export const GameContext = {
    game: null,
    canvas: null,
    engine: null,
    scene: null,
    store: null,
    running: false,
    animationFrameId: null,
    size: {height: 0, width: 0},
    keysPressed: {
        z: false,
        s: false,
        arrowup: false,
        arrowdown: false,
        ' ': false,
        r: false
    },
    _initGameContext(game, canvas) {
        this.game = game
        this.canvas = canvas
        this.engine = new Engine(canvas, true)
        this.scene = new Scene(this.engine);
        this.store = useGameStore()
        this._initGameTextures(game, canvas);
    },

    _initGameTextures() {
        this.game._initSceneSettings()
        this.game._initPlayGround()
    },

    setSize(width, height) {
        this.size.width = width;
        this.size.height = height;
    },

    startGame() {
        if (PlayerManager.listPlayers().length === 2)
            this.running = true;
    },

    stopGame() {
        this.running = false;
    },

    resetGame() {
        //all reset methodes
        this.running = false;
    },

    _render() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    },

    handleKeyDown(event) {
        const key = event.key.toLowerCase()

        if (key in this.keysPressed) {
            this.keysPressed[key] = true
        }
    },

    handleKeyUp(event) {
        const key = event.key.toLowerCase()
        if (key in this.keysPressed) {
            this.keysPressed[key] = false
        }
    },

    dispose() {
        cancelAnimationFrame(this.animationFrameId)
        this.engine.stopRenderLoop();
        this.engine.dispose();
        this.scene.dispose();
    }
}