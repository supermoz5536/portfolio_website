import playerShadowVertexShader from "./Materials/shaders/playerShadow/vertex.glsl";
import playerShadowFragmentShader1 from "./Materials/shaders/playerShadow/fragment1.glsl";
import playerShadowFragmentShader2 from "./Materials/shaders/playerShadow/fragment2.glsl";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ThreePlayer from "../../../../store/scene2/three_player_store";
import { useFrame } from "@react-three/fiber";

type PlayerShadowProps = {
  index: number;
};

let isArrivedFloor11 = false;
let currentShader = playerShadowFragmentShader2;

export function PlayerShadow({ index }: PlayerShadowProps) {
  const playerShadowRef = useRef<any>();

  const [shadowLevel, setShadowLevel] = useState(1.0);
  const [playerPosition, setPlayerPosition] = 
    useState(new THREE.Vector3(0, 0, 7)); // prettier-ignore

  useEffect(() => {
    /**
     * Setup FragmentShader Type
     * 毎マウント毎にモジュールスコープで定義したShaderタイプを適用
     * (関数自体が再マウントされて値が初期化されるのを防ぐ)
     */
    if (isArrivedFloor11) currentShader = playerShadowFragmentShader1;

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

  useEffect(() => {
    const shadowGroup1 = [0];
    const shadowGroup2 = [1, 3];
    const shadowGroup3 = [2, 4, 6];
    const shadowGroup4 = [5, 7, 9];
    const shadowGroup5 = [8, 10];
    const shadowGroup6 = [11];

    if (shadowGroup1.includes(index)) setShadowLevel(1.0);
    if (shadowGroup2.includes(index)) setShadowLevel(0.9);
    if (shadowGroup3.includes(index)) setShadowLevel(0.7);
    if (shadowGroup4.includes(index)) setShadowLevel(0.5);
    if (shadowGroup5.includes(index)) setShadowLevel(0.3);

    if (shadowGroup6.includes(index)) {
      setShadowLevel(0.0);
      if (isArrivedFloor11 == false) {
        isArrivedFloor11 = true;
        currentShader = playerShadowFragmentShader1;
      }
    }
  }, [index]);

  /**
   * Debug
   */
  // useEffect(() => {
  //   if (playerShadowRef.current) {
  //     console.log(playerShadowRef.current.material.fragmentShader);
  //   }
  // }, [playerShadowRef.current]);

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
            fragmentShader: currentShader,
            uniforms: {
              uTime: { value: 0.0 },
              uShadowLevel: { value: shadowLevel },
              uModelMatrix: { value: new THREE.Matrix4() },
              uPlayerPosition: { value: playerPosition },
            },
            transparent: true,
          })
        }
        position={[0, 0.2, 0]}
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
