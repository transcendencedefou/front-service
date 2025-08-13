import {
    AdvancedDynamicTexture,
    Rectangle,
    TextBlock,
    Control
} from '@babylonjs/gui';
import { Scene } from '@babylonjs/core';
import { PlayerManager } from '@/games/Players/PlayerManager.ts';
import { useColorStore } from '@/stores/colorStore';
import GameEndMenu from "./GameEndMenu.ts";
import GameController from "@/games/services/GameController.ts";
import { useGameStore } from '@/stores/gameStore';
import { watch } from 'vue';

export default class TTTHUD {
    private hud: AdvancedDynamicTexture;
    private endMenu: GameEndMenu;
    private winnerWatcher: (() => void) | null = null;
    private currentPlayerIndicator: TextBlock | null = null;

    constructor(scene: Scene, controller: GameController) {
        this.hud = AdvancedDynamicTexture.CreateFullscreenUI("TTTUI", true, scene);
        this.endMenu = new GameEndMenu(scene, controller);
        this._initHud();
        this._setupWinnerWatcher();
        this.hide();
    }

    _initHud(): void {
        
        // Current Player Indicator
        this._createCurrentPlayerIndicator();
    }

    private _createCurrentPlayerIndicator(): void {
        const colors = useColorStore();
        
        // Container for current player indicator
        const container = new Rectangle('current-player-container');
        container.width = '25%';
        container.height = '8%';
        container.thickness = 2;
        container.cornerRadius = 16;
        container.alpha = 0.95;
        container.color = '#ffffff';
        container.background = '#000000aa';
        container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        container.top = '2%';

        this.currentPlayerIndicator = new TextBlock('current-player-text');
        
        // Initialize with first player's real name if available
        const firstPlayer = PlayerManager.getPlayer(0);
        if (firstPlayer) {
            this.currentPlayerIndicator.text = `Tour de ${firstPlayer.store.name}`;
        } else {
            this.currentPlayerIndicator.text = 'Tour du Joueur 1';
        }
        
        this.currentPlayerIndicator.color = colors.playerOneColor;
        this.currentPlayerIndicator.fontSize = '24px';
        this.currentPlayerIndicator.fontWeight = 'bold';
        this.currentPlayerIndicator.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.currentPlayerIndicator.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

        container.addControl(this.currentPlayerIndicator);
        this.hud.addControl(container);
    }

    updateCurrentPlayer(playerIndex: number): void {
        if (!this.currentPlayerIndicator) return;
        
        const colors = useColorStore();
        const player = PlayerManager.getPlayer(playerIndex);
        
        if (player) {
            this.currentPlayerIndicator.text = `Tour de ${player.store.name}`;
            this.currentPlayerIndicator.color = playerIndex === 0 ? colors.playerOneColor : colors.playerTwoColor;
        } else {
            this.currentPlayerIndicator.text = `Tour du Joueur ${playerIndex + 1}`;
            this.currentPlayerIndicator.color = playerIndex === 0 ? colors.playerOneColor : colors.playerTwoColor;
        }
    }

    refreshDisplay(): void {
        // Clear existing HUD elements
        this.hud.rootContainer.clearControls();
        
        // Recreate HUD with current players
        this._createCurrentPlayerIndicator();
        
        // Initialize current player indicator with first player
        this.updateCurrentPlayer(0);
    }

    private _setupWinnerWatcher(): void {
        const gameStore = useGameStore();
        this.winnerWatcher = watch(
            () => gameStore.winner,
            (winner: string | null) => {
                if (winner && winner !== 'Draw') {
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
