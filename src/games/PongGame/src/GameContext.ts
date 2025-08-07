import { useGameStore } from "@/stores/gameStore";
import { PlayerManager } from "./PlayerManager";
import { Engine, Scene, Mesh } from "@babylonjs/core";
import type PongInstance from "./PongInstance";

interface Size {
    depth: number;
    width: number;
}

interface GameContextType {
    game: PongInstance | null;
    canvas: HTMLCanvasElement | null;
    engine: Engine | null;
    scene: Scene | null;
    borders: Map<string, Mesh>;
    store: ReturnType<typeof useGameStore> | null;
    running: boolean;
    animationFrameId: number | null;
    size: Size;
    keysPressed: Record<string, boolean>;
    _initGameContext(game: PongInstance, canvas: HTMLCanvasElement): void;
    _initGameTextures(): void;
    setSize(width: number, depth: number): void;
    startGame(): void;
    stopGame(): void;
    resetGame(event: KeyboardEvent): void;
    _render(): void;
    handleKeyDown(event: KeyboardEvent): void;
    switchRunningState(event: KeyboardEvent): void;
    handleKeyUp(event: KeyboardEvent): void;
    dispose(): void;
}

export const GameContext: GameContextType = {
    game: null,
    canvas: null,
    engine: null,
    scene: null,
    borders: new Map<string, Mesh>(),
    store: null,
    running: false,
    animationFrameId: null,
    size: { depth: 0, width: 0 },
    keysPressed: {
        w: false,
        s: false,
        arrowup: false,
        arrowdown: false,
        r: false,
    },

    _initGameContext(game: PongInstance, canvas: HTMLCanvasElement) {
        this.game = game;
        this.canvas = canvas;
        this.engine = new Engine(canvas, true);
        this.scene = new Scene(this.engine);
        this.store = useGameStore();
        this._initGameTextures();
    },

    _initGameTextures() {
        this.game!._initSceneSettings();
        this.game!._initPlayGround();
    },

    setSize(width: number, depth: number) {
        this.size.width = width;
        this.size.depth = depth;
    },

    startGame() {
        if (PlayerManager.listPlayers().length === 2) {
            this.running = true;
        }
    },

    stopGame() {
        this.running = false;
    },

    resetGame(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        if (key === "r") {
            this.game?.reset();
        }
    },

    _render() {
        this.engine?.runRenderLoop(() => {
            this.scene?.render();
        });
    },

    handleKeyDown(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        if (key in this.keysPressed) {
            this.keysPressed[key] = true;
        }
    },

    switchRunningState(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        if (key === " ") {
            GameContext.running = !GameContext.running;
        }
        if (key === "r") {
            GameContext.game?.reset()
            GameContext.running = false;
        }
    },

    handleKeyUp(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        if (key in this.keysPressed) {
            this.keysPressed[key] = false;
        }
    },

    dispose() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.engine?.stopRenderLoop();
        this.engine?.dispose();
        this.scene?.dispose();
    },
};