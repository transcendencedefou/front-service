import {useGameStore} from "@/stores/gameStore"; // chiant le chemin relatif trouver une solution
import {Engine, Scene} from "@babylonjs/core";

export const GameContext = {
    game: null,
    canvas: null,
    engine: null,
    scene: null,
    store: null,
    running: false,
    animationFrameId: null,
    keysPressed: {
        z: false,
        s: false,
        arrowup: false,
        arrowdown: false,
        ' ': false, //space
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

    startGame() {
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

        if (key in this.keysPressed.value) {
            this.keysPressed.value[key] = true
        }
    },

    handleKeyUp(event) {
        const key = event.key.toLowerCase()
        if (key in this.keysPressed.value) {
            this.keysPressed.value[key] = false
        }
    },

    dispose() {
        cancelAnimationFrame(this.animationFrameId)
        this.engine.stopRenderLoop();
        this.engine.dispose();
        this.scene.dispose();
    }
}