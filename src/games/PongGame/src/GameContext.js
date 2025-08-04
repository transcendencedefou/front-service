import { PlayerManager } from "PlayerManager.js";
import { useGameStore } from "../../../stores/gameStore"; // chiant le chemin relatif trouver une solution
import {Engine, Scene} from "@babylonjs/core";

export const GameContext = {
    game: null,
    canvas: null,
    engine: null,
    scene: null,
    game_store: null,

    _initGameContext(game, canvas) {
        this.game = game
        this.canvas = canvas
        this.engine = new Engine(canvas, true)
        this.scene = new Scene(this.engine);
        this.game_store = useGameStore()
    }
}