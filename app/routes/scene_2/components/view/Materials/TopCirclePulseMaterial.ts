import * as THREE from "three";
import topCircleVertex from "./shaders/topCircle/vertex.glsl";
import topCircleFragment from "./shaders/topCircle/fragment.glsl";

export function TopCirclePulseMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
    },
    vertexShader: topCircleVertex,
    fragmentShader: topCircleFragment,
    transparent: true,
  });

  return material;
}
