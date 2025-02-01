import { OrbitControls, PointerLockControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Player } from "./Components/view/Player";
import { Floors } from "./Components/view/Floor.js";
import { EnvironmentLights } from "./Components/view/Lights.js";
import { Earth } from "./Components/view/Earth.js";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useSystemStore } from "~/store/system_store";
import ThreePlayerStore from "../../store/three_player_store";

export default function Experience() {
  const threeState = useThree();
  const tempRef = useRef(new THREE.Vector3());
  const playerPositionRef = useRef(new THREE.Vector3());
  const orbitTargetRef: any = useRef();

  useEffect(() => {
    const unsubscribePlayerPosition = ThreePlayerStore.subscribe(
      (state: any) => state.currentPosition,
      (value) => {
        // setPlayerPosition(value);
        playerPositionRef.current = value;
      },
    );

    const unsubscribeSystemStore = useSystemStore.subscribe(
      (state) => state.isPlayerFocused,
      (value) => {
        if (!value) {
          // Get forward Direction
          const forwardDir: any = new THREE.Vector3();
          forwardDir.subVectors(
            playerPositionRef.current,
            threeState.camera.position,
          );
          forwardDir.normalize();

          // Set targetPosition
          tempRef.current.copy(threeState.camera.position);
          tempRef.current.add(forwardDir.clone().multiplyScalar(2));
          tempRef.current.y += 0.2525;
          orbitTargetRef.current.target = tempRef.current;
        }
      },
    );

    return () => {
      unsubscribePlayerPosition();
      unsubscribeSystemStore();
    };
  }, []);

  // useFrame(() => {
  //   const cameraPosition = state.camera.position.clone();
  //   cameraPosition.z -= 50;
  //   setOrbitTaget(cameraPosition);

  //   state.camera;
  // });

  return (
    <>
      {/* <color args={["#bdedfc"]} attach="background" /> */}
      <color args={["#201919"]} attach="background" />
      {/* <axesHelper position={[0, 0.05, 0]} scale={1000} /> */}
      {/* <gridHelper
        position={[0, 0, 0]}
        args={[1000, 250, "#cccccc", "#cccccc"]} // 1 grid = 4 unit
      /> */}
      <OrbitControls
        ref={orbitTargetRef}
        maxPolarAngle={Math.PI * 0.7} // Above Limit
        minPolarAngle={Math.PI * 0.4} // Below Limit
      />
      <Physics debug>
        <EnvironmentLights />
        <Player />
        <Floors />
      </Physics>
      <Earth />
    </>
  );
}
