import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useGlobalStore } from "~/store/global/global_store";
import { useSystemStore } from "~/store/scene1/system_store";
import { gsap } from "gsap/dist/gsap";

let isFirstWarmup = true;
let isFirstTry = true;

export function Camera() {
  const targForTitleForDesktop = new THREE.Vector3(22, -12.5, 0);
  const targForTitleForMobile = new THREE.Vector3(14.5, -9, 0);
  const targForScroll = new THREE.Vector3(-10, 15, -102);

  const cameraPpoints = [
    new THREE.Vector3(19.31356214843414, 12.5, 59.441032268447124),
    new THREE.Vector3(5, 2, -5),
    new THREE.Vector3(-45, 15.5, -40),
    new THREE.Vector3(-55, 20.5, -80),
  ];
  const curve = new THREE.CatmullRomCurve3(cameraPpoints, false);

  /**
   * Local State
   */

  const cameraRef = useRef<any>();
  const warmupRatioRef = useRef({ progress: 0 });
  const animationRatioRef = useRef({ progress: 0 });

  const lerpCamTargRef = useRef(new THREE.Vector3(0, -12.5, 0));
  const startTargetRef = useRef(new THREE.Vector3());

  /**
   * Store State
   */

  const isCompiledScene1 = useGlobalStore((state) => state.isCompiledScene1);
  const isMobile = useGlobalStore((state) => state.isMobile);
  const isIntroEnded = useSystemStore((state) => state.isIntroEnd);
  const isAnimationEnd = useSystemStore((state) => state.isAnimationEnd);
  const scrollProgress = useSystemStore(
    (state) => state.scrollProgressTopAndBottom,
  );

  /**
   * Store Setter
   */

  const setIsAnimationEnd = useSystemStore((state: any) => state.setIsAnimationEnd); // prettier-ignore

  /**
   * Three
   */

  // size: 現在のcanvas描画領域(width, height)が格納
  const size = useThree((store) => store.size);
  const set = useThree((store) => store.set);

  /* ------------------
     Initialize Camera 
    ------------------ */

  // Set Camera as Default
  useLayoutEffect(() => {
    set({ camera: cameraRef.current });
    cameraRef.current.layers.enable(0);

    if (cameraRef.current) {
      // gsap の初期値の角度と一致させ、描画の不連続を避ける
      // Euler はジンバルロックが生じる角度なので用いない
      cameraRef.current.quaternion.set(-0.5, 0.5, 0.5, 0.5);
    }
  }, []);

  // Set Aspect Ratio before First Mount
  useLayoutEffect(() => {
    if (cameraRef.current) {
      // canvas サイズ(width, height)の変更は
      // R3Fの仕様で camera の size に自動反映されるが
      // アスペクト比の計算と
      // それを含む投影行列の再計算/更新（updateProjectionMatrix）
      // まで行わないので明示的に記述する必要がある
      cameraRef.current.aspect = size.width / size.height;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [size]);

  /* ---------
     Warm up
    --------- */

  useEffect(() => {
    if (isFirstWarmup && isCompiledScene1) {
      isFirstWarmup = false;

      gsap.to(warmupRatioRef.current, {
        duration: 4,
        progress: 1,
        ease: "power1.inOut",
        delay: 0,
        onUpdate: () => {
          console.log("AAAAAAnime debug");
          if (!isAnimationEnd && cameraRef.current) {
            let radiusRatio = 0.5;
            let t = warmupRatioRef.current.progress;

            const revolutions = 1.2; // 螺旋の回転数
            const phi = Math.PI * 2 * revolutions * t; // 総回転角
            const radius = 125 * radiusRatio; // 半径
            const startY = 100;
            const endY = 12.5;
            const y = startY - t * (startY - endY);
            const x = radius * Math.cos(phi);
            const z = radius * Math.sin(phi);

            cameraRef.current.position.set(x, y, z);

            if (t == 1.0) {
              cameraRef.current.position.set(0, 100, 0);
              cameraRef.current.quaternion.set(-0.5, 0.5, 0.5, 0.5);
            }
          }
        },
      });
    }
  }, [isCompiledScene1]);

  /* ----------------------------
     Control Camera in Animation
    ---------------------------- */
  useEffect(() => {
    // if (isFirstTry) {
    if (isFirstTry && isIntroEnded) {
      isFirstTry = false;
      gsap.to(animationRatioRef.current, {
        duration: 7,
        progress: 1,
        ease: "power1.inOut",
        delay: 0,
        onUpdate: () => {
          if (!isAnimationEnd && cameraRef.current) {
            let radiusRatio = 0.5;
            let t = animationRatioRef.current.progress;

            const revolutions = 1.2; // 螺旋の回転数
            const phi = Math.PI * 2 * revolutions * t; // 総回転角
            const radius = 125 * radiusRatio; // 半径
            const startY = 100;
            const endY = 12.5;
            const y = startY - t * (startY - endY);
            const x = radius * Math.cos(phi);
            const z = radius * Math.sin(phi);

            cameraRef.current.position.set(x, y, z);

            if (t == 1.0) setIsAnimationEnd(true);
          }
        },
      });
    }
  }, [isIntroEnded]);

  useFrame((state, delta) => {
    /* ---------------
      Camera Position 
      --------------- */

    /*
     *  in Scroll
     */

    if (isAnimationEnd && cameraRef.current) {
      const newCameraPos = curve.getPoint(scrollProgress);
      cameraRef.current.position.lerp(newCameraPos, 3 * delta);
    }

    /* ---------------
       Camera Target
      --------------- */
    /*
     * in Animation
     */

    if (scrollProgress == 0) {
      const target = isMobile ? targForTitleForMobile : targForTitleForDesktop;

      const midTarget = new THREE.Vector3()
        .copy(lerpCamTargRef.current)
        .lerp(target, 0.5);

      lerpCamTargRef.current.lerp(midTarget, delta * 2.5);

      cameraRef.current.lookAt(lerpCamTargRef.current);

      // Save coordinate for next process
      startTargetRef.current.copy(lerpCamTargRef.current);
    }

    /*
     * in Scroll
     */

    if (isAnimationEnd) {
      const transitionStart = 0.0;
      const transitionEnd = 0.4;
      const t = THREE.MathUtils.clamp(
        (scrollProgress - transitionStart) / (transitionEnd - transitionStart), // scrollProgress [0.1 <=> 0.2] => [0.0 <=> 1.0]
        0,
        1,
      );

      // Get the target
      const midTarget = new THREE.Vector3()
        .copy(startTargetRef.current)
        .lerp(targForScroll, t);

      // Get the target of the target you already got
      lerpCamTargRef.current.lerp(midTarget, delta * 1.5);

      cameraRef.current.lookAt(lerpCamTargRef.current);
    }
  });

  return (
    <perspectiveCamera
      ref={cameraRef}
      fov={45}
      near={0.1}
      far={4000}
      position={[0, 100, 0]}
    />
  );
}

/// Drei のパースペクティブカメラを使うと簡易に記述可能
// export function Camera() {
//   return (
//     <PerspectiveCamera
//       makeDefault
//       fov={45}
//       near={0.1}
//       far={4000}
//       position={[0, 20, 100]}
//     />
//   );
// }
