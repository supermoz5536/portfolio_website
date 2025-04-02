import * as THREE from "three";
import fullScreenVertex from "./shaders/fullScreenClip/vertex.glsl";
import fullScreenFragment from "./shaders/fullScreenClip/fragment.glsl";

export function FullScreenClipMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uScrollRatio: { value: 0.0 },
      uAspectRatio: { value: 0.0 },
      uAngle: { value: -Math.PI / 4 },
    },
    vertexShader: fullScreenVertex,
    fragmentShader: fullScreenFragment,
    depthTest: false,
  });

  return material;
}
