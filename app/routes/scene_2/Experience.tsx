/// デスクトップにおいて、
/// コンテンツにZoomIn時にOrbitControlをOFFにしないと
/// 背景が暗くなる不具合が発生する

import { OrbitControls, PointerLockControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Player } from "./Components/view/Player";
import { Floors } from "./Components/view/Floor.js";
import { EnvironmentLights } from "./Components/view/Lights.js";
import { Earth } from "./Components/view/Earth.js";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useSystemStore } from "~/store/scene2/system_store";
import ThreePlayerStore from "../../store/scene2/three_player_store";
import { Tower } from "./Components/view/Tower";
import { useGlobalStore } from "~/store/global/global_store";

export default function Experience() {
  const threeState = useThree();
  const { gl, advance } = useThree();

  const startRenderRate = 0.0;
  const endRenderRate = 1.0;

  /**
   * Local State
   */
  const [isRender, setIsRender] = useState(false);

  const playerPositionRef = useRef(new THREE.Vector3());
  const orbitControlRef: any = useRef();
  const tempRef = useRef(new THREE.Vector3());
  const isMobileRef = useRef(true);
  const isOrbitControlMobileRef = useRef(false);
  const animationFrameIdRef = useRef<any>();

  /**
   * Store State
   */
  const isMobile = useGlobalStore((state) => state.isMobile);
  const isAvtivated = useSystemStore((state: any) => state.isActivated);
  const scrollProgressTopAndBottom = useSystemStore((state) => state.scrollProgressTopAndBottom); // prettier-ignore

  /**
   * Store Setter
   */
  const setIsPlayerFocus = useSystemStore((state:any)=>state.setIsPlayerFocus) // prettier-ignore

  /* -------------------
   Control OrbitControl
   ------------------- */

  useEffect(() => {
    /**
     * Device Setup
     */

    if (typeof window !== "undefined") {
      if (window.innerWidth < 500) {
        isMobileRef.current = true;
        orbitControlRef.current.enabled = false;
      }
      if (window.innerWidth >= 500) {
        isMobileRef.current = false;
        orbitControlRef.current.enabled = true;
      }
    }

    /**
     * Get Camera Direction on Orbit Mode
     */
    const unsubscribePlayerPosition = ThreePlayerStore.subscribe(
      (state: any) => state.currentPosition,
      (value) => {
        playerPositionRef.current = value;
      },
    );

    const unsubscribeIsPlayerFocused = useSystemStore.subscribe(
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
          orbitControlRef.current.target = tempRef.current;
        }
      },
    );

    /**
     * Toggle Orbit Mode on Mobile
     */
    const unsubscribeIsOrbitControlMobile = useSystemStore.subscribe(
      (state) => state.isOrbitControlMobile,
      (value) => {
        isOrbitControlMobileRef.current = value;

        // モバイルのOrbitControlモードがON
        if (isMobileRef.current && isOrbitControlMobileRef.current) {
          orbitControlRef.current.enabled = true;
          setIsPlayerFocus(false);

          // モバイルのOrbitControlモードがOFF
        } else if (isMobileRef.current && !isOrbitControlMobileRef.current) {
          orbitControlRef.current.enabled = false;
          setIsPlayerFocus(true);
        }
      },
    );

    return () => {
      unsubscribePlayerPosition();
      unsubscribeIsPlayerFocused();
      unsubscribeIsOrbitControlMobile();
    };
  }, []);

  /* -----------------
   Control Performance
   ----------------- */

  useEffect(() => {
    /**
     * Control Render for CPU Performance
     */

    if (scrollProgressTopAndBottom <= startRenderRate) {
      setIsRender(false);
      renderFinish();
    } else if (scrollProgressTopAndBottom >= endRenderRate) {
      setIsRender(false);
      renderFinish();
    } else {
      if (!isRender) {
        setIsRender(true);
        renderStart();
      }
    }

    /**
     * Control Resolution for GPU Performance
     */

    if (scrollProgressTopAndBottom == 0) {
      if (isMobile) gl.setPixelRatio(0.6);
      if (!isMobile) gl.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    } else if (scrollProgressTopAndBottom <= startRenderRate) {
      gl.setPixelRatio(0.001);
    } else if (scrollProgressTopAndBottom >= endRenderRate) {
      gl.setPixelRatio(0.001);
    } else {
      if (isMobile) gl.setPixelRatio(0.6);
      if (!isMobile) gl.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    }
  }, [scrollProgressTopAndBottom]);

  function renderStart() {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    const loop = (t: number) => {
      advance(t / 1000);
      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    animationFrameIdRef.current = requestAnimationFrame(loop); // 初回も rAF に任せる
  }

  function renderFinish() {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
  }

  return (
    <>
      <color args={["#201919"]} attach="background" />
      <OrbitControls
        ref={orbitControlRef}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.4}
      />

      <Physics paused={isAvtivated ? false : true}>
        <EnvironmentLights />
        <Player />
        <Floors />
      </Physics>
      <Tower />
      <Earth />
    </>
  );
}

{
  /* <axesHelper position={[0, 0.05, 0]} scale={1000} /> */
}
{
  /* <gridHelper
        position={[0, 0, 0]}
        args={[1000, 250, "#cccccc", "#cccccc"]} // 1 grid = 4 unit
      /> */
}
