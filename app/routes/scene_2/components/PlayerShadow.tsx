import playerShadowVertexShader from "../shaders/playerShadow/vertex.glsl";
import playerShadowFragmentShader from "../shaders/playerShadow/fragment.glsl";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ThreePlayer from "../../../store/three_player_store";
import { useFrame } from "@react-three/fiber";

type PlayerShadowPrpos = {
  position: THREE.Vector3;
};

export function PlayerShadow({ position }: PlayerShadowPrpos) {
  const playerShadowRef = useRef<any>();

  const tempCurrentFloorCenter = useRef<THREE.Vector3>(new THREE.Vector3());
  const tempDirectionToPlayer = useRef<THREE.Vector3>(new THREE.Vector3());
  const tempNormalizedDirection = useRef<THREE.Vector3>(new THREE.Vector3());
  const tempPlayerShadowPositionGlobal = useRef<THREE.Vector3>(new THREE.Vector3()); // prettier-ignore
  const tempPlayerShadowPositionLocal = useRef<THREE.Vector3>(new THREE.Vector3()); // prettier-ignore
  const tempPlayerShadowPositionUv = useRef<THREE.Vector2>(new THREE.Vector2());

  const [currentPlayerPosition, setCurrentPlayerPosition] = 
    useState(new THREE.Vector3(0, 0, 7)); // prettier-ignore

  useEffect(() => {
    /*
     * Listem Current Player Position
     */

    const unsubscibePlayer = ThreePlayer.subscribe(
      (state: any) => state.currentPosition,
      (currentPosition) => {
        setCurrentPlayerPosition(currentPosition);
      },
    );

    return () => {
      unsubscibePlayer();
    };
  }, []);

  useFrame(() => {
    if (playerShadowRef.current) {
      setPlayerShadowPosition();
    }
  });

  function setPlayerShadowPosition(): void {
    // ローカル座標の中心値をセット
    tempCurrentFloorCenter.current.set(position.x, position.y, position.z);

    // ローカル座標の中心値とプレイヤーとの距離(方向)ベクトルをセット
    tempDirectionToPlayer.current.subVectors(
      currentPlayerPosition,
      tempCurrentFloorCenter.current,
    );

    // Vec3 で普通に代入すると参照の代入になってしまう。そこで
    // .copy() は既存のオブジェクトの内部データ（x, y, z の値）を上書きするので使用
    tempNormalizedDirection.current
      .copy(tempDirectionToPlayer.current)
      .normalize();

    const offsetDistance = 0.325;

    // プレイヤーのGlobal座標を代入
    tempPlayerShadowPositionGlobal.current.copy(currentPlayerPosition);

    // 指定した距離のオフセットを実行
    tempPlayerShadowPositionGlobal.current.add(
      tempNormalizedDirection.current.multiplyScalar(offsetDistance),
    );

    // ローカル座標の中心 parent は <group>
    const parent = playerShadowRef.current.parent;

    // ローカル座標用のオブジェクトにグローバル座標をコピー
    tempPlayerShadowPositionLocal.current.copy(
      tempPlayerShadowPositionGlobal.current,
    );

    // コピーしたグローバル座標をローカル座標に変換
    parent.worldToLocal(tempPlayerShadowPositionLocal.current);

    // UVマップ（PlaneGeometry）に正規化
    // / 24: 単位サイズに縮尺
    //  + 0.5: 原点中央で左下(-0.5, -0.5) 右上(0.5, 0.5)を原点左下にオフセット
    tempPlayerShadowPositionUv.current.set(
      tempPlayerShadowPositionLocal.current.x / 24 + 0.5,
      -tempPlayerShadowPositionLocal.current.z / 24 + 0.5,
    );

    playerShadowRef.current.material.uniforms.uPlayerShadowPositionUv.value.copy(
      tempPlayerShadowPositionUv.current,
    );
  }
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
              uPlayerShadowPositionUv: {
                value: tempPlayerShadowPositionUv.current,
              },
            },
            transparent: true,
          })
        }
        position={[0, 0.1, 0]}
        rotation={[(Math.PI * 3) / 2, 0, 0]}
      />
    </>
  );
}
