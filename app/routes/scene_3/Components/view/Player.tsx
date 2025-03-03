import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ThreePlayerStore from "../../../../store/scene2/three_player_store";
import ThreeInterfaceStore from "../../../../store/scene2/three_interface_store";
import { useSystemStore } from "../../../../store/scene2/system_store";
import { useThree } from "@react-three/fiber";

export function Player() {
  return (
    <>
      <RigidBody
        position={[0, 10, 7]}
        canSleep={false}
        colliders="ball"
        linearDamping={1.5}
        angularDamping={2}
        restitution={0.5}
        friction={1}
      >
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            flatShading
            color={"mediumpurple"}
            transparent={true}
            opacity={1}
          />
        </mesh>
      </RigidBody>
    </>
  );
}
