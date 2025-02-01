import * as THREE from "three";
import { useEffect, useState } from "react";
import { useSystemStore } from "~/store/system_store";
import ThreePlayerStore from "../../../../store/three_player_store";
import ThreeContentsStore from "../../../../store/three_contents_store";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";

const towerGeometry = new THREE.ConeGeometry(40, 120, 32);

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

export function Tower() {
  const centerAxisPosition = new THREE.Vector3(81, 30, -42);
  const state = useThree();

  const setIsPlayerFocus = useSystemStore((state: any) => state.setIsPlayerFocus); // prettier-ignore
  const currentPosition = ThreePlayerStore((state: any) => state.currentPosition); // prettier-ignore
  const setIsContentSelectedMouseDown = ThreeContentsStore((state: any) => state.setIsContentSelectedMouseDown); // prettier-ignore

  const [isDown, setIsDown] = useState(false);
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [lerpCamera, setLeapCamera] = useState(
    new THREE.Vector3(
      centerAxisPosition.x, // prettier-ignore
      centerAxisPosition.y + 10,
      centerAxisPosition.z + 27,
    ),
  );

  const [lerpCameraTarget, setLeapCameraTarget] = useState(
    new THREE.Vector3(
      centerAxisPosition.x, // prettier-ignore
      centerAxisPosition.y,
      centerAxisPosition.z - 4.25,
    ),
  );

  useEffect(() => {
    /**
     * Add Listener
     */

    const unsubscribeIsPlayerFocused = useSystemStore.subscribe(
      (state: any) => state.isPlayerFocused,
      (isPlayerFocused) => {
        if (isPlayerFocused == true) handleZoomOut();
      },
    );

    const handleMouseUp = () => setIsDown(false);
    const handleTouchEnd = () => setIsDown(false);
    const handleTouchCancel = () => setIsDown(false);

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchCancel);

    /**
     * Device Setup
     */

    if (typeof window !== "undefined") {
      if (window.innerWidth < 500) setIsMobile(true);
      if (window.innerWidth >= 500) setIsMobile(false);
    }

    return () => {
      unsubscribeIsPlayerFocused();
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
        centerAxisPosition.x - 100, // prettier-ignore
        centerAxisPosition.y + 20,
        centerAxisPosition.z + 145,
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
        centerAxisPosition.x, // prettier-ignore
        centerAxisPosition.y - 5,
        centerAxisPosition.z,
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
        centerAxisPosition.x - 0, // prettier-ignore
        centerAxisPosition.y + 6.5,
        centerAxisPosition.z + 8.5,
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
        centerAxisPosition.x + 0, // prettier-ignore
        centerAxisPosition.y + 1,
        centerAxisPosition.z - 2.5,
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
    if (isDown && isZoomIn == false) {
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
    <>
      <mesh
        onPointerDown={handlePointerDown}
        onPointerUp={handleZoomIn}
        geometry={towerGeometry}
        material={glassMaterial}
        position={centerAxisPosition}
      />
    </>
  );
}
