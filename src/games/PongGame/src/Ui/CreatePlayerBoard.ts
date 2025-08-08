import { Player } from "@/games/PongGame/src/Player.ts";
import {Control, StackPanel, TextBlock, Rectangle} from '@babylonjs/gui';
import { GameContext} from "../GameContext.ts"

export function CreatePlayerBoard(player: Player): StackPanel {
    const store = player.store!
    const playerPanel = new StackPanel(`player-${store.id}`)
    playerPanel.width = "30%"
    playerPanel.height = "14%"
    playerPanel.horizontalAlignment = (store.id === 0) ? Control.HORIZONTAL_ALIGNMENT_LEFT : Control.HORIZONTAL_ALIGNMENT_RIGHT
    playerPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
    playerPanel.paddingLeft = (store.id === 0) ? "13%" : "0%"
    playerPanel.paddingRight = (store.id === 0) ? "0%" : "13%"
    playerPanel.paddingBottom = "4%"
    playerPanel.alpha = 1

    const scoreCount = new Rectangle(`ScoreCount-${player.store.id}`)
    scoreCount.width = "100%"
    scoreCount.height = "100%"
    scoreCount.cornerRadius = 24
    scoreCount.thickness = 0.5
    scoreCount.alpha = 0.98
    scoreCount.color = "#00D4FF"
    scoreCount.paddingLeft = "2%"
    scoreCount.paddingRight = "2%"
    scoreCount.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER
    scoreCount.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
    scoreCount.background = "#000000"

    playerPanel.addControl(scoreCount)
    const scoreText = new TextBlock(`scoreText-${player.store.id}`)
    scoreText.color = (store.id === 0) ? "#ff0000" : "#0020ff"
    scoreText.fontFamily = "'Inclusive Sans', sans-serif"
    scoreText.fontSize = "40%"
    scoreText.fontWeight = "500"
    scoreText.text = `${player.store.name} : ${player.store.score}`
    scoreText.width = "100%"
    scoreText.height = "100%"
    scoreText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER
    scoreText.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER
    scoreText.zIndex = 1
    scoreText.alpha = 0.3
    scoreCount.addControl(scoreText);

    let lastScore = store.score;
    let animTime = 0;
    let animActive = false;

    const baseFontSize = 0.4;
    const maxScale = 1.3;

    GameContext.scene!.onBeforeRenderObservable.add(() => {
        if (animActive) {
            animTime += GameContext.scene!.getEngine().getDeltaTime() / 1000; // secondes écoulées
            const progress = animTime / 0.25; // animation de 0.25s

            if (progress < 0.5) {
                const scale = 1 + (maxScale - 1) * (progress / 0.5);
                scoreText.fontSize = `${baseFontSize * scale * 100}%`;
            } else if (progress < 1) {
                const scale = maxScale - (maxScale - 1) * ((progress - 0.5) / 0.5);
                scoreText.fontSize = `${baseFontSize * scale * 100}%`;
            } else {
                animActive = false;
                scoreText.fontSize = "40%";
            }
        }
    });

    player.store.$subscribe((mutation, state) => {
        if (state.score > lastScore) {
            animTime = 0;
            animActive = true;
        }
        lastScore = state.score;
        scoreText.text = `${player.store.name} : ${player.store.score}`;
    })
    scoreCount.addControl(scoreText)
    return playerPanel
}
