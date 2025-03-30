import { useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useGlobalStore } from "~/store/global/global_store";
import { useSystemStore } from "~/store/scene1/system_store";
import { gsap } from "gsap/dist/gsap";

let isFirstTry = true;
let isAnimation = true;

export function Camera() {
  const cameraRef = useRef<any>();
  const three = useThree();
  const animationRatioRef = useRef({ progress: 0 });
  const isAnimationRef = useRef(true);

  const isMobile = useGlobalStore((state) => state.isMobile);
  const isIntroEnded = useSystemStore((state: any) => state.isIntroEnd);
  const scrollProgress = useSystemStore(
    (state) => state.scrollProgressTopAndBottom,
  );

  // size: 現在のcanvas描画領域(width, height)が格納
  const size = useThree((store) => store.size);
  const set = useThree((store) => store.set);

  const tempVec3 = new THREE.Vector3(0, -11, 0);

  const cameraPpoints = [
    new THREE.Vector3(19.3, 12.5, 60),
    new THREE.Vector3(5, 2, -5),
    new THREE.Vector3(45, 15.5, -40),
    new THREE.Vector3(55, 20.5, -80),
  ];

  const curve = new THREE.CatmullRomCurve3(cameraPpoints, false);

  // デフォルトカメラとして登録
  useLayoutEffect(() => {
    set({ camera: cameraRef.current });
    cameraRef.current.layers.enable(0);

    if (cameraRef.current) {
      cameraRef.current.lookAt(tempVec3);
    }
  }, []);

  // 初回マウント前にアスペクト比率を事前適用する必要がある
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

  useEffect(() => {
    if (isFirstTry) {
      // if (isFirstTry && isIntroEnded) {
      isFirstTry = false;
      gsap.to(animationRatioRef.current, {
        duration: 5,
        progress: 1,
        ease: "power1.inOut",
        delay: 2.5,
        onUpdate: () => {
          if (isAnimation && cameraRef.current) {
            const t = animationRatioRef.current.progress;
            let radiusRatio = 0;

            if (t < 0.5) {
              // scroll [0.0 - 0.5] => ratio [0.0 - 1.0]
              radiusRatio = t * 2.0;
            } else {
              // scroll [0.5 - 1.0] => ratio [1.0 - 0.5]
              radiusRatio = 1.0 - (t - 0.5);
            }

            const revolutions = 2; // 螺旋の回転数
            const phi = Math.PI * 2.2 * revolutions * t; // 総回転角
            const radius = 125 * radiusRatio; // 半径
            const startY = 100;
            const endY = 12.5;
            const y = startY - t * (startY - endY);
            const x = radius * Math.cos(phi);
            const z = radius * Math.sin(phi);

            cameraRef.current.position.set(x, y, z);
            cameraRef.current.lookAt(tempVec3);

            if (t == 1.0) {
              isAnimation = false;
              console.log("isAnimationRef.current", isAnimationRef.current);
            }
          }
        },
      });
    }
  }, [isIntroEnded]);

  useEffect(() => {
    if (!isAnimation && cameraRef.current) {
      const newCameraPos = curve.getPoint(scrollProgress);
      cameraRef.current.position.set(
        newCameraPos.x, // prettier-ignore
        newCameraPos.y, // prettier-ignore
        newCameraPos.z, // prettier-ignore
      );

      cameraRef.current.lookAt(0, 15, -100);
    }
  }, [scrollProgress, size]);

  return (
    <perspectiveCamera
      ref={cameraRef}
      fov={45}
      near={0.1}
      far={4000}
      position={[0, 250, 0]}
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
