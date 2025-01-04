import { MeshStandardMaterial } from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text, useGLTF } from "@react-three/drei";

type showCaseProps = {
  position: THREE.Vector3;
};

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const showcaseBottomMaterial = new THREE.MeshStandardMaterial({
  color: "black",
});
const showcaseBottomLayerMaterial = new THREE.MeshStandardMaterial({
  color: "#f1f1f1",
});
const showcaseBodyMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 0,
  transmission: 1,
  ior: 1.62,
  thickness: 0.001,
  opacity: 0.95, // 透明度を強調
  transparent: true, // 透明を有効化
  color: 0xffffff, // 完全な白
  depthWrite: false,
});

export function ShowCase({ position }: showCaseProps) {
  const rigidBodyRef: any = useRef();
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
  });

  return (
    <>
      {isPositionReady && (
        <>
          {/* ShowCase */}
          <RigidBody
            ref={rigidBodyRef}
            position={adjustedPosition}
            type="kinematicPosition"
            colliders="hull"
            scale={0.7}
          >
            {/* <group position={[position.x, position.y, position.z]} scale={0.7}> */}
            {/* Bottom */}
            <mesh
              geometry={boxGeometry}
              material={showcaseBottomMaterial}
              position={[0, 0.5, 0]}
              scale={[4, 1, 4]}
            />

            {/* Bottom Layer */}
            <mesh
              geometry={boxGeometry}
              material={showcaseBottomLayerMaterial}
              position={[0, 1.005, 0]}
              scale={[3.8, 0.01, 3.8]}
            />

            {/* Top Layer */}
            <mesh
              geometry={boxGeometry}
              material={showcaseBottomLayerMaterial}
              position={[0, 5, 0]}
              scale={[3.8, 0.01, 3.8]}
            />

            {/* Body Left */}
            <mesh
              geometry={boxGeometry}
              material={showcaseBodyMaterial}
              position={[-1.95, 3, 0]}
              scale={[0.1, 4, 4]}
            />

            {/* Body Right */}
            <mesh
              geometry={boxGeometry}
              material={showcaseBodyMaterial}
              position={[1.95, 3, 0]}
              scale={[0.1, 4, 4]}
            />

            {/* Body Forward */}
            <mesh
              geometry={boxGeometry}
              material={showcaseBodyMaterial}
              position={[0, 3, -1.95]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[0.1, 4, 4]}
            />

            {/* Body Backward */}
            {/* <mesh
            geometry={boxGeometry}
            material={showcaseBodyMaterial}
            position={[0, 3, 1.95]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[0.1, 4, 4]}
          /> */}

            {/* Top */}
            <mesh
              geometry={boxGeometry}
              // material={showcaseBodyMaterial}
              material={showcaseBottomMaterial}
              position={[0, 5.125, 0]}
              scale={[4, 0.25, 4]}
            />
            {/* </group> */}
          </RigidBody>
        </>
      )}
    </>
  );
}
