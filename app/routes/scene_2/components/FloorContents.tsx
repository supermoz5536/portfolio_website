import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ShowCase } from "./ShowCase";
import { RigidBody } from "@react-three/rapier";
import { Fireflies } from "./Fireflies";
import ThreePlayer from "../../../store/three_player_store";
import { ShowCaseLight } from "./Lights";
import { Waves } from "./Waves";
import { Question } from "./Question";

type FloorContentsProps = {
  index: number;
  position: THREE.Vector3;
};

const transparentMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false,
});

const displayedQuestion = [7, 9, 10, 11];
const displayedGreenWave = [0, 3, 6, 9];
const displayedBlueWave = [9];

export function FloorContents({ index, position }: FloorContentsProps) {
  const rigidBodyRef: any = useRef();
  const groupRef: any = useRef();

  const [currentFloor, setCurrentFloor] = useState(0);
  const [shadowLevel, setShadowLevel] = useState(75);
  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
  const [adjustedPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(position.x, position.y, position.z),
  );

  /* 初回マウントの、meshのポジションが確定されるまでRigidBodyを待機 */
  useEffect(() => {
    setIsPositionReady(true);

    /* Listem Current Floor */
    const unsubscibePlayerPosition = ThreePlayer.subscribe(
      (state: any) => state.currentFloorNum,
      (value) => {
        setCurrentFloor(value);

        // Light Shadow Level for Player
        if ([0].includes(value)) setShadowLevel(70);
        if ([3].includes(value)) setShadowLevel(100);
        if ([6, 7].includes(value)) setShadowLevel(50);
        if ([9].includes(value)) setShadowLevel(25);
        if ([10, 11].includes(value)) setShadowLevel(0);
      },
    );

    return () => {
      unsubscibePlayerPosition();
    };
  }, [index]);

  /* 初回マウント後以降の更新 */
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
                {/* <ShowCaseLight shadowLevel={shadowLevel} index={index} /> */}
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
