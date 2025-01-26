import * as THREE from "three";
import starsVertex from "./shaders/stars/vertex.glsl";
import starsFragment from "./shaders/stars/fragment.glsl";

export function StarsMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uSunPosition: { value: new THREE.Vector3() },
      uPointSize: { value: 10.0 },
      uPixelRatio: {
        value:
          typeof window != "undefined"
            ? Math.min(window.devicePixelRatio, 2.0)
            : null,
      },
      uBrightStrength: { value: 0.8 }, // [0-1]
    },
    vertexShader: starsVertex,
    fragmentShader: starsFragment,
  });

  return material;
}
