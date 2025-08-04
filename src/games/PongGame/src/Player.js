import {
    MeshBuilder,
    Color3,
    StandardMaterial,
} from '@babylonjs/core';
import { createPlayerStore } from '@/stores/playerFactory'

// Revoir pour que la taille de la barre du player soit totalement scaled sur la taille du terrain
// Rework tout ce qui est lié a left ou right ca va bosser avec le player num de pinia
// J'aimerai voir si je peux ramener store ici avec import, pcque flemme des parametres
export class Player {
    constructor(id, name) {
        // this.type = type;
        // this.scene = scene; Donc ca on essaye d'importer sans params
        this.bar = null;

        this.store = createPlayerStore(id)
        this.store.setID(id)
        this.store.setName(name)

        this._init()
        this._initTexture()
    }

    _init() {

    }

    _initTexture() {
        const barMaterial = new StandardMaterial("barMaterial", this.scene);
        barMaterial.diffuseColor = new Color3(1, 0, 0);

        this.bar = MeshBuilder.CreateBox("leftBar",
            {width: 0.1, height: 0.2, depth: 1, updatable: true},
            this.scene);
        this.bar.material = barMaterial;
        // Bar pos ca part sur pinia
        this.bar.position.y = 0.1;
        this.type === 'left' ? this.bar.position.x = -3.5 : this.bar.position.x = 3.5;
    }

    moveUp() {
        if (this.bar && this.bar.position.z < 2.5) {
            this.bar.position.z += this.barspeed;
        }
    }

    moveDown() {
        if (this.bar && this.bar.position.z > -2.5) {
            this.bar.position.z -= this.barspeed;
        }
    }

    resetPosition() {
        if (this.bar) {
            this.bar.position.z = 0;
        }
    }
}