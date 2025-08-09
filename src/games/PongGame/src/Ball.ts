import { Mesh, ParticleSystem, Color4 } from '@babylonjs/core';
import { GameContext } from './GameContext';
import { PlayerManager } from './PlayerManager';
import { createSynthwaveBall, createBallTrailParticles  } from './meshes/createSynthwaveBall.ts';
import { useBallStore } from '@/stores/ballStore.ts'

export default class Ball {
    private store: ReturnType<typeof useBallStore>;
    private ball!: Mesh;
    private trail: ParticleSystem | null;

    constructor() {
        this.store = useBallStore()
        this.store.speed = this.store.def_speed;
        this.store.direction = { x: Math.random() < 0.5 ? -1 : 1, y: 0, z: 0 };
        this._normalizeDirection();
        this.trail = null;

        this._init();
    }

    private _init(): void {
        this.ball = createSynthwaveBall(GameContext.scene!);
        this.trail = createBallTrailParticles(this.ball);
        if (this.trail) {
            this.setTrailColors(new Color4(1, 1, 1, 1), new Color4(1, 1, 1, 1), new Color4(1, 1, 1, 1));
        }
    }

    private _normalizeDirection(): void {
        const length = Math.sqrt(this.store.direction.x ** 2 + this.store.direction.z ** 2);
        if (length === 0) return;
        this.store.direction.x /= length;
        this.store.direction.z /= length;
    }

    move(): void {
        const pos = this.ball.position;
        const leftBorder = GameContext.game?.getBorder('left');
        const rightBorder = GameContext.game?.getBorder('right');
        const upBorder = GameContext.game?.getBorder('up');
        const downBorder = GameContext.game?.getBorder('down');

        if (leftBorder && this.ball.intersectsMesh(leftBorder, false) && PlayerManager.getPlayer(1)) {
            PlayerManager.getPlayer(1)!.store.incrementScore(+1);
            GameContext.game?.reset();
            return;
        } else if (rightBorder && this.ball.intersectsMesh(rightBorder, false) && PlayerManager.getPlayer(0)) {
            PlayerManager.getPlayer(0)!.store.incrementScore(1);
            GameContext.game?.reset();
            return;
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
            if (this.store.speed < this.store.max_speed) {
                this.store.speed *= this.store.acceleration;
            }
            if (player1Bar && this.ball.intersectsMesh(player1Bar, false)) {
                if (player0) player0.store.setLastHit()
                this.setTrailColors(
                    new Color4(0 / 255, 50 / 255, 175 / 255, 1),
                    new Color4(50 / 255, 50 / 255, 175 / 255, 1),
                    new Color4(150 / 255, 150 / 255, 255 / 255, 1)
                );
            } else if (player0Bar && this.ball.intersectsMesh(player0Bar, false)) {
                if (player1) player1.store.setLastHit();
                this.setTrailColors(
                    new Color4(255 / 255, 50 / 255, 0 / 255, 1),
                    new Color4(175 / 255, 0 / 255, 0 / 255, 1),
                    new Color4(255 / 255, 255 / 255, 255 / 255, 1)
                );
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
        this.store.speed = this.store.def_speed;
        if (PlayerManager.getPlayer(0)?.store.last_hit) {
            this.store.direction.x = 1
            this.store.direction.z = (Math.random() * 2 - 1) * 0.2;
        } else if (PlayerManager.getPlayer(1)?.store.last_hit) {
            this.store.direction.x = -1
            this.store.direction.z = (Math.random() * 2 - 1) * 0.2;
        } else {
            this.store.direction.x = Math.random() < 0.5 ? -1 : 1;
            this.store.direction.z = 0;
        }
        this._normalizeDirection();
        if (this.trail) {
            this.setTrailColors(new Color4(1, 1, 1, 1), new Color4(1, 1, 1, 1), new Color4(1, 1, 1, 1));
        }
    }

    setTrailColors(color1: Color4, color2: Color4, colorDead: Color4): void {
        if (!this.trail) return;
        this.trail.color1 = color1;
        this.trail.color2 = color2;
        this.trail.colorDead = colorDead;
    }

    getMesh(): Mesh {
        return this.ball;
    }

    dispose(): void {
        this.trail?.dispose();
        this.trail = null;
        this.ball.dispose();
    }
}
