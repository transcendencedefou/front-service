import {
    AdvancedDynamicTexture,
} from '@babylonjs/gui';
import {CreateHomeButton} from "./CreateHomeButton.ts";
import { Scene } from '@babylonjs/core';
import GameController from "@/games/services/GameController.ts";

export default class TTTHUD {
    private hud: AdvancedDynamicTexture;
    private controller: GameController;

    constructor(scene: Scene, controller: GameController) {
        this.controller = controller;
        this.hud = AdvancedDynamicTexture.CreateFullscreenUI("PongUI", true, scene);
        this._initHud();
        this.hide();
    }

    _initHud(): void {
        this.hud.addControl(CreateHomeButton("Game selection",this.controller))
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
