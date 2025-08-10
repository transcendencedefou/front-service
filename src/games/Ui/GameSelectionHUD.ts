import { AdvancedDynamicTexture, Button, StackPanel, Control } from '@babylonjs/gui';
import GameController from '@/games/services/GameController';
import { Scene } from '@babylonjs/core';
import router from "@/router";

export default class GameSelectionHUD {
  private hud: AdvancedDynamicTexture;
  private panel: StackPanel;

  constructor(scene: Scene, controller: GameController) {
    this.hud = AdvancedDynamicTexture.CreateFullscreenUI('GameMenuUI', true, scene);

    this.panel = new StackPanel();
    this.panel.width = '220px';
    this.panel.isVertical = true;
    this.panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.panel.spacing = 20;
    this.hud.addControl(this.panel);

    const homebtn = Button.CreateSimpleButton(`btn-home`, "Home Page");
    homebtn.width = '200px';
    homebtn.height = '40px';
    homebtn.color = '#00D4FF';
    homebtn.cornerRadius = 20;
    homebtn.background = '#000000';
    homebtn.alpha = 0.8;
    homebtn.onPointerUpObservable.add(() => {
      router.push('/');
    });
    this.panel.addControl(homebtn);

    controller.listGames().forEach(name => {
      const btn = Button.CreateSimpleButton(`btn-${name}`, name);
      btn.width = '200px';
      btn.height = '40px';
      btn.color = '#00D4FF';
      btn.cornerRadius = 20;
      btn.background = '#000000';
      btn.alpha = 0.8;
      btn.onPointerUpObservable.add(() => {
        controller.launchGame(name);
      });
      this.panel.addControl(btn);
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

