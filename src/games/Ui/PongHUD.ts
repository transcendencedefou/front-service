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

    constructor(scene: Scene, controller: GameController) {
        this.controller = controller;
        this.hud = AdvancedDynamicTexture.CreateFullscreenUI("PongUI", true, scene);
        this._initHud(scene);
        this.hide();
    }

    _initHud(scene: Scene): void {
        for (const [, player] of PlayerManager.playerMap())
            this.hud.addControl(CreatePlayerBoard(player, scene))
        this.hud.addControl(CreateControlsOverlay())
        const homeBtn = CreateHomeButton("Game selection",this.controller);
        this.hud.addControl(homeBtn);
        if (localStorage.getItem('currentTournamentMatch')) {
            homeBtn.isVisible = false;
        }
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
