import * as THREE from "three";
import playerShadowVertexShader from "../shaders/playerShadow/vertex.glsl";
import playerShadowFragmentShader from "../shaders/playerShadow/fragment.glsl";

export function PlayerShadow() {
  return (
    <>
      <mesh
        geometry={new THREE.PlaneGeometry(24, 24)}
        material={
          new THREE.ShaderMaterial({
            vertexShader: playerShadowVertexShader,
            fragmentShader: playerShadowFragmentShader,
            uniforms: {},
          })
        }
        position={[0, 0.1, 0]}
        rotation={[(Math.PI * 3) / 2, 0, 0]}
      />
    </>
  );
}
