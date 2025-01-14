import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ThreePlayerStore from "../../../store/three_player_store";
import ThreeInterfaceStore from "../../../store/three_interface_store";
import { useSystemStore } from "../../../store/system_store";

export function Player() {
  const rigidRef: any = useRef();
  const meshRef: any = useRef();
  const [smoothCameraPosition, setSmoothCameraPosition] = useState(
    new THREE.Vector3(5, 5, 5),
  );
  const [smoothCameraTarget] = useState(new THREE.Vector3());
  const [subscribeKeys, getState] = useKeyboardControls();
  const [targetOpacity, setTargetOpacity] = useState(1);
  const [smoothOpacity, setSmoothOpacity] = useState(1);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [isActicated, setIsActicated] = useState(false);
  const [moveDeltaX, setMoveDeltaX] = useState(0);
  const [moveDeltaY, setMoveDeltaY] = useState(0);

  const setPlayerPosition = ThreePlayerStore((state: any) => state.setPosition);
  const setIsPlayerMoved = ThreePlayerStore(
    (state: any) => state.setIsPlayerMoved,
  );

  useEffect(() => {
    /* Listem Player Current Floor */
    const unsubscribePlayerPosition = ThreePlayerStore.subscribe(
      (state: any) => state.currentFloorNum,
      (value) => {
        setCurrentFloor(value);

        if ([0, 3, 6].includes(value)) setTargetOpacity(1);
        if ([7, 9].includes(value)) setTargetOpacity(0.75);
        if ([10].includes(value)) setTargetOpacity(0.5);
        if ([11].includes(value)) setTargetOpacity(0.05);

        console.log(value);
      },
    );

    // Setup When Entrying into Three
    const unsubscribeSystemStore = useSystemStore.subscribe(
      (state: any) => state.isActivated,
      (value) => {
        rigidRef.current.setTranslation({ x: 0, y: 7, z: 7 });
        rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 });
        rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 });

        setSmoothCameraPosition(new THREE.Vector3(100, 100, -20));
        setIsActicated(value);
      },
    );

    // Recieve Pad Delta
    const unsubscribeMoveDelta = ThreeInterfaceStore.subscribe(
      (state: any) => ({
        moveDeltaX: state.moveDeltaX,
        moveDeltaY: state.moveDeltaY,
      }),
      (value) => {
        setMoveDeltaX(value.moveDeltaX);
        setMoveDeltaY(value.moveDeltaY);
      },
    );

    return () => {
      unsubscribePlayerPosition();
      unsubscribeSystemStore();
      unsubscribeMoveDelta();
    };
  }, []);

  useFrame((state, delta) => {
    /**
     * Player
     */
    const playerPosition = rigidRef.current.translation();
    setPlayerPosition(playerPosition);

    /**
     * Restart
     */
    const randomBack = Math.random();
    if (playerPosition.y < -4) {
      if (currentFloor == 0 || currentFloor == 3) {
        rigidRef.current.setTranslation({ x: 0, y: 7, z: 7 });
      } else if (currentFloor == 6) {
        rigidRef.current.setTranslation({ x: 0, y: 27, z: -64 + 7 });
      } else if (currentFloor == 7 || currentFloor == 9) {
        rigidRef.current.setTranslation({ x: 0, y: 37, z: -128 + 7 });
      } else if (currentFloor == 10 && randomBack >= 0.5) {
        rigidRef.current.setTranslation({ x: 0, y: 30, z: -192 + 7 });
      } else if (currentFloor == 10 && randomBack < 0.5) {
        rigidRef.current.setTranslation({ x: 64, y: 37, z: -128 + 7 });
      } else if (currentFloor == 11) {
        rigidRef.current.setTranslation({ x: 64, y: 25, z: -192 + 7 });
      } else {
        // 非表示のフロア領域に落下した場合
        rigidRef.current.setTranslation({ x: 0, y: 0, z: 7 });
      }

      rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 });
      rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 });
    }

    /**
     * Controls
     */
    if (isActicated) {
      const impulse = { x: 0, y: 0, z: 0 };
      const imuplseStrength = 0.9 + delta;

      // getState: 現在の入力状態（オブジェクト）を即時取得する関数
      // 対応するキーが押されている場合に true になります。
      const { forward, backward, leftward, rightward } = getState();

      /* Keypad */
      if (forward) impulse.z -= imuplseStrength;
      if (backward) impulse.z += imuplseStrength;
      if (leftward) impulse.x -= imuplseStrength;
      if (rightward) impulse.x += imuplseStrength;

      /* Pad */
      if (moveDeltaX) impulse.x += moveDeltaX * 0.5 * imuplseStrength;
      if (moveDeltaY) impulse.z -= moveDeltaY * 0.5 * imuplseStrength;

      rigidRef.current.applyImpulse(impulse);

      // プレイヤーの動きを感知し、ガイドの非表示フラグをトリガー
      if (impulse.x != 0 || impulse.y != 0 || impulse.z != 0) {
        setIsPlayerMoved(true);
      }

      /* Opacity */

      const lerpOpacity = THREE.MathUtils.lerp(
        smoothOpacity,
        targetOpacity,
        0.5 * delta,
      );

      meshRef.current.material.opacity = lerpOpacity;
      setSmoothOpacity(lerpOpacity);
    }

    /**
     * Camera Controls
     */

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(playerPosition);
    cameraPosition.z += 20.5;
    cameraPosition.y += 10.65;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(playerPosition);

    cameraTarget.z -= 4.25;

    smoothCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTarget);
  });

  return (
    <>
      <RigidBody
        ref={rigidRef}
        position={[0, 20, 7]}
        canSleep={false}
        colliders="ball"
        linearDamping={0.5}
        angularDamping={0.5}
        restitution={0}
        friction={1}
      >
        <mesh ref={meshRef} castShadow receiveShadow>
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
