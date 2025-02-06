import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useSystemStore } from "~/store/system_store";
import ThreePlayerStore from "../../../../store/three_player_store";
import ThreeContentsStore from "../../../../store/three_contents_store";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { ArrowPlaneMaterial } from "./Materials/ArrowPlaneMaterial";

type CommonProps = {
  normWidth: number;
  normHeight: number;
};

const circleGeometry = new THREE.CircleGeometry(0.5, 32);
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const bottomConeGeometry = new THREE.ConeGeometry(25, 40, 4); // 第一引数は、内接円の半径

const glassMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 0,
  transmission: 1,
  ior: 1.62,
  thickness: 0.001,
  opacity: 0.95, // 透明度を強調
  transparent: true, // 透明を有効化
  color: 0xffffff, // 完全な白
  depthWrite: false,
});

export function TopCircle({ normWidth, normHeight }: CommonProps) {
  return (
    <>
      <mesh
        geometry={circleGeometry}
        material={
          new THREE.MeshStandardMaterial({
            color: "blue",
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
          })
        }
        position={[61, normHeight, -62]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[normWidth, normWidth, 1]}
      />
    </>
  );
}

export function ArrowPlane({ normWidth, normHeight }: CommonProps) {
  const arrowPlaneRef = useRef<any>();
  const lookAtTagetRef = useRef<any>(new THREE.Vector3());
  const state = useThree();
  const arrowPlaneMaterial = ArrowPlaneMaterial();

  useFrame(() => {
    if (arrowPlaneRef.current) {
      // Set target
      lookAtTagetRef.current.copy(state.camera.position);
      lookAtTagetRef.current.y = 0;

      // Apply target
      arrowPlaneRef.current.lookAt(lookAtTagetRef.current);
    }
  });

  return (
    <>
      <mesh
        ref={arrowPlaneRef}
        geometry={planeGeometry}
        material={arrowPlaneMaterial}
        position={[61, normHeight / 2, -62]}
        scale={[normWidth, normHeight, 1]}
      />
    </>
  );
}

export function MidPlane() {
  return (
    <>
      <mesh
        geometry={planeGeometry}
        material={
          new THREE.MeshStandardMaterial({
            color: "red",
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
          })
        }
        position={[61, -3.25, -62]}
        rotation={[Math.PI / 2, 0, -Math.PI * 0.2 - Math.PI / 4]}
        scale={[35.5, 35.5, 1]}
      />
    </>
  );
}

export function BottomCone() {
  const bottomHeight = 40;
  const bottomConePosition = new THREE.Vector3(61, -bottomHeight / 3 - 10, -62);

  return (
    <>
      <mesh
        geometry={bottomConeGeometry}
        material={glassMaterial}
        position={bottomConePosition}
        rotation={[Math.PI, -Math.PI * 0.2, 0]}
      />
    </>
  );
}

export function InsideCone() {
  const bottomHeight = 40;
  const bottomConePosition = new THREE.Vector3(61, -bottomHeight / 3 - 10, -62);

  return (
    <>
      <mesh
        geometry={bottomConeGeometry}
        material={
          new THREE.MeshStandardMaterial({
            color: "#90EE90",
            transparent: true,
            opacity: 0.4,
          })
        }
        position={bottomConePosition}
        rotation={[Math.PI, -Math.PI * 0.2, 0]}
        scale={0.925}
      />
    </>
  );
}

