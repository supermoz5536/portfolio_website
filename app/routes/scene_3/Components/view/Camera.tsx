import { PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Vector3 } from "three";
import * as THREE from "three";
import { useSystemStore } from "~/store/scene3/system_store";

export function Camera() {
  const cameraRef = useRef<any>();
  const scrollProgress = useSystemStore((state) => state.scrollProgress);

  // size: 現在のcanvas描画領域(width, height)が格納
  const size = useThree((store) => store.size);
  const set = useThree((store) => store.set);

  const cameraPpoints = [
    new THREE.Vector3(210, 100, -190),
    new THREE.Vector3(30, 70, -190),
    new THREE.Vector3(-20, 10, 20),
  ];

  const curve = new THREE.CatmullRomCurve3(cameraPpoints, false);

  // デフォルトカメラとして登録
  useLayoutEffect(() => {
    set({ camera: cameraRef.current });
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
      console.log(scrollProgress);

      const newPos = curve.getPoint(scrollProgress);

      cameraRef.current.position.set(
        newPos.x, // prettier-ignore
        newPos.y, // prettier-ignore
        newPos.z, // prettier-ignore
      );

      // cameraRef.current.position.set(
      //   0 + (200 * scrollProgress), // prettier-ignore
      //   20 + (200 * scrollProgress), // prettier-ignore
      //   100 + (200 * scrollProgress), // prettier-ignore
      // );
    }
  }, [scrollProgress]);

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
