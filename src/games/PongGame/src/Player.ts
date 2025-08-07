import {
    MeshBuilder,
    Color3,
    StandardMaterial,
    Mesh, PointLight, Vector3,
    // GlowLayer,
} from '@babylonjs/core';
import { createPlayerStore } from '@/stores/playerFactory';
import { GameContext } from './GameContext';

export class Player {
    public bar: Mesh | null;
    public store: ReturnType<typeof createPlayerStore>;

    constructor(id: number, name: string) {
        this.bar = null;

        this.store = createPlayerStore(id);
        this.store.setID(id);
        this.store.setName(name);

        this.store.setBarSpeed(0.13);

        this._init();
        this._initTexture();
    }

    private _init(): void {
        this.store.setSpawn((this.store.id === 1 ? 1 : -1) * (0.8 * (GameContext.size.width / 2)), 0);
        this.store.setPos(this.store.spawn.x, this.store.spawn.z);
        this.store.setBarDepth(1);
    }

    private _initTexture(): void {
        const neonMaterial = new StandardMaterial('neonMaterial', GameContext.scene!);

        neonMaterial.emissiveColor = new Color3(0.5, 0, 1);
        neonMaterial.alpha = 1;
        neonMaterial.wireframe = true;

        this.bar = MeshBuilder.CreateTiledBox("leftBar", {
            width: 0.08,
            height: 0.2,
            depth: this.store.bar_depth,
            tileSize: 2,
            updatable: true,
        }, GameContext.scene!);

        this.bar.material = neonMaterial;
        this.bar.position.set(this.store.pos.x, 0.2, this.store.pos.z);
    }

    moveUp(): void {
        if (this.bar && this.bar.position.z < GameContext.size.depth / 2 - this.store.bar_depth / 2 - 0.185) {
            this.bar.position.z += this.store.bar_speed;
        }
    }

    moveDown(): void {
        if (this.bar && this.bar.position.z > -GameContext.size.depth / 2 + this.store.bar_depth / 2 + 0.15) {
            this.bar.position.z -= this.store.bar_speed;
        }
    }

    resetPosition(): void {
        if (this.bar) {
            this.bar.position.z = 0;
        }
    }
}