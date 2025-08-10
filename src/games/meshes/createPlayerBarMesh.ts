import { MeshBuilder, Color3, StandardMaterial, Mesh, Scene, TransformNode } from '@babylonjs/core';

interface PlayerStoreLike {
  id: number;
  bar_depth: number;
  pos: { x: number; z: number };
}

export function createPlayerBarMesh(
  scene: Scene,
  store: PlayerStoreLike,
  parent?: TransformNode | null,
): Mesh {
  const neonMaterial = new StandardMaterial('neonMaterial', scene);
  if (store.id === 0) {
    neonMaterial.emissiveColor = new Color3(0.8, 0, 0);
  } else if (store.id === 1) {
    neonMaterial.emissiveColor = new Color3(0, 0, 0.8);
  }
  neonMaterial.alpha = 1;
  neonMaterial.wireframe = true;

  const bar = MeshBuilder.CreateTiledBox(`playerBar-${store.id}`, {
    width: 0.08,
    height: 0.2,
    depth: store.bar_depth,
    tileSize: 2,
    updatable: true,
  }, scene);

  bar.material = neonMaterial;
  bar.position.set(store.pos.x, 0.2, store.pos.z);
  if (parent) {
    bar.parent = parent;
  }
  return bar;
}

export default createPlayerBarMesh;
