import { Mesh } from '@babylonjs/core';
import { GameContext } from './GameContext';
import { PlayerManager } from './PlayerManager';
import { createSynthwaveBall, createBallTrailParticles  } from './createSynthwaveBall';
import { useBallStore } from '@/stores/ballStore.ts'

export default class Ball {
    private store: ReturnType<typeof useBallStore>;
    private ball!: Mesh;

    constructor() {
        this.store = useBallStore()
        this.store.speed = 0.05
        this.store.direction = { x: Math.random() < 0.5 ? -1 : 1, y: 0, z: 0 };
        this._normalizeDirection();

        this._init();
    }

    private _init(): void {
        this.ball = createSynthwaveBall(GameContext.scene!);
        createBallTrailParticles(this.ball);
    }

    private _normalizeDirection(): void {
        const length = Math.sqrt(this.store.direction.x ** 2 + this.store.direction.z ** 2);
        if (length === 0) return;
        this.store.direction.x /= length;
        this.store.direction.z /= length;
    }

    move(): void {
        const pos = this.ball.position;
        const leftBorder = GameContext.borders.get('left');
        const rightBorder = GameContext.borders.get('right');
        const upBorder = GameContext.borders.get('up');
        const downBorder = GameContext.borders.get('down');

        if (leftBorder && this.ball.intersectsMesh(leftBorder, false) && PlayerManager.getPlayer(1)) {
            PlayerManager.getPlayer(1)!.store.setScore(+1);
            GameContext.game?.reset();
        } else if (rightBorder && this.ball.intersectsMesh(rightBorder, false) && PlayerManager.getPlayer(0)) {
            PlayerManager.getPlayer(0)!.store.setScore(+1);
            GameContext.game?.reset();
        }

        if ((upBorder && this.ball.intersectsMesh(upBorder, false)) ||
            (downBorder && this.ball.intersectsMesh(downBorder, false))) {
            this.store.direction.z *= -1;
        }

        const now = Date.now();
        const player0 = PlayerManager.getPlayer(0);
        const player1 = PlayerManager.getPlayer(1);
        const player0Bar = player0?.bar ?? null;
        const player1Bar = player1?.bar ?? null;
        const collidedWithBar =
            (!!player0Bar && this.ball.intersectsMesh(player0Bar, false)) ||
            (!!player1Bar && this.ball.intersectsMesh(player1Bar, false));

        if (collidedWithBar && now - this.store.lastBarCollisionTime > this.store.barCollisionCooldown) {
            this.store.lastBarCollisionTime = now;

            this.store.direction.x *= -1;
            if (this.store.speed < 0.07) {
                this.store.speed *= 1.05;
            }
            if (player1Bar && this.ball.intersectsMesh(player1Bar, false)) {
                if (player0) player0.store.setLastHit()
            } else if (player0Bar && this.ball.intersectsMesh(player0Bar, false)) {
                if (player1) player1.store.setLastHit()
            }
            const bar = player0Bar && this.ball.intersectsMesh(player0Bar, false) ? player0Bar : player1Bar!;
            const impactOffset = this.ball.position.z - bar.position.z;
            this.store.direction.z = impactOffset / (bar.scaling.z || 1);

            const length = Math.sqrt(this.store.direction.x ** 2 + this.store.direction.z ** 2);
            this.store.direction.x /= length;
            this.store.direction.z /= length;
        }
        pos.x += this.store.direction.x * this.store.speed;
        pos.z += this.store.direction.z * this.store.speed;
    }

    reset(): void {
        if (!this.ball) return;
        this.ball.position.x = 0;
        this.ball.position.z = 0;
        this.store.speed = 0.05;
        if (PlayerManager.getPlayer(0)?.store.last_hit) {
            this.store.direction.x = 1
            this.store.direction.z = (Math.random() * 2 - 1) * 0.2;
            console.log("red");
        } else if (PlayerManager.getPlayer(1)?.store.last_hit) {
            this.store.direction.x = -1
            this.store.direction.z = (Math.random() * 2 - 1) * 0.2;
            console.log("blue");
        } else {
            this.store.direction.x = Math.random() < 0.5 ? -1 : 1;
            this.store.direction.z = 0;
            console.log(this.store.direction.x);
        }
        this._normalizeDirection();
    }
}
