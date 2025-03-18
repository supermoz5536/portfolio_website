import * as THREE from "three";
import sunVertex from "./shaders/sun/vertex.glsl";
import sunFragment from "./shaders/sun/fragment.glsl";

export function SunMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uSunPosition: { value: new THREE.Vector3() },
    },
    vertexShader: sunVertex,
    fragmentShader: sunFragment,
    transparent: true,
    blending: THREE.AdditiveBlending, // 加算ブレンドを適用
  });

  return material;
}
