import { Button, Control } from '@babylonjs/gui';
import GameController from "@/games/services/GameController.ts";

export function CreateHomeButton(text: string, controller: GameController): Button {
    const btn = Button.CreateSimpleButton('MenuButton', text);
    btn.width = '8%';
    btn.height = '6.5%';
    btn.left = '2%';
    btn.top = '8%';
    btn.color = '#ffffff';
    btn.cornerRadius = 20;
    btn.background = '#000000';
    btn.fontSize = "16px";
    btn.thickness = 1;
    btn.alpha = 0.95;
    btn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    btn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

    btn.onPointerDownObservable.add(() => {
        btn.scaleX = 0.9;
        btn.scaleY = 0.9;
    });

    btn.onPointerUpObservable.add(() => {
        const duration = 100;
        const startTime = performance.now();

        const animate = (time: number) => {
            const progress = Math.min((time - startTime) / duration, 1);
            btn.scaleX = 0.9 + (1 - 0.9) * progress;
            btn.scaleY = 0.9 + (1 - 0.9) * progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                controller.resetGame(controller.getActiveGame()!);
            }
        };
        requestAnimationFrame(animate);
    });

    return btn;
}