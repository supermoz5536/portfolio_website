import { useKeyboardControls } from "@react-three/drei";
import { advance, useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ThreePlayerStore from "../../../../store/scene2/three_player_store";
import ThreeInterfaceStore from "../../../../store/scene2/three_interface_store";
import { useSystemStore } from "../../../../store/scene2/system_store";
import { useThree } from "@react-three/fiber";
import { useGlobalStore } from "~/store/global/global_store";
import { RigidBodyType } from "@dimforge/rapier3d-compat/dynamics/rigid_body";

let isFirstTry = true;

export function Player() {
  const initPlayerCoord = new THREE.Vector3(0, 4, 8);
  const warmUpImpulse = new THREE.Vector3(2.05, 2.125, -2.195);

  /**
   * Local State
   */

  const state = useThree();
  const rigidRef: any = useRef();
  const meshRef: any = useRef();
  const animationFrameIdRef = useRef<any>();
  const countWarmRef = useRef<any>(0);
  const countWarmEndRef = useRef<any>(0);

  const [subscribeKeys, getState] = useKeyboardControls();
  const [targetOpacity, setTargetOpacity] = useState(1);
  const [smoothOpacity, setSmoothOpacity] = useState(1);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [isActicated, setIsActicated] = useState(false);
  const [isPlayerFocused, setIsPlayerFocused] = useState(true);
  const [gravity, setGravity] = useState(0);
  const [moveDeltaX, setMoveDeltaX] = useState(0);
  const [moveDeltaY, setMoveDeltaY] = useState(0);

  const [smoothCameraPosition, setSmoothCameraPosition] = useState(
    new THREE.Vector3(
      initPlayerCoord.x,
      initPlayerCoord.y + 5,
      initPlayerCoord.z + 15,
    ),
  );

  const [smoothCameraTarget, setSmoothCameraTarget] = useState(
    new THREE.Vector3(
      initPlayerCoord.x,
      initPlayerCoord.y,
      initPlayerCoord.z - 10,
    ),
  );

  const [savedCemeraPosition, setSavedCameraPosition] = useState(
    new THREE.Vector3(),
  );

  /**
   * Store State
   */

  const isCompiledScene2 = useGlobalStore((state) => state.isCompiledScene2);

  /**
   * Store Setter
   */

  const setIsWarmedUpPlayer = 
    useGlobalStore((state: any) => state.setIsWarmedUpPlayer); // prettier-ignore

  const setPlayerPosition = 
    ThreePlayerStore((state: any) => state.setPosition); // prettier-ignore

  const setIsPlayerFirstMoved = 
    ThreePlayerStore((state: any) => state.setIsPlayerFirstMoved); // prettier-ignore

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
      },
    );

    // Setup When Entrying into Three
    const unsubscribeIsActivated = useSystemStore.subscribe(
      (state: any) => state.isActivated,
      (isActivated) => {
        rigidRef.current.setTranslation({ x: 0, y: 4, z: 8 });
        rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 });
        rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 });

        setIsActicated(isActivated);

        setSmoothCameraPosition(
          new THREE.Vector3(
            initPlayerCoord.x,
            initPlayerCoord.y + 5,
            initPlayerCoord.z + 15,
          ),
        );

        setTimeout(() => {
          setGravity(1.0);
        }, 1500);
      },
    );

    // Control Camera Focus
    const unsubscribeIsPlayerFocused = useSystemStore.subscribe(
      (state: any) => state.isPlayerFocused,
      (isPlayerFocused) => {
        setIsPlayerFocused(isPlayerFocused);

        if (isPlayerFocused) {
          state.camera.position.set(
            savedCemeraPosition.x,
            savedCemeraPosition.y,
            savedCemeraPosition.z,
          );
        }

        if (!isPlayerFocused) {
          setSavedCameraPosition(state.camera.position.clone());
        }
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
      unsubscribeIsActivated();
      unsubscribeIsPlayerFocused();
      unsubscribeMoveDelta();
    };
  }, []);

  useEffect(() => {
    if (isFirstTry && isCompiledScene2 && rigidRef.current) {
      isFirstTry = false;
      warmUpRender();
    }
  }, [isCompiledScene2]);

  useFrame((state, delta) => {
    /**
     * Player
     */

    const playerPosition = rigidRef.current.translation();

    setPlayerPosition(
      new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z),
    );

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

      setSmoothCameraPosition(
        new THREE.Vector3(
          rigidRef.current.translation().x,
          rigidRef.current.translation().y + 4,
          rigidRef.current.translation().z + 8,
        ),
      );

      setSmoothCameraTarget(
        new THREE.Vector3(
          rigidRef.current.translation().x,
          rigidRef.current.translation().y,
          rigidRef.current.translation().z - 10,
        ),
      );
    }

    /**
     * Controls
     */

    // Impulse
    let impulse: any = new THREE.Vector3();
    const imuplseStrength = 75 * delta;

    // Direction
    const forwardDir: any = new THREE.Vector3();
    forwardDir.subVectors(playerPosition, state.camera.position);
    forwardDir.y = 0;
    forwardDir.normalize();

    const leftwardDir: any = new THREE.Vector3(
      forwardDir.clone().z,
      0,
      -forwardDir.clone().x,
    );

    const backwardDir: any = forwardDir.clone().negate();
    const rightwardDir: any = leftwardDir.clone().negate();

    // getState: 現在の入力状態（オブジェクト）を即時取得する関数
    // 対応するキーが押されている場合に true になります。
    const { forward, backward, leftward, rightward } = getState();

    if (isActicated) {
      // Keypad
      if (forward) impulse.add(forwardDir.clone().multiplyScalar(imuplseStrength)); // prettier-ignore
      if (backward) impulse.add(backwardDir.clone().multiplyScalar(imuplseStrength)); // prettier-ignore
      if (leftward) impulse.add(leftwardDir.clone().multiplyScalar(imuplseStrength)); // prettier-ignore
      if (rightward) impulse.add(rightwardDir.clone().multiplyScalar(imuplseStrength)); // prettier-ignore

      // Pad
      if (moveDeltaX) {
        impulse.add(
          rightwardDir.clone().multiplyScalar(
            imuplseStrength * moveDeltaX * 0.45, // prettier-ignore
          ),
        );
      }

      if (moveDeltaY) {
        impulse.add(
          forwardDir.clone().multiplyScalar(
            imuplseStrength * moveDeltaY * 0.45, // prettier-ignore
          ),
        );
      }

      rigidRef.current.applyImpulse(impulse);

      // Hide the guide when player starts moving
      if (impulse.x != 0 || impulse.y != 0 || impulse.z != 0) {
        setIsPlayerFirstMoved(true);
      }

      // Opacity
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

    if (isPlayerFocused) {
      //======== Showcase ZoomIn 時の補正値の同期が必要　========//
      const cameraPosition = new THREE.Vector3();
      cameraPosition.copy(playerPosition);
      cameraPosition.add(backwardDir.clone().multiplyScalar(15)); // 同期が必要
      cameraPosition.y += 5;

      const cameraTarget = new THREE.Vector3();
      cameraTarget.copy(playerPosition);
      cameraTarget.add(forwardDir.clone().multiplyScalar(10));

      smoothCameraPosition.lerp(cameraPosition, 5 * delta);
      smoothCameraTarget.lerp(cameraTarget, 5 * delta);

      state.camera.position.copy(smoothCameraPosition);
      state.camera.lookAt(smoothCameraTarget);
    }
  });

  /// WarmUp 用のレンダリング関数
  /// isLoaded == false の間のみ実行
  function warmUpRender() {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    const loop = (t: number) => {
      if (countWarmRef.current < 40) {
        console.log("loop");
        countWarmRef.current++;

        rigidRef.current.applyImpulse(warmUpImpulse);

        advance(t / 1000);
        animationFrameIdRef.current = requestAnimationFrame(loop);
      } else {
        console.log("loopEnd");
        countWarmRef.current++;

        rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 });
        rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 });
        rigidRef.current.setTranslation({ x: 0, y: 4, z: 8 });

        setSmoothCameraPosition(
          new THREE.Vector3(
            initPlayerCoord.x,
            initPlayerCoord.y + 5,
            initPlayerCoord.z + 15,
          ),
        );

        setSmoothCameraTarget(
          new THREE.Vector3(
            initPlayerCoord.x,
            initPlayerCoord.y,
            initPlayerCoord.z - 10,
          ),
        );

        state.camera.position.set(
          initPlayerCoord.x,
          initPlayerCoord.y + 5,
          initPlayerCoord.z + 15,
        );

        state.camera.lookAt(
          initPlayerCoord.x,
          initPlayerCoord.y,
          initPlayerCoord.z - 10,
        );

        if (countWarmEndRef.current < 30) {
          countWarmEndRef.current++;
          advance(t / 1000);
          animationFrameIdRef.current = requestAnimationFrame(loop);
        } else {
          setIsWarmedUpPlayer(true);
        }
      }
    };

    animationFrameIdRef.current = requestAnimationFrame(loop);
  }

  return (
    <>
      <RigidBody
        ref={rigidRef}
        position={[0, 4, 8]}
        gravityScale={gravity}
        canSleep={false}
        colliders="ball"
        linearDamping={1.5}
        angularDamping={2}
        restitution={0.5}
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
