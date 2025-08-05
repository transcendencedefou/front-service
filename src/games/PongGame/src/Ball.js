import {Color3, MeshBuilder, StandardMaterial,} from '@babylonjs/core';
import {GameContext} from "./GameContext.js";
import {PlayerManager} from "./PlayerManager.js";

export default class Ball {
    constructor() {
        this.ball = null;

        this.speed = 0.03;
        this.direction = { x: Math.random() < 0.5 ? -1 : 1, z: 0 };
        this._normalizeDirection();

        this.lastBarCollisionTime = 0;
        this.barCollisionCooldown = 200; // ms

        this._init();
    }

    _init() {
        const ballMaterial = new StandardMaterial('ballMaterial', GameContext.scene);
        ballMaterial.diffuseColor = new Color3(1, 1, 0);

        this.ball = MeshBuilder.CreateSphere('ball', { diameter: 0.2 }, GameContext.scene);
        this.ball.material = ballMaterial;
        this.ball.position.y = 0.1;
    }

    _normalizeDirection() {
        const length = Math.sqrt(this.direction.x ** 2 + this.direction.z ** 2);
        if (length === 0) return;
        this.direction.x /= length;
        this.direction.z /= length;
    }

    move() {
        const pos = this.ball.position;
        const leftBorder = GameContext.borders.get('left');
        const rightBorder = GameContext.borders.get('right');
        const upBorder = GameContext.borders.get('up');
        const downBorder = GameContext.borders.get('down');

        if (this.ball.intersectsMesh(leftBorder, false) && PlayerManager.getPlayer(1)) {
            PlayerManager.getPlayer(1).store.setScore(+ 1)
            GameContext.game.reset();
        } else if (this.ball.intersectsMesh(rightBorder, false) && PlayerManager.getPlayer(0)) {
            PlayerManager.getPlayer(0).store.setScore(+ 1)
            GameContext.game.reset();
        }

        if (this.ball.intersectsMesh(upBorder, false) ||
            this.ball.intersectsMesh(downBorder, false)) {
            this.direction.z *= -1
        }

        const now = Date.now();
        const collidedWithBar = this.ball.intersectsMesh(PlayerManager.getPlayer(0).bar, false) ||
            this.ball.intersectsMesh(PlayerManager.getPlayer(1).bar, false);

        if (collidedWithBar && now - this.lastBarCollisionTime > this.barCollisionCooldown) {
            this.lastBarCollisionTime = now;

            this.direction.x *= -1;
            if (this.speed < 0.07) {
                this.speed *= 1.05;
            }

            const bar = this.ball.intersectsMesh(PlayerManager.getPlayer(0).bar, false) ? PlayerManager.getPlayer(0).bar : PlayerManager.getPlayer(1).bar;
            const impactOffset = this.ball.position.z - bar.position.z;
            this.direction.z = impactOffset / (bar.scaling.z || 1);

            const length = Math.sqrt(this.direction.x ** 2 + this.direction.z ** 2);
            this.direction.x /= length;
            this.direction.z /= length;
        }
        pos.x += this.direction.x * this.speed;
        pos.z += this.direction.z * this.speed;
    }

    reset() {
        if (!this.ball) return;
        this.ball.position.x = 0;
        this.ball.position.z = 0;
        this.speed = 0.03;
        this.direction.x = Math.random() < 0.5 ? -1 : 1;
        this.direction.z = (Math.random() * 2 - 1) * 0.2;
        this._normalizeDirection();
    }
}
