import {
    AdvancedDynamicTexture,
    Button,
    Control,
    Grid,
    Rectangle,
    StackPanel,
    TextBlock
} from '@babylonjs/gui';
import { Scene } from '@babylonjs/core';
import { watch } from 'vue';
import { useColorStore } from '@/stores/colorStore';
import { GameController } from '@/games/services/GameController.ts'
import router from "@/router";

function AnimateButton(btn: Button, scale: number): void {
    btn.onPointerEnterObservable.add(() => {
        btn.scaleX = scale;
        btn.scaleY = scale;
        btn.thickness = 1.5
    });

    btn.onPointerOutObservable.add(() => {
        btn.scaleX = 1.0;
        btn.scaleY = 1.0;
        btn.thickness = 1;
    });
}

function selectMenu(mainPannel: Rectangle, selectBtn: Button): Promise<string> {
    selectBtn.isVisible = false;

    const blockMenu = new Rectangle()
    blockMenu.zIndex = 1

    const selectGrid = new Grid()
    selectGrid.setPadding("2%", "2%", "2%", "2%")
    selectGrid.addRowDefinition(0.70, false);
    selectGrid.addRowDefinition(0.15, false);
    selectGrid.addRowDefinition(0.15, false);
    selectGrid.addColumnDefinition(0.5, false);
    selectGrid.addColumnDefinition(0.5, false);
    selectGrid.zIndex = 2;
    mainPannel.addControl(selectGrid)

    const buttonPong = Button.CreateSimpleButton("buttonPong", "Pong")
    buttonPong.setPadding("2%", "2%", "9%", "2%")
    buttonPong.thickness = 1;
    buttonPong.cornerRadius = 18;
    buttonPong.color = "#f10202";
    buttonPong.background = "#000000";
    buttonPong.fontFamily = "'Inclusive Sans', sans-serif";
    buttonPong.fontSize = "27%";
    selectGrid.addControl(buttonPong, 1, 0)

    const buttonTTT = Button.CreateSimpleButton("buttonTTT", "TicTacToe")
    buttonTTT.setPadding("3%", "2%", "2%", "2%")
    buttonTTT.thickness = 1;
    buttonTTT.cornerRadius = 20;
    buttonTTT.color = "#f10202";
    buttonTTT.background = "#000000";
    buttonTTT.fontFamily = "'Inclusive Sans', sans-serif";
    buttonTTT.fontSize = "27%";
    selectGrid.addControl(buttonTTT, 2, 0)

    const pick = (name: string, resolve: (v: string) => void) => {
        selectGrid.isVisible = false;
        selectBtn.isVisible = true;
        selectGrid.zIndex = -2;
        blockMenu.zIndex = -1;
        selectGrid.dispose();
        blockMenu.dispose();
        resolve(name);
    };

    return new Promise<string>((resolve) => {
        buttonTTT.onPointerUpObservable.addOnce(() => pick("TicTacToe", resolve));
        buttonPong.onPointerUpObservable.addOnce(() => pick("Pong", resolve));
    });
}

export default class GameSelectionHUD {
    private hud: AdvancedDynamicTexture;
    private mainPanel: Rectangle;
    private selectedGame: string | null = null;

