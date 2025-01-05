import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ShowCase } from "./ShowCase";
import { RigidBody } from "@react-three/rapier";

type FloorContentsProps = {
  index: number;
  position: THREE.Vector3;
};

const transparentMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false,
});

export function FloorContents({ index, position }: FloorContentsProps) {
  const rigidBodyRef: any = useRef();
  const groupRef: any = useRef();

  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
  const [adjustedPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(position.x, position.y, position.z),
  );

  /* 初回マウントの、meshのポジションが確定されるまでRigidBodyを待機 */
  useEffect(() => {
    setIsPositionReady(true);
  }, []);

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
            <ShowCase index={index} />
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
