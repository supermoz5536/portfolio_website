import * as THREE from "three";
import { useEffect, useState } from "react";
import { useSystemStore } from "~/store/system_store";
import ThreePlayerStore from "../../../../store/three_player_store";
import ThreeContentsStore from "../../../../store/three_contents_store";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import ThreeInterfaceStore from "../../../../store/three_interface_store";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Object3D } from "three";

type StoneTabletProps = {
  position: THREE.Vector3;
  index: number;
};

/**
 * Loader
 */

const gltfLoader: any = new GLTFLoader();
const dracoLoader: any = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader);

export function StoneTablet({ position, index }: StoneTabletProps) {
  const state = useThree();

  const setIsPlayerFocus = useSystemStore((state: any) => state.setIsPlayerFocus); // prettier-ignore
  const currentPosition = ThreePlayerStore((state: any) => state.currentPosition); // prettier-ignore
  const setIsContentSelectedMouseDown = ThreeContentsStore((state: any) => state.setIsContentSelectedMouseDown); // prettier-ignore
  const setStoneTabletStore = ThreeContentsStore((state: any) => state.setStoneTabletStore); // prettier-ignore

  const [isDown, setIsDown] = useState(false);
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouchMoveOn, setIsTouchMoveOn] = useState(false);
  const [scene, setScene] = useState<Object3D>();

  const [lerpCamera, setLeapCamera] = useState(
    new THREE.Vector3(
      position.x, // prettier-ignore
      position.y + 10,
      position.z + 27,
    ),
  );

  const [lerpCameraTarget, setLeapCameraTarget] = useState(
    new THREE.Vector3(
      position.x, // prettier-ignore
      position.y,
      position.z - 4.25,
    ),
  );

  useEffect(() => {
    /**
     * Importing Model
     */

    gltfLoader.load("/asset/model/stoneTablet.glb", (gltf: any) => {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      setScene(gltf.scene);
    });

    /**
     * Add Listener
     */

    const unsubscribeIsPlayerFocused = useSystemStore.subscribe(
      (state: any) => state.isPlayerFocused,
      (isPlayerFocused) => {
        if (isPlayerFocused == true) handleZoomOut();
      },
    );

    const unsubscribeIsTouchMoveOn = ThreeInterfaceStore.subscribe(
      (state: any) => state.isTouchMoveOn,
      (value) => {
        setIsTouchMoveOn(value);
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
      unsubscribeIsTouchMoveOn();
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
        position.x + 6, // prettier-ignore
        position.y + 3,
        position.z - 4,
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
        position.x + 12, // prettier-ignore
        position.y + 1.5,
        position.z - 14,
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
        position.x + 4.5, // prettier-ignore
        position.y + 7.5,
        position.z - 1.5,
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
        position.x + 12, // prettier-ignore
        position.y - 2,
        position.z - 14.25,
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
      setStoneTabletStore(true, index);

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
    setStoneTabletStore(false, index);
    setIsZoomIn(false);
    setIsPlayerFocus(true);
  };

  return (
    <>
      {scene && (
        <primitive
          object={scene}
          scale={1.75}
          onPointerDown={handlePointerDown}
          onPointerUp={handleZoomIn}
          position={[8.75, 1.75, -8.75]}
          rotation={[0, -Math.PI / 1.5, 0]}
        />
      )}
    </>
  );
}
