import { Button, Control } from '@babylonjs/gui';
import router from '@/router/index.ts';

export function CreateMenuButton(): Button {
    const btn = Button.CreateSimpleButton('MenuButton', 'Menu');
    btn.width = '8%';
    btn.height = '6.5%';
    btn.left = '2%';
    btn.top = '8%';
    btn.color = '#00D4FF';
    btn.cornerRadius = 20;
    btn.background = '#000000';
    btn.fontSize = "26px";
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
                router.push('/');
            }
        };
        requestAnimationFrame(animate);
    });

    return btn;
}