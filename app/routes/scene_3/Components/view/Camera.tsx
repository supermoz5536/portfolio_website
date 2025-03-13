import { PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import * as THREE from "three";
import { useGlobalStore } from "~/store/global/global_store";
import { useSystemStore } from "~/store/scene3/system_store";

export function Camera() {
  const cameraRef = useRef<any>();
  const three = useThree();
  const scrollProgress = useSystemStore(
    (state) => state.scrollProgressTopAndTop,
  );

  // size: 現在のcanvas描画領域(width, height)が格納
  const size = useThree((store) => store.size);
  const set = useThree((store) => store.set);

  const cameraPpoints = [
    new THREE.Vector3(165, 100, -240),
    new THREE.Vector3(95, 87, -240),
    new THREE.Vector3(25, 69, -240),
    new THREE.Vector3(-5, 55.5, -185),
    new THREE.Vector3(17.5, 21, -60),
    new THREE.Vector3(40, 1, 25),
    new THREE.Vector3(-7, 4, 20),
  ];

  const curve = new THREE.CatmullRomCurve3(cameraPpoints, false);

  const isMobile = useGlobalStore((state) => state.isMobile);

  // デフォルトカメラとして登録
  useLayoutEffect(() => {
    set({ camera: cameraRef.current });
    cameraRef.current.layers.enable(0);
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
    if (cameraRef.current) {
      const newCameraPos = curve.getPoint(scrollProgress);
      cameraRef.current.position.set(
        newCameraPos.x, // prettier-ignore
        newCameraPos.y, // prettier-ignore
        newCameraPos.z, // prettier-ignore
      );
      three.camera.lookAt(new THREE.Vector3());
      if (scrollProgress > 0.92) {
        isMobile
          ? three.camera.lookAt(new THREE.Vector3(90, 30, -240))
          : three.camera.lookAt(new THREE.Vector3(180, 30, -240));
      }
    }
  }, [scrollProgress, size]);

  return (
    <perspectiveCamera
      ref={cameraRef}
      fov={45}
      near={0.1}
      far={4000}
      position={[0, 20, 100]}
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
