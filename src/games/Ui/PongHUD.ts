import {
    AdvancedDynamicTexture,
} from '@babylonjs/gui';
import { PlayerManager } from "../Players/PlayerManager.ts";
import { CreatePlayerBoard } from "./CreatePlayerBoard.ts"
import { CreateControlsOverlay } from "./CreateControlsOverlay.ts";
import { CreateHomeButton } from "./CreateHomeButton.ts";
import { Scene } from '@babylonjs/core';
import GameController from "@/games/services/GameController.ts";

export default class PongHUD {
    private hud: AdvancedDynamicTexture;
    private controller: GameController;
    private t: (k: string) => string

    constructor(scene: Scene, controller: GameController, t: (k: string) => string) {
        this.controller = controller;
        this.t = t;
        this.hud = AdvancedDynamicTexture.CreateFullscreenUI("PongUI", true, scene);
        this._initHud(scene);
        this.hide();
    }

    _initHud(scene: Scene): void {
        for (const [, player] of PlayerManager.playerMap())
            this.hud.addControl(CreatePlayerBoard(player, scene))
        this.hud.addControl(CreateControlsOverlay(this.t))
    }

    show(): void {
        this.hud.rootContainer.isVisible = true;
    }

    hide(): void {
        this.hud.rootContainer.isVisible = false;
    }

    dispose(): void {
        this.hud.dispose();
    }
}
