import {
    AdvancedDynamicTexture,
} from '@babylonjs/gui';
import { PlayerManager } from "../Players/PlayerManager.ts";
import { CreatePlayerBoard } from "./CreatePlayerBoard.ts"
import { CreateControlsOverlay } from "./CreateControlsOverlay.ts";
import { CreateHomeButton } from "./CreateHomeButton.ts";
import { Scene } from '@babylonjs/core';
import GameController from "@/games/services/GameController.ts";
import GameEndMenu from "./GameEndMenu.ts";
import { useGameStore } from '@/stores/gameStore';
import { watch } from 'vue';

export default class PongHUD {
    private hud: AdvancedDynamicTexture;
    private controller: GameController;
    private t: (k: string) => string;
    private endMenu: GameEndMenu;
    private winnerWatcher: (() => void) | null = null;

    constructor(scene: Scene, controller: GameController, t: (k: string) => string) {
        this.controller = controller;
        this.t = t;
        this.hud = AdvancedDynamicTexture.CreateFullscreenUI("PongUI", true, scene);
        this.endMenu = new GameEndMenu(scene, controller);
        this._initHud(scene);
        this._setupWinnerWatcher();
        this.hide();
    }

    _initHud(scene: Scene): void {
        for (const [, player] of PlayerManager.playerMap())
            this.hud.addControl(CreatePlayerBoard(player, scene))
        this.hud.addControl(CreateControlsOverlay(this.t))
    }

    private _setupWinnerWatcher(): void {
        const gameStore = useGameStore();
        this.winnerWatcher = watch(
            () => gameStore.winner,
            (winner: string | null) => {
                if (winner) {
                    // Petit délai pour que l'animation de victoire se termine
                    setTimeout(() => {
                        this.endMenu.showWinner(winner);
                    }, 1000);
                }
            }
        );
    }

    show(): void {
        this.hud.rootContainer.isVisible = true;
    }

    hide(): void {
        this.hud.rootContainer.isVisible = false;
    }

    dispose(): void {
        if (this.winnerWatcher) {
            this.winnerWatcher();
            this.winnerWatcher = null;
        }
        this.endMenu.dispose();
        this.hud.dispose();
    }
}
