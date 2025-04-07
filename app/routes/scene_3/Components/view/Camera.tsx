import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { useGlobalStore } from "~/store/global/global_store";
import { useSystemStore } from "~/store/scene3/system_store";

export function Camera() {
  const three = useThree();

  const cameraRef = useRef<any>();

  const scrollProgress = useSystemStore((state) => state.scrollProgressTopAndTop); // prettier-ignore

  // size: 現在のcanvas描画領域(width, height)が格納
  const size = useThree((store) => store.size);
  const set = useThree((store) => store.set);

  const cameraPpoints = [
    new THREE.Vector3(165, 100, -240),
    new THREE.Vector3(95, 87, -240),
    new THREE.Vector3(25, 68, -240),
    new THREE.Vector3(-13, 55.5, -185),
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
    cameraRef.current.position.set(165, 100, -240);
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

  useFrame((state, delta) => {
    if (cameraRef.current) {
      const newCameraPos = curve.getPoint(scrollProgress);

      const lerpTarget = new THREE.Vector3()
        .copy(cameraRef.current.position)
        .lerp(newCameraPos, 0.5);

      cameraRef.current.position.lerp(lerpTarget, delta * 2.5);

      three.camera.lookAt(new THREE.Vector3());
      if (scrollProgress > 0.92) {
        isMobile
          ? three.camera.lookAt(new THREE.Vector3(90, 30, -240))
          : three.camera.lookAt(new THREE.Vector3(180, 30, -240));
      }
    }
  });

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
