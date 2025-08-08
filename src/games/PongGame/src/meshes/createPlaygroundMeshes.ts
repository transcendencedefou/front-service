import {
    MeshBuilder,
    Vector3,
    Color3,
    StandardMaterial,
    Mesh,
} from '@babylonjs/core';
import { GameContext } from '../GameContext.ts';

export function createPlaygroundMeshes(): void {
    const scene = GameContext.scene!;
    const { width, depth } = GameContext.size;

    const groundMaterial = new StandardMaterial('groundMaterial', scene);
    groundMaterial.emissiveColor = Color3.Black();
    groundMaterial.alpha = 0.95;

    const playground = MeshBuilder.CreateGround('ground', { width, height: depth }, scene);
    playground.material = groundMaterial;

    const centerLineMaterial = new StandardMaterial("lineMat", scene);
    centerLineMaterial.emissiveColor = Color3.White();
    centerLineMaterial.alpha = 0.5;

    const centerLine = MeshBuilder.CreatePlane("centerLine", {
        width: 0.1,
        height: depth,
    }, scene);
    centerLine.position = new Vector3(0, 0.01, 0);
    centerLine.rotation.x = Math.PI / 2;
    centerLine.material = centerLineMaterial;

    const borderMaterial = new StandardMaterial('borderMaterial', scene);
    borderMaterial.emissiveColor = Color3.White();
    borderMaterial.alpha = 0.95;

    GameContext.borders = new Map<string, Mesh>();

    const pw = playground._width;
    const ph = playground._height;

    const createBorder = (name: string, dims: { width: number, height: number, depth: number }, pos: Vector3) => {
        const border = MeshBuilder.CreateBox(name, { ...dims, updatable: true }, scene);
        border.position = pos;
        border.material = borderMaterial;
        GameContext.borders.set(name, border);
    };

    createBorder('left', { width: 0.1, height: 0.01, depth: ph + 0.1 }, new Vector3(-pw / 2 - 0.05, 0, 0));
    createBorder('right', { width: 0.1, height: 0.01, depth: ph + 0.1 }, new Vector3(pw / 2 + 0.05, 0, 0));
    createBorder('up', { width: pw, height: 0.01, depth: 0.1 }, new Vector3(0, 0, ph / 2));
    createBorder('down', { width: pw, height: 0.01, depth: 0.1 }, new Vector3(0, 0, -ph / 2));
}
