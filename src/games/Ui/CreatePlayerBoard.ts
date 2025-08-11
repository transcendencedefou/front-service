import { Control, StackPanel, TextBlock, Rectangle } from '@babylonjs/gui';
import { Player } from "@/games/Players/Player.ts";
import { Scene } from '@babylonjs/core';
import { useColorStore } from '@/stores/colorStore';
import { computed, watch } from 'vue';

export function CreatePlayerBoard(player: Player, scene: Scene): StackPanel {
    const store = player.store!;
    const { id, name } = store;

    const colorStore = useColorStore();

    const PANEL = {
        width: "30%",
        height: "14%",
        paddingLR: "13%",
        paddingBottom: "4%",
        corner: 24,
        alpha: 0.98,
    } as const;

    const textColor = computed(() => id === 0 ? colorStore.playerOneColor : colorStore.playerTwoColor);
    const TEXT = {
        basePercent: 40,
        family: "'Inclusive Sans', sans-serif",
        weight: "500",
        alpha: 0.3,
    } as const;

    const ANIM = { duration: 0.25, maxScale: 1.3 } as const;

    const playerPanel = new Rectangle(`player-${id}`);
    playerPanel.width  = PANEL.width;
    playerPanel.height = PANEL.height;
    playerPanel.thickness = 0;
    playerPanel.horizontalAlignment = (id === 0) ? Control.HORIZONTAL_ALIGNMENT_LEFT : Control.HORIZONTAL_ALIGNMENT_RIGHT;
    playerPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    playerPanel.paddingLeft = (id === 0) ? PANEL.paddingLR : "0%";
    playerPanel.paddingRight = (id === 0) ? "0%" : PANEL.paddingLR;
    playerPanel.paddingBottom = PANEL.paddingBottom;

    const scoreCount = new Rectangle(`ScoreCount-${id}`);
    scoreCount.width = "100%";
    scoreCount.cornerRadius = PANEL.corner;
    scoreCount.thickness = 0.5;
    scoreCount.alpha = PANEL.alpha;
    scoreCount.color = colorStore.playerBoardBorder;
    watch(() => colorStore.playerBoardBorder, (v) => (scoreCount.color = v));
    scoreCount.paddingLeft = "8%";
    scoreCount.paddingTop = "8%";
    scoreCount.paddingBottom = "8%";
    scoreCount.paddingRight = "8%";
    scoreCount.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    scoreCount.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    scoreCount.background = colorStore.playerBoardBackground;
    watch(() => colorStore.playerBoardBackground, (v) => (scoreCount.background = v));

    // Rectangle fixe
    scoreCount.scaleX = 1;
    scoreCount.scaleY = 1;

    playerPanel.addControl(scoreCount);

    const scoreText = new TextBlock(`scoreText-${id}`);
    scoreText.color = textColor.value;
    watch(textColor, (v) => (scoreText.color = v));
    scoreText.fontFamily = TEXT.family;
    scoreText.fontWeight = TEXT.weight;
    scoreText.fontSize = `${TEXT.basePercent}%`;
    scoreText.text = `${name} : ${store.score}`;
    scoreText.width = "100%";
    scoreText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    scoreText.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
    scoreText.zIndex = 1;
    scoreText.alpha = TEXT.alpha;

    scoreText.transformCenterX = 0.5;
    scoreText.transformCenterY = 0.5;
    scoreText.scaleX = 1;
    scoreText.scaleY = 1;
    scoreCount.addControl(scoreText);

    let lastScore = store.score;
    let animTime = 0;
    let animActive = false;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeIn  = (t: number) => Math.pow(t, 3);

    const beforeRenderObserver = scene.onBeforeRenderObservable.add(() => {
        if (!animActive) return;

        const dt = scene.getEngine().getDeltaTime() / 1000;
        animTime += dt;
        const p = Math.min(animTime / ANIM.duration, 1);

        let scale: number;
        if (p < 0.5) {
            const k = easeOut(p / 0.5);
            scale = 1 + (ANIM.maxScale - 1) * k;
        } else {
            const k = easeIn((p - 0.5) / 0.5);
            scale = ANIM.maxScale - (ANIM.maxScale - 1) * k;
        }

        // → Seul le texte bouge
        scoreText.scaleX = scale;
        scoreText.scaleY = scale;

        if (p >= 1) {
            animActive = false;
            scoreText.scaleX = 1;
            scoreText.scaleY = 1;
        }
    });

    const unsubscribe = store.$subscribe((_mutation, state) => {
        if (state.score !== lastScore) {
            scoreText.text = `${state.name} : ${state.score}`;
            if (state.score > lastScore) {
                animTime = 0;
                animActive = true;
            }
            lastScore = state.score;
        } else if (state.name !== name) {
            scoreText.text = `${state.name} : ${state.score}`;
        }
    });

    playerPanel.onDisposeObservable.add(() => {
        if (beforeRenderObserver) scene.onBeforeRenderObservable.remove(beforeRenderObserver);
        if (typeof unsubscribe === 'function') unsubscribe();
    });

    return playerPanel;
}
