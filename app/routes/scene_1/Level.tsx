import { MeshStandardMaterial } from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text, useGLTF } from "@react-three/drei";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const coneGeometry = new THREE.ConeGeometry(9 * Math.sqrt(2), 10, 4);
coneGeometry.translate(0, coneGeometry.parameters.height / 2, 0);
const floorLayerMaterial = new THREE.MeshStandardMaterial({ color: "#cccccc" });
const floorBodyMaterial = new THREE.MeshStandardMaterial({ color: "yellow" });
const showcaseTopBottomMaterial = new THREE.MeshStandardMaterial({
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
});

export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <>
      <group
        position={new THREE.Vector3(position[0], position[1], position[2])}
      >
        {/* Floor Layer */}
        <RigidBody type="fixed">
          {/* <mesh
            geometry={boxGeometry}
            material={floorLayerMaterial}
            position={[0, -0.1, 0]}
            scale={[18, 0.2, 18]}
            receiveShadow
          /> */}
        </RigidBody>
        {/* Floor Body */}
        {/* <mesh
          geometry={coneGeometry}
          material={floorBodyMaterial}
          position={[0, -0.2, 0]}
          rotation={[Math.PI, Math.PI / 4, 0]}
          receiveShadow
        />
        <mesh /> */}

        {/* ShowCase */}
        <group>
          {/* Bottom */}
          <mesh
            geometry={boxGeometry}
            material={showcaseTopBottomMaterial}
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
          <mesh
            geometry={boxGeometry}
            material={showcaseBodyMaterial}
            position={[0, 3, 1.95]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[0.1, 4, 4]}
          />

          {/* Top */}
          <mesh
            geometry={boxGeometry}
            material={showcaseTopBottomMaterial}
            position={[0, 5.125, 0]}
            scale={[4, 0.25, 4]}
          />
        </group>
      </group>
    </>
  );
}

export default function Level() {
  return <>{/* <BlockStart position={[0, 0, 0]} /> */}</>;
}
