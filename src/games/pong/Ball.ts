import { Mesh, ParticleSystem, Color4, Color3, Scene, TransformNode } from '@babylonjs/core';
import { PlayerManager } from '../Players/PlayerManager.ts';
import { createSynthwaveBall, createBallTrailParticles  } from '@/games/meshes/createSynthwaveBall.ts';
import { useBallStore } from '@/stores/ballStore.ts'
import { useColorStore } from '@/stores/colorStore';
import { watch } from 'vue';

export default class Ball {
    private store: ReturnType<typeof useBallStore>;
    private ball!: Mesh;
    private trail: ParticleSystem | null;
    private lastSpawnTime = 0;
    private graceMs = 600; // délai sans scoring après spawn

    constructor(
        private scene: Scene,
        private getBorder: (name: string) => Mesh | undefined,
        private parent?: TransformNode | null
    ) {
        this.store = useBallStore();
        this.store.speed = this.store.def_speed;
        this.store.direction = { x: Math.random() < 0.5 ? -1 : 1, y: 0, z: 0 };
        this._normalizeDirection();
        this.trail = null;
        this.lastSpawnTime = Date.now();
        this._init();
    }

    private _init(): void {
        this.ball = createSynthwaveBall(this.scene);
        if (this.parent) {
            this.ball.parent = this.parent;
        }
        this.trail = createBallTrailParticles(this.ball, this.scene);
        if (this.trail) {
            const colorStore = useColorStore();
            const updateTrail = (hex: string) => {
                const c = Color4.FromColor3(Color3.FromHexString(hex), 1);
                this.setTrailColors(c, c, c);
            };
            updateTrail(colorStore.ballParticleColor);
            watch(() => colorStore.ballParticleColor, (v) => updateTrail(v));
        }
    }

    private _normalizeDirection(): void {
        const length = Math.sqrt(this.store.direction.x ** 2 + this.store.direction.z ** 2);
        if (length === 0) return;
        this.store.direction.x /= length;
        this.store.direction.z /= length;
    }

    move(): void {
        const now = Date.now();
        const pos = this.ball.position;
        const leftBorder = this.getBorder('left');
        const rightBorder = this.getBorder('right');
        const upBorder = this.getBorder('up');
        const downBorder = this.getBorder('down');

        const canScore = (now - this.lastSpawnTime) > this.graceMs;

        if (canScore && leftBorder && this.ball.intersectsMesh(leftBorder, false) && PlayerManager.getPlayer(1)) {
            PlayerManager.getPlayer(1)!.store.incrementScore(+1);
            this.reset();
            return;
        } else if (canScore && rightBorder && this.ball.intersectsMesh(rightBorder, false) && PlayerManager.getPlayer(0)) {
            PlayerManager.getPlayer(0)!.store.incrementScore(1);
            this.reset();
            return;
        }

        if ((upBorder && this.ball.intersectsMesh(upBorder, false)) ||
            (downBorder && this.ball.intersectsMesh(downBorder, false))) {
            this.store.direction.z *= -1;
        }

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
            let hitter = '';
            if (player1Bar && this.ball.intersectsMesh(player1Bar, false)) {
                if (player0) player0.store.setLastHit();
                const c = Color4.FromColor3(Color3.FromHexString(useColorStore().playerTwoColor), 1);
                this.setTrailColors(c, c, c);
                hitter = player1?.store.name || 'Player2';
            } else if (player0Bar && this.ball.intersectsMesh(player0Bar, false)) {
                if (player1) player1.store.setLastHit();
                const c = Color4.FromColor3(Color3.FromHexString(useColorStore().playerOneColor), 1);
                this.setTrailColors(c, c, c);
                hitter = player0?.store.name || 'Player1';
            }
            const bar = player0Bar && this.ball.intersectsMesh(player0Bar, false) ? player0Bar : player1Bar!;
            const impactOffset = this.ball.position.z - bar.position.z;
            this.store.direction.z = impactOffset / (bar.scaling.z || 1);

            const length = Math.sqrt(this.store.direction.x ** 2 + this.store.direction.z ** 2);
            this.store.direction.x /= length;
            this.store.direction.z /= length;

            // Journaliser l'impact pour ballHit
            this.store.addHit({
                t: now,
                by: hitter,
                pos: { x: this.ball.position.x, z: this.ball.position.z },
                speed: this.store.speed,
                dir: { x: this.store.direction.x, z: this.store.direction.z }
            });
        }
        pos.x += this.store.direction.x * this.store.speed;
        pos.z += this.store.direction.z * this.store.speed;
    }

    reset(): void {
        if (!this.ball) return;
        this.ball.position.x = 0;
        this.ball.position.z = 0;
        this.store.speed = this.store.def_speed;
        this.lastSpawnTime = Date.now();
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
            const colorStore = useColorStore();
            const c = Color4.FromColor3(Color3.FromHexString(colorStore.ballParticleColor), 1);
            this.setTrailColors(c, c, c);
        }
        PlayerManager.resetPlayersPos();
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
