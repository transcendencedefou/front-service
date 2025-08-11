import {
    MeshBuilder,
    Color3,
    StandardMaterial,
    Scene
} from '@babylonjs/core';

export function createTicTacToePlaygroundMeshes(scene: Scene, size: { width: number; depth: number }): void {
    const { width, depth } = size;

    const groundMaterial = new StandardMaterial('groundMaterial', scene);
    groundMaterial.emissiveColor = Color3.White();
    groundMaterial.alpha = 0.95;

    const playground = MeshBuilder.CreateGround('ground', { width, height: depth }, scene);
    playground.material = groundMaterial;
}
