import {
    AdvancedDynamicTexture,
    Rectangle,
    TextBlock,
    Control
} from '@babylonjs/gui';
import { Scene } from '@babylonjs/core';
import { PlayerManager } from '@/games/Players/PlayerManager.ts';
import { useColorStore } from '@/stores/colorStore';

export default class TTTHUD {
    private hud: AdvancedDynamicTexture;

    constructor(scene: Scene) {
        this.hud = AdvancedDynamicTexture.CreateFullscreenUI("TTTUI", true, scene);
        this._initHud();
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
