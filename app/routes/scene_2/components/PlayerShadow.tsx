import playerShadowVertexShader from "../shaders/playerShadow/vertex.glsl";
import playerShadowFragmentShader from "../shaders/playerShadow/fragment2.glsl";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ThreePlayer from "../../../store/three_player_store";
import { useFrame } from "@react-three/fiber";

type PlayerShadowProps = {
  index: number;
};

export function PlayerShadow({ index }: PlayerShadowProps) {
  const playerShadowRef = useRef<any>();

  const [playerPosition, setPlayerPosition] = 
    useState(new THREE.Vector3(0, 0, 7)); // prettier-ignore

  useEffect(() => {
    /*
     * Listem Current Player Position
     */

    const unsubscibePlayer = ThreePlayer.subscribe(
      (state: any) => state.currentPosition,
      (currentPosition) => {
        setPlayerPosition(currentPosition);
      },
    );

    return () => {
      unsubscibePlayer();
    };
  }, []);

  useFrame((state) => {
    if (playerShadowRef.current)
      playerShadowRef.current.material.uniforms.uTime.value =
        state.clock.elapsedTime;
  });

  return (
    <>
      <mesh
        ref={playerShadowRef}
        geometry={new THREE.PlaneGeometry(24, 24)}
        material={
          new THREE.ShaderMaterial({
            vertexShader: playerShadowVertexShader,
            fragmentShader: playerShadowFragmentShader,
            uniforms: {
              uTime: { value: 0.0 },
              uModelMatrix: { value: new THREE.Matrix4() },
              uPlayerPosition: { value: playerPosition },
            },
            transparent: true,
          })
        }
        position={[0, 0.1, 0]}
        rotation={[(Math.PI * 3) / 2, 0, 0]}
        onBeforeRender={() => {
          if (playerShadowRef.current) {
            // Three.js のオブジェクト（ここでは <mesh> ）は、
            // シーン内で移動・回転・スケールなどの変換が行われる場合、
            // その matrixWorld（ワールド行列）はフレームごとに更新されます。
            // そのため、シェーダーで最新のワールド行列を利用して
            // 正しい座標変換を行うためには、
            // 毎フレーム更新する必要があります。
            playerShadowRef.current.material.uniforms.uModelMatrix.value.copy(
              playerShadowRef.current.matrixWorld,
            );
          }
        }}
      />
    </>
  );
}
