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
import { useColorStore } from '@/stores/colorStore';
import { watch } from 'vue';

export function setupSynthwaveScene(scene: Scene): void {

    const colorStore = useColorStore();
    const updateClearColor = (hex: string) => {
        scene.clearColor = Color4.FromHexString(hex);
    };
    updateClearColor(colorStore.sceneClearColor);
    watch(() => colorStore.sceneClearColor, (v) => updateClearColor(v));

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

    const sphere = MeshBuilder.CreateSphere("gridSphere", {
        diameter: 100,
        segments: 16,
        sideOrientation: Mesh.BACKSIDE
    }, scene);
    sphere.rotation.x = Math.PI / 2;
    sphere.rotation.z = Math.PI / 2;

    const sphereMat = new StandardMaterial("gridSphereMat", scene);
    const updateSphereColor = (hex: string) => {
        sphereMat.emissiveColor = Color3.FromHexString(hex);
    };
    updateSphereColor(colorStore.synthwaveGridColor);
    watch(() => colorStore.synthwaveGridColor, (v) => updateSphereColor(v));
    sphereMat.wireframe = true;
    sphere.material = sphereMat;
}
