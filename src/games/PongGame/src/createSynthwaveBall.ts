import {
    Mesh,
    MeshBuilder,
    StandardMaterial,
    Color3,
    Color4,
    Scene,
    PointLight,
    Vector3,
    ParticleSystem,
    Texture
} from '@babylonjs/core';
import { GameContext} from "@/games/PongGame/src/GameContext.ts";
import { useColorsStore } from "@/stores/colorsStore.ts";
import {PlayerManager} from "@/games/PongGame/src/PlayerManager.ts";

function updateTrailColors(particleSystem: ParticleSystem) {
    const colorsStore = useColorsStore()
    const color1 = colorsStore.colors4.get("ball_particles1");
    if (color1) particleSystem.color1 = color1;
    const color2 = colorsStore.colors4.get("ball_particles2");
    if (color2) particleSystem.color2 = color2;
    const colorDead = colorsStore.colors4.get("ball_particles_colorDead");
    if (colorDead) particleSystem.colorDead = colorDead;
}


export function createBallTrailParticles(ball: Mesh): void  {
    if (!GameContext.scene)
        return
    const colorsStore = useColorsStore();
    colorsStore.addColor4Rgb("ball_particles1", 112, 157, 255, 1);
    colorsStore.addColor4Rgb("ball_particles2", 112, 157, 255, 1);
    colorsStore.addColor4Rgb("ball_particles_colorDead", 112, 157, 255, 1);


    const particleSystem = new ParticleSystem("ballTrailParticles", 2000, GameContext.scene);

    particleSystem.particleTexture = new Texture("https://assets.babylonjs.com/textures/flare.png", GameContext.scene);

    updateTrailColors(particleSystem);

    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.2;

    particleSystem.minLifeTime = 0.15;
    particleSystem.maxLifeTime = 0.15;

    particleSystem.emitRate = 10000;

    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 2;
    particleSystem.updateSpeed = 0.0075;

    particleSystem.direction1 = new Vector3(-0.5, 0, -0.5);
    particleSystem.direction2 = new Vector3(0.5, 0.2, 0.5);

    particleSystem.emitter = ball;
    particleSystem.minEmitBox = new Vector3(-0.1, 0, -0.1);
    particleSystem.maxEmitBox = new Vector3(0.1, 0, 0.1);

    particleSystem.start();
    let lastPosition = ball.position.clone();

    GameContext.scene.onBeforeRenderObservable.add(() => {
        if (PlayerManager.getPlayer(0)?.store.last_hit) {
            useColorsStore().setTrailColors(
                new Color4(0/255, 50/255, 175/255),
                new Color4(50/255, 50/255, 175/255),
                new Color4(150/255, 150/255, 255/255)
            );
        } else if (PlayerManager.getPlayer(1)?.store.last_hit) {
            useColorsStore().setTrailColors(
                new Color4(0/255, 255/255, 255/255),
                new Color4(150/255, 0/255, 255/255),
                new Color4(255/255, 0/255, 100/255)
            );
        }
        updateTrailColors(particleSystem);
        const currentPosition = ball.position;
        const hasMoved = !currentPosition.equalsWithEpsilon(lastPosition, 0.001);
        if (hasMoved && !particleSystem.isStarted()) {
            particleSystem.start();
        } else if (!hasMoved && particleSystem.isStarted()) {
            particleSystem.stop();
        }

        lastPosition.copyFrom(currentPosition);
    });
}


/**
 * Crée une balle néon stylée avec quadrillage (wireframe) par-dessus.
 * @param scene La scène Babylon.js
 * @returns Le mesh principal de la balle
 */
export function createSynthwaveBall(scene: Scene): Mesh {
    const ballMaterial = new StandardMaterial('ballMaterial', scene);
    ballMaterial.emissiveColor = new Color3().fromHexString("#A9DFFF");
    ballMaterial.diffuseColor = new Color3().fromHexString("#A9DFFF");
    ballMaterial.alpha = 1;

    const ball = MeshBuilder.CreateSphere('ball', {
        diameter: 0.3,
        segments: 8,
    }, scene);
    ball.material = ballMaterial;
    ball.position.y = 0.15;

    const light = new PointLight("ballLight", new Vector3(0, 1, 0), scene);
    light.diffuse = new Color3(0.6, 0.8, 1);
    light.intensity = 0.3
    light.range = 5
    light.parent = ball;

    return ball;
}
