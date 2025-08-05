import {Color3, MeshBuilder, StandardMaterial,} from '@babylonjs/core';
import {usePongStore} from "@/stores/pongStore.js";
import {GameContext} from "./GameContext.js";
import {PlayerManager} from "./PlayerManager.js";

export default class Ball {
    constructor() {
        this.ball = null;
        this.lastBarCollisionTime = 0;
        this.barCollisionCooldown = 200;

        this.pong_store = usePongStore();
        this.pong_store.setBallSpeed(0)
        this.pong_store.setBallDirection(-1, 0, 0)
        this._init();
    }

    _init() {
        const ballMaterial = new StandardMaterial("ballMaterial", GameContext.scene);
        ballMaterial.diffuseColor = new Color3(1, 1, 0);

        this.ball = MeshBuilder.CreateSphere("ball", { diameter: 0.2 }, GameContext.scene);
        this.ball.material = ballMaterial;
        this.ball.position.y = 0.1;
    }

    move() {
        const pos = this.ball.position;
        const leftBorder = GameContext.borders.get("left");
        const rightBorder = GameContext.borders.get("right");
        const upBorder = GameContext.borders.get("up");
        const downBorder = GameContext.borders.get("down");

        if (this.ball.intersectsMesh(leftBorder, false)) {
            this.pong_store.setBallDirection.x *= -1
            // this.player2.player_score++;
            // this.reset();
        } else if (this.ball.intersectsMesh(rightBorder, false)) {
            this.pong_store.setBallDirection.x *= -1
            // this.player1.player_score++;
            // this.reset();
        }

        if (this.ball.intersectsMesh(upBorder, false) ||
            this.ball.intersectsMesh(downBorder, false)) {
            this.pong_store.setBallDirection.z *= -1
        }
        //
        // const now = Date.now();
        // const collidedWithBar = this.ball.intersectsMesh(this.player1.bar, false) ||
        //     this.ball.intersectsMesh(this.player2.bar, false);
        //
        // // Check if the ball collided with a bar and if enough time has passed since the last collision
        // // to prevent multiple collisions in a short time frame
        // if (collidedWithBar && now - this.lastBarCollisionTime > this.barCollisionCooldown) {
        //     this.lastBarCollisionTime = now;
        //
        //     this.direction.x *= -1;
        //     if (this.speed < 0.13) {
        //         this.speed *= 1.08;
        //     }
        //
        //     const bar = this.ball.intersectsMesh(this.player1.bar, false) ? this.player1.bar : this.player2.bar;
        //     const impactOffset = this.ball.position.z - bar.position.z;
        //     this.direction.z = impactOffset / (bar.scaling.z || 1);
        //
        //     const length = Math.sqrt(this.direction.x ** 2 + this.direction.z ** 2);
        //     this.direction.x /= length;
        //     this.direction.z /= length;
        // }
        pos.x += this.pong_store.ball_direction.x * this.pong_store.ball_speed;
        pos.z += this.pong_store.ball_direction.y * this.pong_store.ball_speed;
    }

    // Method to reset the ball position and speed
    reset() {
        if (!this.ball) return;
        this.ball.position.x = 0;
        this.ball.position.z = 0;
        this.speed = 0.01;
        this.direction = { x: Math.random() < 0.5 ? -1 : 1, y: 0, z: 0 };
    }
}
