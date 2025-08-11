import { MeshBuilder, Color3, StandardMaterial, Mesh, Scene, TransformNode } from '@babylonjs/core';
import { useColorStore } from '@/stores/colorStore';
import { watch } from 'vue';

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
  const colorStore = useColorStore();
  const neonMaterial = new StandardMaterial('neonMaterial', scene);
  const updateColor = (hex: string) => {
    neonMaterial.emissiveColor = Color3.FromHexString(hex);
  };
  if (store.id === 0) {
    updateColor(colorStore.playerOneColor);
    watch(() => colorStore.playerOneColor, (v) => updateColor(v));
  } else if (store.id === 1) {
    updateColor(colorStore.playerTwoColor);
    watch(() => colorStore.playerTwoColor, (v) => updateColor(v));
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
