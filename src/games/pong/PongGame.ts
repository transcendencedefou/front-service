import { Scene, TransformNode, Mesh } from '@babylonjs/core';
import IGame from '@/games/IGame';
import { PlayerManager } from '@/games/Players/PlayerManager.ts';
import Ball from '@/games/pong/Ball.ts';
import { createPongPlaygroundMeshes } from '@/games/meshes/createPongPlaygroundMeshes';
import { updateAI } from '@/games/pong/PongAIController.ts';
import { useGameStore } from '@/stores/gameStore';
import { useBallStore } from '@/stores/ballStore';

/** Pong game adapted from legacy implementation. */
export class PongGame implements IGame {
  readonly name = 'Pong';

  private ball: Ball | null = null;
  private borders: Map<string, Mesh> = new Map();
  private playgroundMeshes: Mesh[] = [];
  private running = false;
  private ended = false;
  private size = { width: 0, depth: 0 };
  private keysPressed: Record<string, boolean> = { w: false, s: false, arrowup: false, arrowdown: false, r: false };

  private handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (key in this.keysPressed) {
      this.keysPressed[key] = true;
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (key in this.keysPressed) {
      this.keysPressed[key] = false;
    }
    if (key === ' ') {
      this.running = !this.running;
    }
    if (key === 'r') {
      this.hardReset();
    }
  };

  init(scene: Scene, parent: TransformNode): void {
    this.running = false;
    this.keysPressed = { w: false, s: false, arrowup: false, arrowdown: false, r: false };
    this.size = { width: 9, depth: 6 };
    const size = this.size;

    useGameStore().setGameType('pong');
    PlayerManager.addPlayer('Player', scene, size, parent);
    // PlayerManager.addPlayer('Player', scene, size, parent);

    const borders = createPongPlaygroundMeshes(scene, size, parent);
    Object.entries(borders).forEach(([name, mesh]) => {
      this.borders.set(name, mesh);
      this.playgroundMeshes.push(mesh);
    });

    const ground = scene.getMeshByName('ground');
    if (ground) {
      this.playgroundMeshes.push(ground as Mesh);
    }
    const centerLine = scene.getMeshByName('centerLine');
    if (centerLine) {
      this.playgroundMeshes.push(centerLine as Mesh);
    }

    this.setBallDefaultSpeed(0.04);
    this.setBallMaxSpeed(0.12);
    this.setBallAcceleration(1.1);

    this.ball = new Ball(scene, (n) => this.getBorder(n), parent);

    PlayerManager.addAI('AI', this.ball.getMesh(), scene, size, this.keysPressed, parent);
  }

  start(): void {
    this.running = false;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  stop(): void {
    this.running = false;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  update(dt: number): void {
    if (this.isEnded()) return;

    updateAI(dt * 1000);

    if (this.running) {
      const p0 = PlayerManager.getPlayer(0);
      const p1 = PlayerManager.getPlayer(1);
      if (this.keysPressed['w']) p0?.moveUp();
      if (this.keysPressed['s']) p0?.moveDown();
      if (this.keysPressed['arrowup']) p1?.moveUp();
      if (this.keysPressed['arrowdown']) p1?.moveDown();
      this.ball?.move();
    }

    const gameStore = useGameStore();
    for (const player of PlayerManager.listPlayers()) {
      if (player.store.score >= 3) {
        gameStore.setWinner(player.store.name);
        this.running = false;
        this.ended = true;
      }
    }
  }

  reset(): void {
    this.ended = false;
    this.running = false;
    this.ball?.reset();
    useGameStore().setWinner('');
    PlayerManager.resetPlayersPos();
  }

  hardReset(): void {
    this.running = false;
    PlayerManager.clearLastHit();
    PlayerManager.resetPlayersScore();
    this.reset();
  }

  getBorder(name: string): Mesh | undefined {
    return this.borders.get(name);
  }

  setBallDefaultSpeed(speed: number): void {
    useBallStore().setDefSpeed(speed);
  }

  setBallMaxSpeed(speed: number): void {
    useBallStore().setMaxSpeed(speed);
  }

  setBallAcceleration(speed: number): void {
    useBallStore().setAcceleration(speed);
  }

  isEnded(): boolean {
    return this.ended;
  }

  dispose(): void {
    this.stop();
    this.ball?.dispose();
    this.ball = null;
    this.playgroundMeshes.forEach(m => m.dispose());
    this.playgroundMeshes = [];
    this.borders.forEach(m => m.dispose());
    this.borders.clear();
    PlayerManager.clearMap();
  }
}

export default PongGame;
