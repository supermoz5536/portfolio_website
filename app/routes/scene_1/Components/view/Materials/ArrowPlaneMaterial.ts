import * as THREE from "three";
import arrowPlaneVertex from "./shaders/arrowPlane/vertex.glsl";
import arrowPlaneFragment from "./shaders/arrowPlane/fragment.glsl";

export function ArrowPlaneMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
    },
    vertexShader: arrowPlaneVertex,
    fragmentShader: arrowPlaneFragment,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return material;
}
