import { defineStore } from "pinia";
import { Color3, Color4 } from "@babylonjs/core";

interface ColorsStore {
    colors3: Map<string, Color3>;
    colors4: Map<string, Color4>;
}

export const useColorsStore = defineStore("useColorsStore ", {
    state: (): ColorsStore => ({
        colors3: new Map<string, Color3>(),
        colors4: new Map<string, Color4>(),
    }),

    actions: {
        addColor3Hex(name: string, hexcode: string) {
            if (this.colors3.has(name) || !hexcode) return;
            this.colors3.set(name, Color3.FromHexString(hexcode));
        },

        addColor4Rgb(name: string, r: number, g: number, b: number, a: number) {
            if ( r === undefined || g === undefined || b === undefined || a === undefined ||
                this.colors4.has(name))
                return;
            this.colors4.set(name, new Color4(r / 255, g / 255, b / 255, a));
        },

        removeColor(name: string) {
            if (this.colors4.has(name)) {
                this.colors4.delete(name);
            } else if (this.colors3.has(name)) {
                this.colors3.delete(name);
            }
        },
        getColors3(): Map<string, Color3> {
            return this.colors3;
        },
        getColors4(): Map<string, Color4> {
            return this.colors4;
        },
        clearColors(): void {
            this.colors3.clear();
            this.colors4.clear();
        },
        setTrailColors(color1: Color4, color2: Color4, colorDead: Color4) {
            this.colors4.set(("ball_particles1"), color1)
            this.colors4.set(("ball_particles2"), color2)
            this.colors4.set(("ball_particles_colorDead"), colorDead)
        }
    },
});