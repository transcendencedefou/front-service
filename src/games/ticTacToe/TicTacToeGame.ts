import {
  Mesh,
  Scene,
  TransformNode,
  StandardMaterial,
  Color3,
  PointerEventTypes,
  Observer,
  PointerInfo,
} from '@babylonjs/core';
import IGame from '@/games/IGame';
import {createTTTGridMeshes} from "@/games/meshes/createTTTGridMeshes.ts";
import { popCell, resetCellAnimation } from '@/games/animations/popupAnimation.ts';
import { PlayerManager } from '@/games/Players/PlayerManager.ts';
import { useGameStore } from '@/stores/gameStore';


export class TicTacToeGame implements IGame {
  readonly name = 'TicTacToe';

  private scene!: Scene;
  private root!: TransformNode;
  private cells: Mesh[][] = [];
  private state: number[][] = [];
  private currentPlayer = 0;
  private pointerObserver: Observer<PointerInfo> | null = null;

  private cellMaterial!: StandardMaterial;
  private borderMat!: StandardMaterial;
  private playerMats: StandardMaterial[] = [];

  init(scene: Scene, parent: TransformNode): void {
    this.scene = scene;
    this.root = new TransformNode('tttRoot', scene);
    this.root.parent = parent;

    useGameStore().setGameType('ticTacToe');
    PlayerManager.addBasicPlayer('Player 1');
    PlayerManager.addBasicPlayer('Player 2');

    this.playerMats[1] = new StandardMaterial('tttP1', scene);
    this.playerMats[1].emissiveColor = Color3.Red();
    this.playerMats[2] = new StandardMaterial('tttP2', scene);
    this.playerMats[2].emissiveColor = Color3.Blue();

    this.cellMaterial = new StandardMaterial('tttCell', scene);
    this.borderMat = new StandardMaterial('tttBorder', scene);
    this.borderMat.emissiveColor = new Color3(1, 1, 1);

    createTTTGridMeshes(this.scene, this.root, this.cells, this.state, this.cellMaterial, this.borderMat);
  }

  start(): void {
    this.reset();
    this.pointerObserver = this.scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type !== PointerEventTypes.POINTERDOWN) return;

      const pick = pointerInfo.pickInfo;
      const mesh = pick?.pickedMesh as Mesh | undefined;
      if (!pick?.hit || !mesh || !mesh.metadata) return;

      const { x, z } = mesh.metadata as { x: number; z: number };
      if (this.state[x][z] !== 0) return;

      const playerIndex = this.currentPlayer + 1;
      this.state[x][z] = playerIndex;
      mesh.material = this.playerMats[playerIndex];
      popCell(mesh)

      if (this.checkWin(playerIndex)) {
        const player = PlayerManager.getPlayer(this.currentPlayer);
        if (player) {
          this.borderMat.emissiveColor = this.playerMats[playerIndex].emissiveColor
          player.store.incrementScore(1);
          useGameStore().setWinner(player.store.name);
        }
        this.stop();
        return;
      }

      if (this.isBoardFull()) {
        useGameStore().setWinner('draw');
        this.stop();
        return;
      }

      this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
    });
  }

  stop(): void {
    if (this.pointerObserver) {
      this.scene.onPointerObservable.remove(this.pointerObserver);
      this.pointerObserver = null;
    }
  }

  reset(): void {
    for (let x = 0; x < 3; x++) {
      for (let z = 0; z < 3; z++) {
        this.state[x][z] = 0;
        this.cells[x][z].material = this.cellMaterial;
        resetCellAnimation(this.cells[x][z], 0.25);
      }
    }
    this.borderMat.emissiveColor = Color3.White();
    this.currentPlayer = 0;
    useGameStore().setWinner('');
  }

  update(_dt: number): void {
  }

  dispose(): void {
    this.stop();
    for (const row of this.cells) {
      for (const cell of row) {
        cell.dispose();
      }
    }
    this.cells = [];
    this.state = [];
    this.cellMaterial.dispose();
    this.playerMats[1].dispose();
    this.playerMats[2].dispose();
    this.root.dispose();
    PlayerManager.clearMap();
  }

  private isBoardFull(): boolean {
    for (let x = 0; x < 3; x++) {
      for (let z = 0; z < 3; z++) {
        if (this.state[x][z] === 0) return false;
      }
    }
    return true;
  }

  private checkWin(player: number): boolean {
    // rows
    for (let x = 0; x < 3; x++) {
      if (this.state[x][0] === player && this.state[x][1] === player && this.state[x][2] === player) {
        return true;
      }
    }
    // columns
    for (let y = 0; y < 3; y++) {
      if (this.state[0][y] === player && this.state[1][y] === player && this.state[2][y] === player) {
        return true;
      }
    }
    // diagonals
    if (this.state[0][0] === player && this.state[1][1] === player && this.state[2][2] === player) {
      return true;
    }
    if (this.state[0][2] === player && this.state[1][1] === player && this.state[2][0] === player) {
      return true;
    }
    return false;
  }
}

export default TicTacToeGame;

