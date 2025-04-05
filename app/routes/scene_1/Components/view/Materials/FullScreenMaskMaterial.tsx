import * as THREE from "three";
import fullScreenMaskVertex from "./shaders/fullScreenMask/vertex.glsl";
import fullScreenMaskFragment from "./shaders/fullScreenMask/fragment.glsl";

export function FullScreenMaskMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uOpacity: { value: 1.0 },
    },
    vertexShader: fullScreenMaskVertex,
    fragmentShader: fullScreenMaskFragment,
    transparent: true,
    opacity: 1.0,
    depthTest: false,
  });

  return material;
}
