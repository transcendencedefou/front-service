import {
  Engine,
  Scene,
  Vector3,
  ArcRotateCamera,
  TransformNode
} from '@babylonjs/core';
import { gsap } from 'gsap';
import { setupSynthwaveScene } from "@/games/meshes/setupSynthwaveScene.ts";
import { CameraState, CAMERA_POSITIONS } from '@/games/services/cameraPositions.ts';

/**
 * Singleton responsible for Babylon engine/scene/camera creation
 * and for running the unique render loop shared by all games.
 */
export class SceneService {
  private static _instance: SceneService | null = null;

  readonly engine: Engine;
  readonly scene: Scene;
  readonly camera: ArcRotateCamera;
  readonly zoneGameA: TransformNode;
  readonly zoneGameB: TransformNode;

  private beforeRenderCbs: Set<(dt: number) => void> = new Set();
  private cameraMoveQueue: Promise<void> = Promise.resolve();
  private cameraMoving = false;

  private constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);

    const menu = CAMERA_POSITIONS.menu;
    this.camera = new ArcRotateCamera('camera',
        menu.alpha,
        menu.beta,
        menu.radius,
        menu.target.clone(),
        this.scene!);
    this.camera.inputs.clear();
    this.camera.attachControl(canvas, true);
    this.scene!.activeCamera = this.camera;

    setupSynthwaveScene(this.scene)
    // zones separated in the world
    this.zoneGameA = new TransformNode('zoneGameA', this.scene);
    this.zoneGameB = new TransformNode('zoneGameB', this.scene);
    this.zoneGameA.position = new Vector3(-20, 0, 0);
    this.zoneGameB.position = new Vector3(20, 0, 0);

    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;
    let lastFrameTime = performance.now();

    this.engine.runRenderLoop(() => {
      const now = performance.now();
      const delta = now - lastFrameTime;
      if (delta < frameTime) {
        return;
      }
      lastFrameTime = now;
      const dt = delta / 1000;
      this.beforeRenderCbs.forEach(cb => cb(dt));
      this.scene.render();
    });
  }

  static getInstance(canvas: HTMLCanvasElement): SceneService {
    if (!this._instance) {
      this._instance = new SceneService(canvas);
    }
    return this._instance;
  }

  /** Register a callback executed before each frame render. */
  onBeforeRender(cb: (dt: number) => void): () => void {
    this.beforeRenderCbs.add(cb);
    return () => this.beforeRenderCbs.delete(cb);
  }

  /**
   * Animate the camera to reach the provided state using GSAP for
   * smoother and more natural curves.
   */
  moveCameraTo(state: CameraState): Promise<void> {
    this.cameraMoveQueue = this.cameraMoveQueue.then(() => new Promise(resolve => {
      this.cameraMoving = true;
      const duration = 1.5;
      const tl = gsap.timeline({
        defaults: { duration, ease: 'power2.inOut' },
        onUpdate: () => this.camera.setTarget(this.camera.target),
        onComplete: () => {
          this.camera.setTarget(state.target);
          this.cameraMoving = false;
          resolve();
        }
      });

      tl.to(this.camera, {
        alpha: state.alpha,
        beta: state.beta,
        radius: state.radius
      }, 0)
        .to(this.camera.target, {
          x: state.target.x,
          y: state.target.y,
          z: state.target.z
        }, 0);
    }));
    return this.cameraMoveQueue;
  }

  isCameraMoving(): boolean {
    return this.cameraMoving;
  }

  /**
   * Convenience helper to move the camera to predefined destinations.
   */
  navigateTo(dest: keyof typeof CAMERA_POSITIONS): Promise<void> {
    return this.moveCameraTo(CAMERA_POSITIONS[dest]);
  }

  goToMenu(): Promise<void> {
    return this.navigateTo('menu');
  }

  goToPong(): Promise<void> {
    return this.navigateTo('pong');
  }

  goToTictactoe(): Promise<void> {
    return this.navigateTo('tictactoe');
  }

  /** Dispose engine and scene. */
  dispose(): void {
    this.engine.stopRenderLoop();
    this.scene.dispose();
    this.engine.dispose();
    SceneService._instance = null;
  }
}

export default SceneService;
