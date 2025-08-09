import {
    MeshBuilder,
    Vector3,
    Color3,
    StandardMaterial,
} from '@babylonjs/core';
import { GameContext } from '../GameContext.ts';

export function createTicTacToePlaygroundMeshes(): void {
    const scene = GameContext.scene!;
    const { width , depth } = GameContext.size.width;

    const groundMaterial = new StandardMaterial('groundMaterial', scene);
    groundMaterial.emissiveColor = Color3.White();
    groundMaterial.alpha = 0.95;

    const playground = MeshBuilder.CreateGround('ground', { width, height: depth }, scene);
    playground.material = groundMaterial;
}
