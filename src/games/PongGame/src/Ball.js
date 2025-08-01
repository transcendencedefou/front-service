import {Color3, MeshBuilder, StandardMaterial,} from '@babylonjs/core';

// Class representing the ball in the Pong game
// It handles the ball's movement, collision detection, and scoring
// It also resets the ball's position and speed when a player scores
export default class Ball {
    constructor(pongEngine, player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.engine = pongEngine;
        this.ball = null;
        this.speed = 0.01;
        this.direction = { x: -1, y: 0, z: 0 };
        this.lastBarCollisionTime = 0;
        this.barCollisionCooldown = 200;

        this._init();
    }

    _init() {
        const ballMaterial = new StandardMaterial("ballMaterial", this.engine.scene);
        ballMaterial.diffuseColor = new Color3(1, 1, 0);
        this.ball = MeshBuilder.CreateSphere("ball", { diameter: 0.2 }, this.engine.scene);
        this.ball.material = ballMaterial;
        this.ball.position.y = 0.1;
    }

    // Method to move the ball and check for collisions
    move() {
        const pos = this.ball.position;

        if (this.ball.intersectsMesh(this.engine.winSurfaceLeft, false)) {
            this.player2.player_score++;
            this.reset();
        } else if (this.ball.intersectsMesh(this.engine.winSurfaceRight, false)) {
            this.player1.player_score++;
            this.reset();
        }

        if (this.ball.intersectsMesh(this.engine.upBorder , false) ||
            this.ball.intersectsMesh(this.engine.downBorder, false)) {
            this.direction.z *= -1;
        }

        const now = Date.now();
        const collidedWithBar = this.ball.intersectsMesh(this.player1.bar, false) ||
            this.ball.intersectsMesh(this.player2.bar, false);

        // Check if the ball collided with a bar and if enough time has passed since the last collision
        // to prevent multiple collisions in a short time frame
        if (collidedWithBar && now - this.lastBarCollisionTime > this.barCollisionCooldown) {
            this.lastBarCollisionTime = now;

            this.direction.x *= -1;
            if (this.speed < 0.13) {
                this.speed *= 1.08;
            }

            const bar = this.ball.intersectsMesh(this.player1.bar, false) ? this.player1.bar : this.player2.bar;
            const impactOffset = this.ball.position.z - bar.position.z;
            this.direction.z = impactOffset / (bar.scaling.z || 1);

            const length = Math.sqrt(this.direction.x ** 2 + this.direction.z ** 2);
            this.direction.x /= length;
            this.direction.z /= length;
        }
        pos.x += this.direction.x * this.speed;
        pos.z += this.direction.z * this.speed;
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
