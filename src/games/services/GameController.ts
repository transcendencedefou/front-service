import { TransformNode } from '@babylonjs/core';
import IGame from '@/games/IGame.ts';
import SceneService from './SceneService.ts';
import { PlayerManager } from '@/games/Players/PlayerManager.ts';
import { CameraState, CAMERA_POSITIONS } from '@/games/services/cameraPositions.ts';

type Zone = 'A' | 'B';
interface GameEntry { game: IGame; zone: TransformNode; camera: CameraState; }

/**
 * Register games and control which one is currently active.
 * Only the active game receives update calls from the shared render loop.
 */
export default class GameController {
  private games = new Map<string, GameEntry>();
  private active: GameEntry | null = null;
  private disposeRender?: () => void;

  constructor(private sceneService: SceneService) {
    this.disposeRender = this.sceneService.onBeforeRender((dt) => {
      this.active?.game.update(dt);
    });
  }

  /** Register a game for the given zone. */
  private register(game: IGame, zone: Zone, camera: CameraState): void {
    const parent = zone === 'A' ? this.sceneService.zoneGameA : this.sceneService.zoneGameB;
    PlayerManager.clearMap();
    game.init(this.sceneService.scene, parent);
    this.games.set(game.name, { game, zone: parent, camera });
  }

  /** Public wrapper to register games without activating them. */
  registerGame(name: string, factory: () => IGame, zone: Zone, camera: CameraState): void {
    if (this.games.has(name)) return;
    this.register(factory(), zone, camera);
  }

  /** Activate a game by name, pausing the previous one. */
  private async activate(name: string): Promise<void> {
    const next = this.games.get(name);

    if (!next || this.active === next) return;

    this.active?.game.stop();
    this.active = next;
    await this.sceneService.moveCameraTo(next.camera);
    this.active.game.start();
    console.log(PlayerManager.listPlayers());
  }

  /**
   * Register the game if needed then activate it.
   */
  async launchGame(name: string, factory?: () => IGame, zone?: Zone, camera?: CameraState): Promise<void> {

    if (!this.games.has(name)) {
      if (!factory || !zone || !camera) return;
      this.register(factory(), zone, camera);
    }
    await this.activate(name);
  }

  /** Reset the chosen game and return the camera to the menu position. */
  async resetGame(name: string): Promise<void> {
    await this.sceneService.moveCameraTo(CAMERA_POSITIONS.menu);
    const entry = this.games.get(name);
    if (!entry) return;
    const game: any = entry.game;
    if (this.active === entry) {
      this.active.game.stop();
      this.active = null;
    }
    if (typeof game.hardReset === 'function') game.hardReset();
    else if (typeof game.reset === 'function') game.reset();
  }

  /** Dispose a single game and remove it from registry. */
  disposeGame(name: string): void {
    const entry = this.games.get(name);
    if (!entry) return;
    if (this.active === entry) {
      this.active.game.stop();
      this.active = null;
    }
    entry.game.dispose();
    this.games.delete(name);
  }

  /** List registered game names. */
  listGames(): string[] {
    return Array.from(this.games.keys());
  }

  /** Name of the currently active game. */
  getActiveGame(): string | null {
    return this.active?.game.name ?? null;
  }

  dispose(): void {
    this.games.forEach(({ game }) => game.dispose());
    this.games.clear();
    this.active = null;
    this.disposeRender?.();
    this.disposeRender = undefined;
    this.sceneService.dispose();
  }
}
