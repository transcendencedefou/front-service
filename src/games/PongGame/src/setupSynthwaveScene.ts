import {
    Color3,
    Color4,
    DefaultRenderingPipeline,
    GlowLayer,
    Scene,
    ColorCurves,
    MeshBuilder,
    StandardMaterial,
} from '@babylonjs/core';

export function setupSynthwaveScene(scene: Scene): void {
    scene.clearColor = new Color4(0, 0.0, 0, 1);

    const glow = new GlowLayer("glow", scene);
    glow.intensity = 0.4;

    const pipeline = new DefaultRenderingPipeline("synthwave", true, scene, [scene.activeCamera!]);

    pipeline.imageProcessing.toneMappingEnabled = true;
    pipeline.imageProcessing.exposure = 1.0;
    pipeline.imageProcessing.contrast = 1.2;
    pipeline.imageProcessing.colorCurvesEnabled = true;

    const curves = new ColorCurves();
    curves.globalHue = 310;
    curves.globalSaturation = 30;
    pipeline.imageProcessing.colorCurves = curves;

    const grid = MeshBuilder.CreateGround("grid", {
        width: 100,
        height: 100,
        subdivisions: 50
    }, scene);
    grid.position.set(0, 0, 0);

    const gridMat = new StandardMaterial("gridMat", scene);
    gridMat.emissiveColor = new Color3(0, 1, 1); // Cyan néon
    gridMat.wireframe = true;
    grid.material = gridMat;
    grid.position.y = -4;
}