export function Tower() {
  const state = useThree();
  const cameraBasePosition = new THREE.Vector3(61, -23, -62);
  const floorsCol0 = [0, 1, 2];
  const floorsCol1 = [3, 4, 5];
  const floorsCol2 = [6, 7, 8];
  const floorsCol3 = [9, 10, 11];

  // 奥４列ごとの normwidth normheightを設定
  // 右３列は、緑の責務なので必要ない

  const setIsPlayerFocus = useSystemStore((state: any) => state.setIsPlayerFocus); // prettier-ignore
  const currentPosition = ThreePlayerStore((state: any) => state.currentPosition); // prettier-ignore
  const setIsContentSelectedMouseDown = ThreeContentsStore((state: any) => state.setIsContentSelectedMouseDown); // prettier-ignore

  const [isDown, setIsDown] = useState(false);
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouchMoveOn, setIsTouchMoveOn] = useState(false);
  const [normWidth, setNormWidth] = useState(40);
  const [normHeight, setNormHeight] = useState(5);

  const [lerpCamera, setLeapCamera] = useState(
    new THREE.Vector3(
      cameraBasePosition.x, // prettier-ignore
      cameraBasePosition.y + 10,
      cameraBasePosition.z + 27,
    ),
  );

  const [lerpCameraTarget, setLeapCameraTarget] = useState(
    new THREE.Vector3(
      cameraBasePosition.x, // prettier-ignore
      cameraBasePosition.y,
      cameraBasePosition.z - 4.25,
    ),
  );

  useEffect(() => {
    /**
     * Device Setup
     */

    if (typeof window !== "undefined") {
      if (window.innerWidth < 500) setIsMobile(true);
      if (window.innerWidth >= 500) setIsMobile(false);
    }

    /**
     * Add Listener
     */

    const unsubscribeIsPlayerFocused = useSystemStore.subscribe(
      (state: any) => state.isPlayerFocused,
      (value) => {
        if (value == true) handleZoomOut();
      },
    );

    const unsubscribeCurrentFloorNum = ThreePlayerStore.subscribe(
      (state: any) => state.currentFloorNum,
      (value) => {
        if (floorsCol0.includes(value)) {
          setNormHeight(5);
          setNormWidth(40);
        } else if (floorsCol1.includes(value)) {
          setNormHeight(15);
          setNormWidth(30);
        } else if (floorsCol2.includes(value)) {
          setNormHeight(25);
          setNormWidth(20);
        } else if (floorsCol3.includes(value)) {
          setNormHeight(35);
          setNormWidth(10);
        }
      },
    );

    //該当コンテンツ外でマウス/タップがキャンセルされた際の初期化
    const handleMouseUp = () => setIsDown(false);
    const handleTouchEnd = () => setIsDown(false);
    const handleTouchCancel = () => setIsDown(false);

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchCancel);

    return () => {
      unsubscribeIsPlayerFocused();
      unsubscribeCurrentFloorNum();
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, []);

  useFrame((state, delta) => {
    /**
     * Desktop
     */

    if (isZoomIn && !isMobile) {
      /**
       * Position Camera
       */
      const endPositionCamera = new THREE.Vector3(
        cameraBasePosition.x - 40, // prettier-ignore
        cameraBasePosition.y + 40,
        cameraBasePosition.z + 85,
      );

      lerpCamera.lerp(endPositionCamera, 5 * delta);

      state.camera.position.set(
        lerpCamera.x, // prettier-ignore
        lerpCamera.y,
        lerpCamera.z,
      );

      /**
       * Position Camera Target
       */

      const endCameratarget = new THREE.Vector3(
        cameraBasePosition.x, // prettier-ignore
        cameraBasePosition.y + 20,
        cameraBasePosition.z,
      );

      lerpCameraTarget.lerp(endCameratarget, 5 * delta);

      state.camera.lookAt(
        lerpCameraTarget.x, // prettier-ignore
        lerpCameraTarget.y,
        lerpCameraTarget.z,
      );
    }

    /**
     * Mobile
     */

    if (isZoomIn && isMobile) {
      /**
       * Position Camera
       */
      const endPositionCamera = new THREE.Vector3(
        cameraBasePosition.x - 45, // prettier-ignore
        cameraBasePosition.y + 45,
        cameraBasePosition.z + 120,
      );

      lerpCamera.lerp(endPositionCamera, 5 * delta);

      state.camera.position.set(
        lerpCamera.x, // prettier-ignore
        lerpCamera.y,
        lerpCamera.z,
      );

      /**
       * Position Camera Target
       */

      const endCameratarget = new THREE.Vector3(
        cameraBasePosition.x, // prettier-ignore
        cameraBasePosition.y + 15,
        cameraBasePosition.z,
      );

      lerpCameraTarget.lerp(endCameratarget, 5 * delta);

      state.camera.lookAt(
        lerpCameraTarget.x, // prettier-ignore
        lerpCameraTarget.y,
        lerpCameraTarget.z,
      );
    }
  });

  const handlePointerDown = () => {
    setIsDown(true);
    setIsContentSelectedMouseDown(true);
  };

  const handleZoomIn = () => {
    if (isDown && !isZoomIn && !isTouchMoveOn) {
      setIsDown(false);
      setIsContentSelectedMouseDown(false);
      setIsPlayerFocus(false);
      setIsZoomIn(true);

      /**
       * Update to Current Camera Position
       */

      setLeapCamera(state.camera.position.clone());

      /**
       * Update to Current Camera Target Position
       */

      const cameraTargetPosition = state.camera.position.clone();

      // Direction
      const forwardDir: any = new THREE.Vector3();
      forwardDir.subVectors(currentPosition, state.camera.position);
      forwardDir.y = 0;
      forwardDir.normalize();

      // Player に照準
      cameraTargetPosition.y -= 5;
      cameraTargetPosition.add(forwardDir.multiplyScalar(15));

      // cameraTarget に照準
      cameraTargetPosition.add(forwardDir.multiplyScalar(10));

      setLeapCameraTarget(cameraTargetPosition);
    }
  };

  const handleZoomOut = () => {
    setIsZoomIn(false);
    setIsPlayerFocus(true);
  };

  return (
    <group onPointerDown={handlePointerDown} onPointerUp={handleZoomIn}>
      <group position={[0, -2.5, 0]}>
        <TopCircle normWidth={normWidth} normHeight={normHeight} />
        <ArrowPlane normWidth={normWidth} normHeight={normHeight} />
      </group>

      <MidPlane />
      <BottomCone />
      <InsideCone />
    </group>
  );
}
