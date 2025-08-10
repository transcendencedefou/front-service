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

export function createBallTrailParticles(ball: Mesh, scene: Scene): ParticleSystem | null {
    const particleSystem = new ParticleSystem("ballTrailParticles", 2000, scene);
    particleSystem.particleTexture = new Texture("https://assets.babylonjs.com/textures/flare.png", scene);

    particleSystem.color1 = new Color4(112 / 255, 157 / 255, 255 / 255, 1);
    particleSystem.color2 = new Color4(112 / 255, 157 / 255, 255 / 255, 1);
    particleSystem.colorDead = new Color4(112 / 255, 157 / 255, 255 / 255, 1);

    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.2;

    particleSystem.minLifeTime = 0.15;
    particleSystem.maxLifeTime = 0.15;

    particleSystem.emitRate = 2500;

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
    let lastMoveTime = performance.now();

    scene.onBeforeRenderObservable.add(() => {
        const currentPosition = ball.position;
        const hasMoved = !currentPosition.equalsWithEpsilon(lastPosition, 0.001);
        const now = performance.now();

        if (hasMoved) {
            lastMoveTime = now;
            if (!particleSystem.isStarted()) {
                particleSystem.start();
            }
        } else if (now - lastMoveTime > 100 && particleSystem.isStarted()) {
            particleSystem.stop();
        }

        lastPosition.copyFrom(currentPosition);
    });

    return particleSystem;
}

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
