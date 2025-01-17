import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ShowCase } from "./ShowCase";
import { RigidBody } from "@react-three/rapier";
import { Fireflies } from "./Fireflies";
import ThreePlayer from "../../../store/three_player_store";
import { ShowCaseLight } from "./Lights";
import { Waves } from "./Waves";
import { Question } from "./Question";
import playerShadowVertexShader from "../shaders/playerShadow/vertex.glsl";
import playerShadowFragmentShader from "../shaders/playerShadow/fragment.glsl";

type FloorContentsProps = {
  index: number;
  position: THREE.Vector3;
};

const transparentMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false,
});

// const playerShadowMaterial = new THREE.MeshStandardMaterial({
//   color: "black",
//   transparent: true,
//   opacity: 1,
//   clippingPlanes: [
//     new THREE.Plane(new THREE.Vector3(0, 0, 1), 12.1),
//     new THREE.Plane(new THREE.Vector3(0, 0, -1), 12.1),
//     new THREE.Plane(new THREE.Vector3(1, 0, 0), 12.1),
//     new THREE.Plane(new THREE.Vector3(-1, 0, 0), 12.1),
//   ],
// });

const displayedQuestion = [7, 9, 10, 11];
const displayedGreenWave = [0, 3, 6, 9];
const displayedBlueWave = [9];

