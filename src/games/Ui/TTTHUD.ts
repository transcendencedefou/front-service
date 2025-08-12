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

    constructor(scene: Scene, controller: GameController) {
        this.hud = AdvancedDynamicTexture.CreateFullscreenUI("TTTUI", true, scene);
        this.endMenu = new GameEndMenu(scene, controller);
        this._initHud();
        this._setupWinnerWatcher();
        this.hide();
    }

    _initHud(): void {
        const colors = useColorStore();
        // Scores
        PlayerManager.listPlayers().forEach(p => {
            const board = new Rectangle(`ttt-score-${p.store.id}`);
            board.width = '12%';
            board.height = '6%';
            board.thickness = 1;
            board.cornerRadius = 14;
            board.alpha = 0.9;
            board.color = '#ffffff';
            board.background = p.store.id === 0 ? colors.playerOneColor + '55' : colors.playerTwoColor + '55';
            board.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            board.horizontalAlignment = p.store.id === 0 ? Control.HORIZONTAL_ALIGNMENT_LEFT : Control.HORIZONTAL_ALIGNMENT_RIGHT;
            board.left = p.store.id === 0 ? '2%' : '-2%';
            board.top = '-2%';

            const txt = new TextBlock();
            txt.text = `${p.store.name}: ${p.store.score}`;
            txt.color = '#fff';
            txt.fontSize = '20px';
            board.onBeforeDrawObservable.add(() => {
                txt.text = `${p.store.name}: ${p.store.score}`;
            });
            board.addControl(txt);
            this.hud.addControl(board);
        });
    }

    private _setupWinnerWatcher(): void {
        const gameStore = useGameStore();
        this.winnerWatcher = watch(
            () => gameStore.winner,
            (winner: string | null) => {
                if (winner) {
                    // Petit délai pour que l'animation de victoire se termine
                    setTimeout(() => {
                        if (winner === 'Draw') {
                            this.endMenu.showWinner('', true);
                        } else {
                            this.endMenu.showWinner(winner);
                        }
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
