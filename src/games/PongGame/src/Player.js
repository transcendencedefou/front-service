import {
    MeshBuilder,
    Color3,
    StandardMaterial,
} from '@babylonjs/core';


export default class Player {
    constructor(type, scene) {
        this.type = type;
        this.scene = scene;
        this.bar = null;
        this.player_score = 0;
        this.barspeed = 0.025;

        this._init()
    }

    _init() {
        const barMaterial = new StandardMaterial("barMaterial", this.scene);
        barMaterial.diffuseColor = new Color3(1, 0, 0);

        this.bar = MeshBuilder.CreateBox("leftBar",
            {width: 0.1, height: 0.2, depth: 1, updatable: true},
            this.scene);
        this.bar.material = barMaterial;
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