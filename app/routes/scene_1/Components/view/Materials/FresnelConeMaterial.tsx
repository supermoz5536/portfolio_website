import * as THREE from "three";
import fresnelConeVertex from "./shaders/fresnelCone/vertex.glsl";
import fresnelConeFragment from "./shaders/fresnelCone/fragment.glsl";

export function FresnelConeMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      maxIntensity: { value: 0.4 },
    },
    vertexShader: fresnelConeVertex,
    fragmentShader: fresnelConeFragment,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return material;
}
