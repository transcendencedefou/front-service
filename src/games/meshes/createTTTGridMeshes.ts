import {
    MeshBuilder,
    Vector3,
    StandardMaterial,
    Mesh,
    Scene,
    TransformNode, Color3
} from '@babylonjs/core';

export function createTTTGridMeshes(scene: Scene, parent: TransformNode | null, cells: Mesh[][], state: number[][] = [], cellMaterial: StandardMaterial, borderMaterial: StandardMaterial) {
    cellMaterial.emissiveColor = new Color3(1, 1, 1);

    const size = 1.2;
    const spacing = 1.75;

    for (let x = 0; x < 3; x++) {
        cells[x] = [];
        state[x] = [];
        for (let z = 0; z < 3; z++) {
            const cell = MeshBuilder.CreateBox(`cell_${x}_${z}`, { size, height: 0.5 }, scene);
            cell.position = new Vector3((x - 1) * spacing, 0.25, (z - 1) * spacing);
            cell.material = cellMaterial;
            cell.isPickable = true;
            cell.parent = parent!;
            cell.metadata = { x, z };
            cells[x][z] = cell;
            state[x][z] = 0;
        }
    }
    
    const groundMat = new StandardMaterial('groundMat', scene);
    groundMat.emissiveColor = new Color3(0, 0, 0);
    groundMat.alpha = 0.95
    
    const ground = MeshBuilder.CreateGround('ground', {width: 7, height: 7}, scene);
    ground.material = groundMat;
    ground.parent = parent!;


    const pw = ground._width;
    const ph = ground._height;

    const lineY = 0;

    MeshBuilder.CreateBox('border_left', { width: 0.2, height: 0.01, depth: ph + 0.1 }, scene)
        .position.set(-pw / 2 + 0.1, lineY, 0);
    MeshBuilder.CreateBox('border_right', { width: 0.2, height: 0.01, depth: ph + 0.1 }, scene)
        .position.set(pw / 2 - 0.1, lineY, 0);
    MeshBuilder.CreateBox('border_up', { width: pw, height: 0.01, depth: 0.2 }, scene)
        .position.set(0, lineY, ph / 2);
    MeshBuilder.CreateBox('border_down', { width: pw, height: 0.01, depth: 0.2 }, scene)
        .position.set(0, lineY, -ph / 2);

    ['border_left', 'border_right', 'border_up', 'border_down'].forEach(name => {
        const mesh = scene.getMeshByName(name);
        if (mesh) {
            mesh.material = borderMaterial;
            if (parent) mesh.parent = parent;
        }
    });
}