export function FloorContents({ index, position }: FloorContentsProps) {
  const rigidBodyRef = useRef<any>();
  const groupRef = useRef<any>();
  const playerShadowRef = useRef<any>();

  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);

  const [currentFloor, setCurrentFloor] = useState(0);

  const [currentPlayerPosition, setCurrentPlayerPosition] = 
    useState(new THREE.Vector3(0, 0, 7)); // prettier-ignore

  const [adjustedPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(position.x, position.y, position.z),
  );

  const tempCurrentFloorCenter = useRef<THREE.Vector3>(new THREE.Vector3());
  const tempDirectionToPlayer = useRef<THREE.Vector3>(new THREE.Vector3());
  const tempNormalizedDirection = useRef<THREE.Vector3>(new THREE.Vector3());
  const tempPlayerShadowPositionGlobal = useRef<THREE.Vector3>(new THREE.Vector3()); // prettier-ignore
  const tempPlayerShadowPositionLocal = useRef<THREE.Vector3>(new THREE.Vector3()); // prettier-ignore
  const tempPlayerShadowPositionUv = useRef<THREE.Vector2>(new THREE.Vector2());

  // useLayoutEffect(() => {
  //   if (playerShadowRef.current) setPlayerShadowClipping(currentFloor);
  // }, [index, currentFloor]);

  useEffect(() => {
    // 初回マウントの、meshのポジションが確定されるまでRigidBodyを待機
    setIsPositionReady(true);

    /*
     * Listem Player Position and FloorNum
     */

    const unsubscibePlayer = ThreePlayer.subscribe(
      (state: any) => ({
        currentPosition: state.currentPosition,
        currentFloorNum: state.currentFloorNum,
      }),
      ({ currentPosition, currentFloorNum }) => {
        setCurrentPlayerPosition(currentPosition);
        setCurrentFloor(currentFloorNum);
      },
    );

    return () => {
      unsubscibePlayer();
    };
  }, []);

  useFrame((state, delta) => {
    adjustedPosition.lerp(position, 0.5 * delta);

    if (rigidBodyRef.current) {
      rigidBodyRef.current.setNextKinematicTranslation({
        x: adjustedPosition.x,
        y: adjustedPosition.y,
        z: adjustedPosition.z,
      });
    }

    if (groupRef.current) {
      groupRef.current.position.set(
        adjustedPosition.x,
        adjustedPosition.y,
        adjustedPosition.z,
      );
    }

    if (playerShadowRef.current) {
      /*
       * Player Shadow
       */
      setPlayerShadowPosition();
      setPlayerShadowOpacity();
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
    const parent = groupRef.current;

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

  function setPlayerShadowOpacity(): void {
    const distanceFromLocalCenterToPlayer =
    position.distanceTo(currentPlayerPosition) // prettier-ignore

    if (distanceFromLocalCenterToPlayer < 8) {
      playerShadowRef.current.material.opacity = 1;
    } else if (
      distanceFromLocalCenterToPlayer >= 8 &&
      distanceFromLocalCenterToPlayer <= 16
    ) {
      playerShadowRef.current.material.opacity =
        1 - (distanceFromLocalCenterToPlayer - 8) / 8;
    } else {
      playerShadowRef.current.material.opacity = 0;
    }
  }

  function setPlayerShadowClipping(currentFloor: number): void {
    let clippingPlanes = [];
    let rowMultiply = 0;
    let colMultiply = 0;

    const row0 = [0, 1, 2];
    const row1 = [3, 4, 5];
    const row2 = [6, 7, 8];
    const row3 = [9, 10, 11];

    const col0 = [0, 3, 6, 9];
    const col1 = [1, 4, 7, 10];
    const col2 = [2, 5, 8, 11];

    if (row0.includes(currentFloor)) rowMultiply = 0;
    if (row1.includes(currentFloor)) rowMultiply = 1;
    if (row2.includes(currentFloor)) rowMultiply = 2;
    if (row3.includes(currentFloor)) rowMultiply = 3;

    if (col0.includes(currentFloor)) colMultiply = 0;
    if (col1.includes(currentFloor)) colMultiply = 1;
    if (col2.includes(currentFloor)) colMultiply = 2;

    // Forword
    clippingPlanes.push(
      new THREE.Plane(
        new THREE.Vector3(0, 0, 1),
        12.1 + 64 * rowMultiply, // prettier-ignore
      ),
    );

    // Backword
    clippingPlanes.push(
      new THREE.Plane(
        new THREE.Vector3(0, 0, -1),
        - ((12.1 + 64 * rowMultiply) - 24), // prettier-ignore
      ),
    );

    // Left
    clippingPlanes.push(
      new THREE.Plane(
        new THREE.Vector3(1, 0, 0),
        12.1 + 64 * colMultiply, // prettier-ignore
      ),
    );

    // Right
    clippingPlanes.push(
      new THREE.Plane(
        new THREE.Vector3(-1, 0, 0),
        - ((12.1 + 64 * colMultiply) - 24), // prettier-ignore
      ),
    );

    playerShadowRef.current.material.clippingPlanes = clippingPlanes;
    playerShadowRef.current.material.needsUpdate = true;
  }

  return (
    <>
      {isPositionReady && (
        <>
          {/* 衝突判定のないFloor上のコンテンツグループ */}
          <group ref={groupRef} position={adjustedPosition}>
            <Fireflies index={index} />
            <ShowCase index={index} />

            {/* Waves */}
            {displayedGreenWave.includes(index) && <Waves flag={0} />}
            {displayedBlueWave.includes(index) && <Waves flag={1} />}

            {/* Empty Content */}
            {displayedQuestion.includes(index) && <Question />}

            {/* Playerがいるフロアのみ生成 */}
            {currentFloor == index && (
              <>
                {/* ShowCase */}
                <ShowCaseLight shadowLevel={0} index={index} />

                {/* Player Shadow with Shader */}
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
            )}
          </group>

          {/* 衝突判定のあるFloor上のコンテンツ */}
          <RigidBody
            ref={rigidBodyRef}
            position={adjustedPosition}
            type="kinematicPosition"
            colliders="hull"
          >
            {/* ShowCaseの代替用コライダーを適用するコンポーネント */}
            <mesh
              geometry={new THREE.BoxGeometry(4, 10.5, 4)}
              material={transparentMaterial}
              scale={1.1}
            />
          </RigidBody>
        </>
      )}
    </>
  );
}
