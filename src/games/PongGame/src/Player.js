import {
    MeshBuilder,
    Color3,
    StandardMaterial,
} from '@babylonjs/core';
import { createPlayerStore } from '@/stores/playerFactory'
import { GameContext } from './GameContext'

export class Player {
    constructor(id, name) {
        this.bar = null;

        this.store = createPlayerStore(id)
        this.store.setID(id)
        this.store.setName(name)

        this._init()
        this._initTexture()
    }

    _init() {
        this.store.setSpawn((this.store.id === 1 ? 1 : -1) * (0.8 * (GameContext.size["width"] / 2)), 0);
        this.store.setPos(this.store.spawn.x, this.store.spawn.z)
        this.store.setBarHeight(0.2)
    }

    _initTexture() {
        const barMaterial = new StandardMaterial("barMaterial", GameContext.scene);
        barMaterial.diffuseColor = new Color3(1, 0, 0);
        this.bar = MeshBuilder.CreateBox("leftBar",
            {width: 0.1, height: this.store.bar_height, depth: 1, updatable: true},
            GameContext.scene);
        this.bar.material = barMaterial;
        this.bar.position.set(this.store.pos.x, 0.1, this.store.pos.z);
    }

    moveUp() {
        if (this.bar && this.bar.position.z < GameContext.size["height"] / 2) {
            this.bar.position.z += this.store.bar_speed;
        }
    }

    moveDown() {
        if (this.bar && this.bar.position.z > -GameContext.size["height"] / 2) {
            this.bar.position.z -= this.store.bar_speed;
        }
    }

    resetPosition() {
        if (this.bar) {
            this.bar.position.z = 0;
        }
    }
}