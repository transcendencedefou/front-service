import { Mesh } from '@babylonjs/core';
import { createPlayerStore } from '@/stores/playerFactory.ts';

export class Player {
    public bar: Mesh | null;
    public store: ReturnType<typeof createPlayerStore>;

    constructor(
        id: number,
        name: string,
        private size: { width: number; depth: number },
    ) {
        this.bar = null;
        this.store = createPlayerStore(id, size.depth);
        this.store.setID(id);
        this.store.setName(name);
        this.store.setBarSpeed(0.13);
    }

    initPong(size: { width: number; depth: number }): void {
        this.store.setSpawn((this.store.id === 1 ? 1 : -1) * (0.8 * (size.width / 2)), 0, 0);
        this.store.setPos(this.store.spawn.x, this.store.spawn.z);
        this.store.setBarDepth(1);
    }

    setBarMesh(mesh: Mesh): void {
        this.bar = mesh;
    }

    moveUp(): void {
        if (this.bar && this.bar.position.z < this.size.depth / 2 - this.store.bar_depth / 2 - 0.185) {
            this.bar.position.z += this.store.bar_speed;
        }
    }

    moveDown(): void {
        if (this.bar && this.bar.position.z > -this.size.depth / 2 + this.store.bar_depth / 2 + 0.185) {
            this.bar.position.z -= this.store.bar_speed;
        }
    }

    resetPosition(): void {
        if (this.bar) {
            this.bar.position.z = 0;
        }
    }

    dispose(): void {
        this.bar?.dispose();
        this.bar = null;
    }
}