    constructor(scene: Scene, controller: GameController) {
        this.hud = AdvancedDynamicTexture.CreateFullscreenUI('GameSelectionUI', true, scene);

        const colors = useColorStore();

        this.mainPanel = new Rectangle();
        this.mainPanel.width = '40%';
        this.mainPanel.height = '70%';
        this.mainPanel.cornerRadius = 20;
        this.mainPanel.thickness = 2;
        this.mainPanel.alpha = 0.99;
        this.mainPanel.color = colors.selectionPanelBorder;
        this.mainPanel.background = colors.selectionPanelBackground;
        this.mainPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.mainPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.hud.addControl(this.mainPanel);

        const layout = new Grid();
        layout.addRowDefinition(0.15, false);
        layout.addRowDefinition(0.70, false);
        layout.addRowDefinition(0.15, false);
        layout.addColumnDefinition(0.5, false);
        layout.addColumnDefinition(0.5, false);
        layout.width = "100%";
        layout.height = "100%";
        layout.setPadding("2%", "2%", "2%", "2%");
        this.mainPanel.addControl(layout);

        const backBtn = Button.CreateSimpleButton("button-backtohome", "Back to Home");
        backBtn.thickness = 1;
        backBtn.cornerRadius = 20;
        backBtn.width = '100%';
        backBtn.color = "#f10202";
        backBtn.fontFamily = "'Inclusive Sans', sans-serif";
        backBtn.fontSize = "27%";
        backBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        backBtn.setPadding("2%", "2%", "2%", "2%");
        backBtn.onPointerUpObservable.add(() => router.push('/'));
        AnimateButton(backBtn, 1.03);
        layout.addControl(backBtn, 0, 0);

        const settingsBtn = Button.CreateSimpleButton("button-settings", "Settings");
        settingsBtn.thickness = 1;
        settingsBtn.cornerRadius = 20;
        settingsBtn.width = '100%';
        settingsBtn.color = "#f10202";
        settingsBtn.fontFamily = "'Inclusive Sans', sans-serif";
        settingsBtn.fontSize = "27%";
        settingsBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        settingsBtn.setPadding("2%", "2%", "2%", "2%");
        AnimateButton(settingsBtn, 1.03);
        layout.addControl(settingsBtn, 0, 1);

        const playerOnePannel = new Rectangle();
        playerOnePannel.color = "#17ff00";
        playerOnePannel.thickness = 1;
        playerOnePannel.cornerRadius = 20;
        playerOnePannel.setPadding("2%", "2%", "2%", "2%");
        layout.addControl(playerOnePannel, 1, 0);

        const playerOneGrid = new Grid()
        playerOneGrid.addRowDefinition(0.15, false);
        playerOneGrid.addRowDefinition(0.85, false);
        playerOneGrid.width = "100%";
        playerOneGrid.height = "100%";
        playerOneGrid.setPadding("2%", "2%", "2%", "2%");
        playerOnePannel.addControl(playerOneGrid)

        const playerOneName = new Rectangle()
        playerOneName.thickness = 1;
        playerOneName.setPadding("2%", "2%", "2%", "2%");
        playerOneName.color = "#ffffff";
        playerOneName.cornerRadius = 20;
        playerOneGrid.addControl(playerOneName, 0, 0);

        const playerOneNameText = new TextBlock("player1-name", "Player 1");
        playerOneNameText.fontSize = "40%";
        playerOneNameText.fontFamily = "'Inclusive Sans', sans-serif";
        playerOneName.addControl(playerOneNameText);

        const playerTwoPannel = new Rectangle();
        playerTwoPannel.color = "#17ff00";
        playerTwoPannel.thickness = 1;
        playerTwoPannel.cornerRadius = 20;
        playerTwoPannel.setPadding("2%", "2%", "2%", "2%");
        layout.addControl(playerTwoPannel, 1, 1);


        const playerTwoGrid = new Grid()
        playerTwoGrid.addRowDefinition(0.15, false);
        playerTwoGrid.addRowDefinition(0.85, false);
        playerTwoGrid.width = "100%";
        playerTwoGrid.height = "100%";
        playerTwoGrid.setPadding("2%", "2%", "2%", "2%");
        playerTwoPannel.addControl(playerTwoGrid)

        const playerTwoName = new Rectangle()
        playerTwoName.thickness = 1;
        playerTwoName.setPadding("2%", "2%", "2%", "2%");
        playerTwoName.color = "#ffffff";
        playerTwoName.cornerRadius = 20;
        playerTwoGrid.addControl(playerTwoName, 0, 0);

        const playerTwoNameText = new TextBlock("player1-name", "Player 2");
        playerTwoNameText.fontSize = "40%";
        playerTwoNameText.fontFamily = "'Inclusive Sans', sans-serif";
        playerTwoName.addControl(playerTwoNameText);







        const startBtn = Button.CreateSimpleButton("button-start", "Start Game");
        startBtn.isEnabled = false;
        startBtn.thickness = 1;
        startBtn.cornerRadius = 20;
        startBtn.width = '100%';
        startBtn.color = "#ffffff";
        startBtn.fontFamily = "'Inclusive Sans', sans-serif";
        startBtn.fontSize = "27%";
        startBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        startBtn.setPadding("2%", "2%", "2%", "2%");
        AnimateButton(startBtn, 1.03);
        startBtn.onPointerUpObservable.add( () => {
            if (!this.selectedGame) return;
            selectBtn.textBlock.text = "Select game";
            controller.launchGame(this.selectedGame);
            this.selectedGame = null;
        });
        layout.addControl(startBtn, 2, 1);

        const selectBtn = Button.CreateSimpleButton("button-select", "Select game");
        selectBtn.thickness = 1;
        selectBtn.cornerRadius = 20;
        selectBtn.width = '100%';
        selectBtn.color = "#f10202";
        selectBtn.fontFamily = "'Inclusive Sans', sans-serif";
        selectBtn.fontSize = "27%";
        selectBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        selectBtn.setPadding("2%", "2%", "2%", "2%");
        AnimateButton(selectBtn, 1.03);
        selectBtn.onPointerUpObservable.add(async () => {
            const choice = await selectMenu(this.mainPanel, selectBtn);
            this.selectedGame = choice;
            selectBtn.textBlock.text = choice;
            startBtn.isEnabled = true;
            startBtn.alpha = 1.0;
        });
        layout.addControl(selectBtn, 2, 0);

        //   zone.color = colors.selectionColorZoneBorder;
        //   watch(() => colors.selectionColorZoneBorder, v => (zone.color = v));
        //   zone.background = colors.selectionColorZoneBackground;
        //   watch(() => colors.selectionColorZoneBackground, v => (zone.background = v));

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

