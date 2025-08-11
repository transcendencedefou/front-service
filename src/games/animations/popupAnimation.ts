// src/games/animations/popupAnimation.ts
import {
    Animation,
    EasingFunction,
    BackEase,
    Vector3,
    Mesh
} from '@babylonjs/core';

export type PopupOptions = {
    /** durée totale en millisecondes (par défaut 200ms) */
    durationMs?: number;
    /** scale max (par défaut 1.15) */
    scale?: number;
    /** petit saut vertical en unités monde (par défaut 0.07) */
    lift?: number;
    /** frames par seconde pour l’animation (par défaut 60) */
    fps?: number;
    /** position Y de base à laquelle revenir (sinon on prend la valeur actuelle) */
    baseY?: number;
    /** intensité de l’overshoot du BackEase (0.0–1.5, par défaut 0.8) */
    overshoot?: number;
};

export function popCell(mesh: Mesh, options: PopupOptions = {}) {
    const {
        durationMs = 200,
        scale = 1.15,
        lift = 0.07,
        fps = 60,
        baseY = mesh.position.y,
        overshoot = 0.8,
    } = options;

    const totalFrames = Math.max(1, Math.round((durationMs / 1000) * fps));
    const mid = Math.floor(totalFrames / 2);

    const scaleAnim = new Animation(
        'tttPopScale',
        'scaling',
        fps,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    scaleAnim.setKeys([
        { frame: 0, value: new Vector3(1, 1, 1) },
        { frame: mid, value: new Vector3(scale, scale, scale) },
        { frame: totalFrames, value: new Vector3(1, 1, 1) },
    ]);
    const ease = new BackEase(overshoot);
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);
    scaleAnim.setEasingFunction(ease);

    // --- Petit saut vertical ---
    const posAnim = new Animation(
        'tttPopPos',
        'position',
        fps,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    posAnim.setKeys([
        { frame: 0, value: new Vector3(mesh.position.x, baseY, mesh.position.z) },
        { frame: mid, value: new Vector3(mesh.position.x, baseY + lift, mesh.position.z) },
        { frame: totalFrames, value: new Vector3(mesh.position.x, baseY, mesh.position.z) },
    ]);
    const posEase = new BackEase(overshoot * 0.75);
    posEase.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);
    posAnim.setEasingFunction(posEase);

    mesh.getScene().beginDirectAnimation(mesh, [scaleAnim, posAnim], 0, totalFrames, false);
}

export function resetCellAnimation(mesh: Mesh, baseY: number) {
    mesh.scaling.set(1, 1, 1);
    mesh.position.y = baseY;
}
