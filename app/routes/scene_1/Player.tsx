import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useThreePlayer from "../../store/three_player_store";

export function Player() {
  const body: any = useRef();
  const [smoothCameraPosition] = useState(() => new THREE.Vector3(50, 50, 50));
  const [smoothCameraTarget] = useState(() => new THREE.Vector3());
  const [subscribeKeys, getState] = useKeyboardControls();
  const setPlayerPosition = useThreePlayer((state: any) => state.setPosition);

  useFrame((state, delta) => {
    /**
     * Player Controls
     */
    const { forward, backward, leftward, rightward } = getState();
    const impulse = { x: 0, y: 0, z: 0 };
    const imuplseStrength = 0.9 + delta;

    if (forward) impulse.z -= imuplseStrength;
    if (backward) impulse.z += imuplseStrength;
    if (leftward) impulse.x -= imuplseStrength;
    if (rightward) impulse.x += imuplseStrength;

    body.current.applyImpulse(impulse);

    /**
     * Camera Controls
     */
    const bodyPosition = body.current.translation();
    setPlayerPosition(bodyPosition);

    // const cameraPosition = new THREE.Vector3();
    // cameraPosition.copy(bodyPosition);
    // cameraPosition.z += 20.5;
    // cameraPosition.y += 20.65;

    // const cameraTarget = new THREE.Vector3();
    // cameraTarget.copy(bodyPosition);
    // cameraTarget.y += 0.25;

    // smoothCameraPosition.lerp(cameraPosition, 5 * delta);
    // smoothCameraTarget.lerp(cameraTarget, 5 * delta);

    // state.camera.position.copy(smoothCameraPosition);
    // state.camera.lookAt(smoothCameraTarget);
  });

  return (
    <>
      <RigidBody
        ref={body}
        position={[0, 7, 7]}
        canSleep={false}
        colliders="ball"
        linearDamping={0.5}
        angularDamping={0.5}
        restitution={0.2}
        friction={1}
      >
        <mesh castShadow>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial flatShading color={"mediumpurple"} />
        </mesh>
      </RigidBody>
    </>
  );
}
