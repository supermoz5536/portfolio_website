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
import { PlayerShadow } from "./PlayerShadow";

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

  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
  const [currentFloor, setCurrentFloor] = useState(0);

  const [adjustedPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(position.x, position.y, position.z),
  );

  // useLayoutEffect(() => {
  //   if (playerShadowRef.current) setPlayerShadowClipping(currentFloor);
  // }, [index, currentFloor]);

  useEffect(() => {
    // 初回マウントの、meshのポジションが確定されるまでRigidBodyを待機
    setIsPositionReady(true);

    /**
     * Listen Current Floor
     */

    const unsubscibePlayer = ThreePlayer.subscribe(
      (state: any) => state.currentFloorNum,

      (currentFloorNum) => {
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
  });

  // function setPlayerShadowClipping(currentFloor: number): void {
  //   let clippingPlanes = [];
  //   let rowMultiply = 0;
  //   let colMultiply = 0;

  //   const row0 = [0, 1, 2];
  //   const row1 = [3, 4, 5];
  //   const row2 = [6, 7, 8];
  //   const row3 = [9, 10, 11];

  //   const col0 = [0, 3, 6, 9];
  //   const col1 = [1, 4, 7, 10];
  //   const col2 = [2, 5, 8, 11];

  //   if (row0.includes(currentFloor)) rowMultiply = 0;
  //   if (row1.includes(currentFloor)) rowMultiply = 1;
  //   if (row2.includes(currentFloor)) rowMultiply = 2;
  //   if (row3.includes(currentFloor)) rowMultiply = 3;

  //   if (col0.includes(currentFloor)) colMultiply = 0;
  //   if (col1.includes(currentFloor)) colMultiply = 1;
  //   if (col2.includes(currentFloor)) colMultiply = 2;

  //   // Forword
  //   clippingPlanes.push(
  //     new THREE.Plane(
  //       new THREE.Vector3(0, 0, 1),
  //       12.1 + 64 * rowMultiply, // prettier-ignore
  //     ),
  //   );

  //   // Backword
  //   clippingPlanes.push(
  //     new THREE.Plane(
  //       new THREE.Vector3(0, 0, -1),
  //       - ((12.1 + 64 * rowMultiply) - 24), // prettier-ignore
  //     ),
  //   );

  //   // Left
  //   clippingPlanes.push(
  //     new THREE.Plane(
  //       new THREE.Vector3(1, 0, 0),
  //       12.1 + 64 * colMultiply, // prettier-ignore
  //     ),
  //   );

  //   // Right
  //   clippingPlanes.push(
  //     new THREE.Plane(
  //       new THREE.Vector3(-1, 0, 0),
  //       - ((12.1 + 64 * colMultiply) - 24), // prettier-ignore
  //     ),
  //   );

  //   playerShadowRef.current.material.clippingPlanes = clippingPlanes;
  //   playerShadowRef.current.material.needsUpdate = true;
  // }

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
                <PlayerShadow position={adjustedPosition} />
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
