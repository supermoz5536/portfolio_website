import * as THREE from "three";
import fullScreenWABVertex from "./shaders/fullScreenWAB/vertex.glsl";
import fullScreenWABFragment from "./shaders/fullScreenWAB/fragment.glsl";

export function FullScreenWABMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uScrollRatio: { value: 0.0 },
      uTexture: { value: null },
    },
    vertexShader: fullScreenWABVertex,
    fragmentShader: fullScreenWABFragment,
    transparent: true,
    depthTest: false,
  });

  return material;
}
