import * as THREE from "three";
import arrowPlaneVertex from "./shaders/arrowPlane/vertex.glsl";
import arrowPlaneFragment from "./shaders/arrowPlane/fragment.glsl";

export function ArrowPlaneMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: arrowPlaneVertex,
    fragmentShader: arrowPlaneFragment,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
  });

  return material;
}
