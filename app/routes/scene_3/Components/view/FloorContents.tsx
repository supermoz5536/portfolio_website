import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ShowCase } from "./ShowCase";
import { RigidBody, vec3 } from "@react-three/rapier";
import ThreePlayer from "../../../../store/scene2/three_player_store";
import { ShowCaseLight } from "./Lights";
import { Waves } from "./Waves";
import { Question } from "./Question";
import { PlayerShadow } from "./PlayerShadow";
import { Fireflies } from "./Fireflies";
import { StoneTablet } from "./StoneTablet";

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
  const rigidBodyRef = useRef<any>();
  const groupRef = useRef<any>();

  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
  const [currentFloor, setCurrentFloor] = useState(0);

  const [adjustedPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(position.x, position.y, position.z),
  );

  useEffect(() => {
    // 初回マウントの、meshのポジションが確定されるまでRigidBodyを待機
    setIsPositionReady(true);

    /**
     * Listen Current Floor
     */

    const unsubscribePlayer = ThreePlayer.subscribe(
      (state: any) => state.currentFloorNum,

      (currentFloorNum) => {
        setCurrentFloor(currentFloorNum);
      },
    );

    return () => {
      unsubscribePlayer();
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

  return (
    <>
      {isPositionReady && (
        <>
          {/* 衝突判定のないFloor上のコンテンツグループ */}
          <group ref={groupRef} position={adjustedPosition}>
            <ShowCase position={adjustedPosition} index={index} />

            {/* Empty Content */}
            {displayedQuestion.includes(index) && <Question />}

            {/* StoneTablet */}
            <StoneTablet position={adjustedPosition} index={index} />

            {/* Playerがいるフロアのみ生成 */}
            {currentFloor == index && (
              <>
                <ShowCaseLight shadowLevel={0} index={index} />
                <Fireflies index={index} />
                <PlayerShadow index={index} />

                {/* Waves */}
                {displayedGreenWave.includes(index) && <Waves flag={0} />}
                {displayedBlueWave.includes(index) && <Waves flag={1} />}
              </>
            )}
          </group>
        </>
      )}
    </>
  );
}
