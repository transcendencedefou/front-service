import {
    AdvancedDynamicTexture,
    Rectangle,
    TextBlock,
    Control,
    Button
} from '@babylonjs/gui';
import { Scene } from '@babylonjs/core';
import { useColorStore } from '@/stores/colorStore';
import GameController from "@/games/services/GameController.ts";
import router from "@/router";

function AnimateButton(btn: Button, scale: number): void {
    btn.onPointerEnterObservable.add(() => {
        btn.scaleX = scale;
        btn.scaleY = scale;
    });
    btn.onPointerOutObservable.add(() => {
        btn.scaleX = 1;
        btn.scaleY = 1;
    });
}

export default class GameEndMenu {
    private hud: AdvancedDynamicTexture;
    private mainPanel: Rectangle;
    private controller: GameController;
    constructor(scene: Scene, controller: GameController) {
        this.controller = controller;
        this.hud = AdvancedDynamicTexture.CreateFullscreenUI("GameEndUI", true, scene);
        this._initHud();
        this.hide();
    }

    private _initHud(): void {
        const colors = useColorStore();

        // Panel principal semi-transparent
        this.mainPanel = new Rectangle();
        this.mainPanel.width = '100%';
        this.mainPanel.height = '100%';
        this.mainPanel.thickness = 0;
        this.mainPanel.alpha = 0.8;
        this.mainPanel.background = '#000000';
        this.mainPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.mainPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.hud.addControl(this.mainPanel);

        // Panel de contenu
        const contentPanel = new Rectangle();
        contentPanel.width = '50%';
        contentPanel.height = '60%';
        contentPanel.cornerRadius = 20;
        contentPanel.thickness = 3;
        contentPanel.alpha = 0.95;
        contentPanel.color = colors.selectionPanelBorder;
        contentPanel.background = colors.selectionPanelBackground;
        contentPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        contentPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.mainPanel.addControl(contentPanel);

        // Titre "Game Over"
        const titleText = new TextBlock();
        titleText.text = " ";
        titleText.color = "#ffffff";
        titleText.fontSize = "48px";
        titleText.fontFamily = "'Inclusive Sans', sans-serif";
        titleText.fontWeight = "bold";
        titleText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        titleText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        titleText.top = "15%";
        contentPanel.addControl(titleText);

        // Texte du gagnant (sera mis à jour dynamiquement)
        const winnerText = new TextBlock("winner-text");
        winnerText.text = "";
        winnerText.color = "#00ff00";
        winnerText.fontSize = "36px";
        winnerText.fontFamily = "'Inclusive Sans', sans-serif";
        winnerText.fontWeight = "bold";
        winnerText.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        winnerText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        winnerText.top = "-5%";
        contentPanel.addControl(winnerText);

        // Container pour le bouton
        const buttonContainer = new Rectangle();
        buttonContainer.width = '60%';
        buttonContainer.height = '20%';
        buttonContainer.thickness = 0;
        buttonContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        buttonContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonContainer.top = "-10%";
        contentPanel.addControl(buttonContainer);

        // Bouton "Back to Home"
        const backToHomeBtn = Button.CreateSimpleButton("button-backtohome", "Back to Home");
        backToHomeBtn.width = '100%';
        backToHomeBtn.height = '100%';
        backToHomeBtn.thickness = 2;
        backToHomeBtn.cornerRadius = 15;
        backToHomeBtn.color = "#ffffff";
        backToHomeBtn.background = "#333333";
        backToHomeBtn.fontFamily = "'Inclusive Sans', sans-serif";
        backToHomeBtn.fontSize = "28px";
        backToHomeBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        backToHomeBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        AnimateButton(backToHomeBtn, 1.05);

        backToHomeBtn.onPointerUpObservable.add(() => {
            this.hide();
            this.goBackToHome();
        });
        buttonContainer.addControl(backToHomeBtn);
    }

    private async goBackToHome(): Promise<void> {
        const currentGameName = this.controller.getActiveGame();
        if (currentGameName) {
            await this.controller.resetGame(currentGameName);
        }
        // Aller vers la page d'accueil
        router.push('/');
    }

    public showWinner(winner: string, isDraw: boolean = false): void {
        const winnerTextControl = this.hud.getControlByName("winner-text") as TextBlock;
        if (winnerTextControl) {
            if (isDraw) {
                winnerTextControl.text = "It's a Draw!";
                winnerTextControl.color = "#ffff00";
            } else {
                winnerTextControl.text = `${winner} Wins!`;
                winnerTextControl.color = "#00ff00";
            }
        }
        this.show();
    }

    public show(): void {
        this.hud.rootContainer.isVisible = true;
    }

    public hide(): void {
        this.hud.rootContainer.isVisible = false;
    }

    public dispose(): void {
        this.hud.dispose();
    }
}
