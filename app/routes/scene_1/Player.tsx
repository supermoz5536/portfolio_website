import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ThreePlayer from "../../store/three_player_store";

export function Player() {
  const rigidRef: any = useRef();
  const meshRef: any = useRef();
  const [smoothCameraPosition] = useState(() => new THREE.Vector3(50, 50, 50));
  const [smoothCameraTarget] = useState(() => new THREE.Vector3());
  const [subscribeKeys, getState] = useKeyboardControls();
  const [targetOpacity, setTargetOpacity] = useState(1);
  const [smoothOpacity, setSmoothOpacity] = useState(1);

  const setPlayerPosition = ThreePlayer((state: any) => state.setPosition);

  useEffect(() => {
    /* Listem Player Current Floor */
    const unsubscibePlayerPosition = ThreePlayer.subscribe(
      (state: any) => state.currentFloorNum,
      (value) => {
        if ([0].includes(value)) setTargetOpacity(1);
        if ([1, 3].includes(value)) setTargetOpacity(0.8);
        if ([2, 4, 6].includes(value)) setTargetOpacity(0.6);
        if ([5, 7, 9].includes(value)) setTargetOpacity(0.4);
        if ([8, 10].includes(value)) setTargetOpacity(0.2);
        if ([11].includes(value)) setTargetOpacity(0);
      },
    );
    return () => {
      unsubscibePlayerPosition();
    };
  }, []);

  useFrame((state, delta) => {
    /**
     * Player
     */

    /* Controls */
    const { forward, backward, leftward, rightward } = getState();
    const impulse = { x: 0, y: 0, z: 0 };
    const imuplseStrength = 0.9 + delta;

    if (forward) impulse.z -= imuplseStrength;
    if (backward) impulse.z += imuplseStrength;
    if (leftward) impulse.x -= imuplseStrength;
    if (rightward) impulse.x += imuplseStrength;

    rigidRef.current.applyImpulse(impulse);

    /* Material */

    const lerpOpacity = THREE.MathUtils.lerp(
      smoothOpacity,
      targetOpacity,
      0.5 * delta,
    );

    setSmoothOpacity(lerpOpacity);

    meshRef.current.material.opacity = lerpOpacity;

    /**
     * Camera Controls
     */
    const playerPosition = rigidRef.current.translation();
    setPlayerPosition(playerPosition);

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(playerPosition);
    cameraPosition.z += 20.5;
    cameraPosition.y += 10.65;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(playerPosition);
    cameraTarget.y += 5.25;

    smoothCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTarget);
  });

  return (
    <>
      <RigidBody
        ref={rigidRef}
        position={[0, 7, 7]}
        canSleep={false}
        colliders="ball"
        linearDamping={0.5}
        angularDamping={0.5}
        restitution={0}
        friction={1}
      >
        <mesh ref={meshRef} castShadow receiveShadow>
          <icosahedronGeometry args={[1, 0]} />
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
