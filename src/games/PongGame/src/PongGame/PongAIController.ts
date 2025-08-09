import { Mesh, Vector3 } from '@babylonjs/core';
import { GameContext } from '../GameContext.ts';

export interface AIOptions {
    ballMesh: Mesh;
    paddleMesh: Mesh;
    xAI: number;
    /** Vertical bounds of the playfield */
    bounds: { minZ: number; maxZ: number };
    /** Target position when idle */
    homeZ?: number;
    /** Allowed deviation from home before moving back */
    deadZone?: number;
    /** Sampling interval in milliseconds */
    sampleInterval?: number;
    /** Minimum ball speed to consider it moving */
    minBallSpeed?: number;
    /** Random error applied to predictions */
    errorMargin?: number;
}

export interface AIApi {
    setHome(z: number): void;
    setEnabled(enabled: boolean): void;
}

let opts: AIOptions | null = null;
let homeZ = 0;
let deadZone = 0.05;
let sampleInterval = 1000;
let minBallSpeed = 0.001;
let sampleTimer = 0;
let lastBallPos: Vector3;
let prevBallPos: Vector3;
let ballVelocity: Vector3;
let predictedImpact: number | null = null;
let enabled = true;
let errorMargin = 0;

export function initAI(options: AIOptions): AIApi {
    opts = options;
    homeZ = options.homeZ ?? 0;
    deadZone = options.deadZone ?? 0.05;
    sampleInterval = options.sampleInterval ?? 1000;
    minBallSpeed = options.minBallSpeed ?? 0.001;
    sampleTimer = sampleInterval;
    lastBallPos = options.ballMesh.position.clone();
    prevBallPos = options.ballMesh.position.clone();
    ballVelocity = new Vector3();
    predictedImpact = null;
    enabled = true;
    errorMargin = options.errorMargin ?? 0.2;

    return {
        setHome(z: number) {
            homeZ = z;
        },
        setEnabled(state: boolean) {
            enabled = state;
        },
    };
}

function reflect(value: number, min: number, max: number): number {
    const range = max - min;
    if (range <= 0) return min;
    let n = (value - min) % (2 * range);
    if (n < 0) n += 2 * range;
    if (n > range) n = 2 * range - n;
    return n + min;
}

export function updateAI(dt: number): void {
    if (!opts || !enabled) {
        GameContext.keysPressed['arrowup'] = false;
        GameContext.keysPressed['arrowdown'] = false;
        return;
    }
    const pos = opts.ballMesh.position.clone();
    const frameDeltaZ = pos.z - prevBallPos.z;
    if (ballVelocity.z !== 0 && frameDeltaZ !== 0 && Math.sign(frameDeltaZ) !== Math.sign(ballVelocity.z)) {
        sampleTimer = sampleInterval;
    }
    prevBallPos.copyFrom(pos);

    sampleTimer += dt;
    if (sampleTimer >= sampleInterval) {
        const dtSec = sampleTimer / 1000;
        ballVelocity.x = (pos.x - lastBallPos.x) / dtSec;
        ballVelocity.z = (pos.z - lastBallPos.z) / dtSec;
        lastBallPos.copyFrom(pos);
        sampleTimer = 0;

        if (Math.hypot(ballVelocity.x, ballVelocity.z) > minBallSpeed && ballVelocity.x !== 0) {
            const timeToAI = (opts.xAI - pos.x) / ballVelocity.x;
            if (timeToAI > 0) {
                const zAtImpact = pos.z + ballVelocity.z * timeToAI;
                const baseImpact = reflect(zAtImpact, opts.bounds.minZ, opts.bounds.maxZ);
                const noise = (Math.random() * 2 - 1) * errorMargin;
                const withNoise = baseImpact + noise;
                predictedImpact = Math.min(Math.max(withNoise, opts.bounds.minZ), opts.bounds.maxZ);
            } else {
                predictedImpact = null;
            }
        } else {
            predictedImpact = null;
        }
    }

    const paddlePos = opts.paddleMesh.position;
    let targetZ = homeZ;
    if (predictedImpact !== null && Math.hypot(ballVelocity.x, ballVelocity.z) > minBallSpeed) {
        if (ballVelocity.x > 0) {
            targetZ = predictedImpact;
        } else if (Math.abs(paddlePos.z - homeZ) <= deadZone) {
            GameContext.keysPressed['arrowup'] = false;
            GameContext.keysPressed['arrowdown'] = false;
            return;
        }
    }

    const diff = targetZ - paddlePos.z;
    const tolerance = 0.01;
    const step = 0.13;

    GameContext.keysPressed['arrowup'] = false;
    GameContext.keysPressed['arrowdown'] = false;

    if (Math.abs(diff) > tolerance) {
        if (Math.abs(diff) <= step) {
            paddlePos.z = targetZ;
        } else if (diff > 0) {
            GameContext.keysPressed['arrowup'] = true;
        } else {
            GameContext.keysPressed['arrowdown'] = true;
        }
    }
}

export function dispose(): void {
    GameContext.keysPressed['arrowup'] = false;
    GameContext.keysPressed['arrowdown'] = false;
    opts = null;
}
