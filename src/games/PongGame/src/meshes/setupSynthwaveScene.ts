import {
    Color3,
    Color4,
    DefaultRenderingPipeline,
    GlowLayer,
    Scene,
    ColorCurves,
    MeshBuilder,
    StandardMaterial, Mesh,
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
    curves.globalSaturation = 50;
    pipeline.imageProcessing.colorCurves = curves;

    // const grid = MeshBuilder.CreateGround("grid", {
    //     width: 100,
    //     height: 100,
    //     subdivisions: 50
    // }, scene);
    // grid.position.set(0, 0, 0);
    //
    // const gridMat = new StandardMaterial("gridMat", scene);
    // gridMat.emissiveColor = new Color3(0, 1, 1); // Cyan néon
    // gridMat.wireframe = true;
    // grid.material = gridMat;
    // grid.position.y = -4;

    const sphere = MeshBuilder.CreateSphere("gridSphere", {
        diameter: 100,
        segments: 16,
        sideOrientation: Mesh.BACKSIDE
    }, scene);
    sphere.rotation.x = Math.PI / 2;
    sphere.rotation.z = Math.PI / 2;

    const sphereMat = new StandardMaterial("gridSphereMat", scene);
    sphereMat.emissiveColor = new Color3(0, 1, 1); // Cyan néon
    sphereMat.wireframe = true;
    sphere.material = sphereMat;
}
