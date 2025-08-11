import { Scene, TransformNode } from '@babylonjs/core';

/**
 * Basic contract every game must follow to be hosted inside the shared scene.
 */
export interface IGame {
  /** Unique game name. */
  readonly name: string;

  /**
   * Initialize game assets under the provided parent node.
   * This method is called once when the game is registered.
   */
  init(scene: Scene, parent: TransformNode): void;

  /** Start the game (subscribe inputs/timers). */
  start(): void;

  /** Stop the game (pause inputs/timers). */
  stop(): void;

  /** Reset game state without recreating assets. */
  reset?(): void;

  /** Completely reset the game, rebuilding all assets. */
  hardReset?(): void;

  /** Called from the shared render loop while the game is active. */
  update(dt: number): void;

  /** Clean up resources permanently. */
  dispose(): void;
}

export default IGame;
