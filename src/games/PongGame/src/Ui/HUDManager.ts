import PongHUD from "./PongHUD.ts";

interface HUDManagerType {
    hud: PongHUD | null;
    setHud(newhud: PongHUD): void;
    getHud(): PongHUD;
}

export const HUDManager: HUDManagerType = {
    hud: null,

    setHud(newhud: PongHUD) {
        this.hud = newhud;
    },

    getHud() {
        if (!this.hud) throw new Error("HUD non initialisé");
        return this.hud;
    }
};