import * as THREE from "three";
import insideConeVertex from "./shaders/insideCone/vertex.glsl";
import insideConeFragment from "./shaders/insideCone/fragment.glsl";

export function InsideConeMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      maxIntensity: { value: 0.4 },
    },
    vertexShader: insideConeVertex,
    fragmentShader: insideConeFragment,
    transparent: true,
  });

  return material;
}
