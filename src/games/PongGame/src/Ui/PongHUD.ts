import {
    AdvancedDynamicTexture,
} from 'babylonjs-gui';
import { PlayerManager } from "../PlayerManager";
import { GameContext } from "@/games/PongGame/src/GameContext.ts";
import { CreatePlayerBoard } from "./CreatePlayerBoard.ts"
import { CreateControlsOverlay } from "./CreateControlsOverlay.ts";

export default class PongHUD {
    private hud: AdvancedDynamicTexture;

    constructor() {
        this.hud = AdvancedDynamicTexture.CreateFullscreenUI("PongUI", true, GameContext.scene);
        this._initHud()
    }

    _initHud(): void {
        for (const [, player] of PlayerManager.playerMap())
            this.hud.addControl(CreatePlayerBoard(player))
        this.hud.addControl(CreateControlsOverlay())
    }
}
