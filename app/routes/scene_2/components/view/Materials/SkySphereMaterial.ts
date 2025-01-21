import * as THREE from "three";
import skySphereVertex from "./shaders/skySphere/vertex.glsl";
import skySphereFragment from "./shaders/skySphere/fragment.glsl";

export function SkySphereMaterial() {
  const material = new THREE.ShaderMaterial({
    vertexShader: skySphereVertex,
    fragmentShader: skySphereFragment,
    uniforms: {},
    side: THREE.DoubleSide,
  });

  return material;
}
