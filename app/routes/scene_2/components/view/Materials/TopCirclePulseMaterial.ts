import * as THREE from "three";
import topCircleVertex from "./shaders/topCirclePulse/vertex.glsl";
import topCircleFragment from "./shaders/topCirclePulse/fragment.glsl";

export function TopCirclePulseMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
    },
    vertexShader: topCircleVertex,
    fragmentShader: topCircleFragment,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  return material;
}
