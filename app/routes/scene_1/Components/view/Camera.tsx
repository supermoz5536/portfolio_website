import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useGlobalStore } from "~/store/global/global_store";
import { useSystemStore } from "~/store/scene1/system_store";
import { gsap } from "gsap/dist/gsap";

let isFirstTry = true;
let isFirstLerp = false;

export function Camera() {
  const targForTitleForDesktop = new THREE.Vector3(22, -13.5, 0);
  const targForTitleForMobile = new THREE.Vector3(14.5, -9, 0);
  const targForScroll = new THREE.Vector3(-10, 15, -102);

  const cameraPpoints = [
    new THREE.Vector3(19.31356214843414, 12.5, 59.441032268447124),
    new THREE.Vector3(5, 2, -5),
    new THREE.Vector3(45, 15.5, -40),
    new THREE.Vector3(55, 20.5, -80),
  ];
  const curve = new THREE.CatmullRomCurve3(cameraPpoints, false);

  /**
   * Local State
   */

  const cameraRef = useRef<any>();
  const animationRatioRef = useRef({ progress: 0 });
  const isAnimationRef = useRef(true);

  const lerpCamTargRef = useRef(new THREE.Vector3(0, -10, 0));
  const lerpCamRef = useRef(new THREE.Vector3());

  /**
   * Store State
   */

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
      cameraRef.current.lookAt(lerpCamTargRef.current);
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

  /* ----------------------------
     Control Camera in Animation
    ---------------------------- */
  useEffect(() => {
    // if (isFirstTry) {
    if (isFirstTry && isIntroEnded) {
      isFirstTry = false;
      gsap.to(animationRatioRef.current, {
        duration: 6,
        progress: 1,
        ease: "power1.inOut",
        delay: 2.5,
        onUpdate: () => {
          let t = animationRatioRef.current.progress;

          if (!isAnimationEnd && cameraRef.current) {
            let radiusRatio = 0;

            if (t < 0.5) {
              // scroll [0.0 - 0.5] => ratio [0.0 - 1.0]
              radiusRatio = t * 2.0;
            } else {
              // scroll [0.5 - 1.0] => ratio [1.0 - 0.5]
              radiusRatio = 1.0 - (t - 0.5);
            }

            const revolutions = 1.2; // 螺旋の回転数
            const phi = Math.PI * 2 * revolutions * t; // 総回転角
            const radius = 125 * radiusRatio; // 半径
            const startY = 100;
            const endY = 12.5;
            const y = startY - t * (startY - endY);
            const x = radius * Math.cos(phi);
            const z = radius * Math.sin(phi);

            cameraRef.current.position.set(x, y, z);
            cameraRef.current.lookAt(lerpCamTargRef.current);

            if (t == 1.0) {
              setTimeout(() => {
                setIsAnimationEnd(true);
                lerpCamRef.current.copy(cameraRef.current.position);
                console.log("isAnimationRef.current", isAnimationRef.current);
                console.log(
                  "isAnimationRef.current",
                  cameraRef.current.position,
                );
              }, 1000);

              // Trigger Lerp to targForTitle2
            } else if (t > 0.2) {
              isFirstLerp = true;
            }
          }
        },
      });
    }
  }, [isIntroEnded]);

  /* ----------------------------
     Control Camera in Scroll
    ---------------------------- */
  useEffect(() => {
    if (isAnimationEnd && cameraRef.current) {
      const newCameraPos = curve.getPoint(scrollProgress);
      cameraRef.current.position.set(
        newCameraPos.x, // prettier-ignore
        newCameraPos.y, // prettier-ignore
        newCameraPos.z, // prettier-ignore
      );

      // cameraRef.current.lookAt(0, 15, -100);
    }
  }, [scrollProgress, size]);

  /* ----------------------
     Control Camera Target 
    ---------------------- */

  useFrame((state, delta) => {
    /*
     * Control in Animation
     */

    if (isFirstLerp && scrollProgress == 0) {
      const target = isMobile ? targForTitleForMobile : targForTitleForDesktop;
      lerpCamTargRef.current.lerp(target, 0.5 * delta);
      cameraRef.current.lookAt(lerpCamTargRef.current);
    }

    /*
     * Control in Scroll
     */

    if (isAnimationEnd) {
      isFirstLerp = false;

      const transitionStart = 0.01;
      const transitionEnd = 0.7;
      const t = THREE.MathUtils.clamp(
        (scrollProgress - transitionStart) / (transitionEnd - transitionStart), // scrollProgress [0.1 <=> 0.2] => [0.0 <=> 1.0]
        0,
        1,
      );

      const baseTarget = lerpCamTargRef.current;

      const smoothTarget = new THREE.Vector3()
        .copy(baseTarget)
        .lerp(targForScroll, t);

      cameraRef.current.lookAt(smoothTarget);
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
