import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ShowCaseContent0,
  ShowCaseContent3,
  ShowCaseContent6,
  ShowCaseContent7,
  ShowCaseContent9,
  ShowCaseContent10,
  ShowCaseContent11,
} from "./ShowCaseContents";
import { getGui } from "../util/lil-gui";
import { useSystemStore } from "~/store/system_store";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";

type ShowCaseProps = {
  position: THREE.Vector3;
  index: number;
};

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const showcaseBodyMaterial = new THREE.MeshStandardMaterial({
  // color: "black",
  metalness: 1,
  roughness: 0,
});
const showcaseSheetMaterial = new THREE.MeshStandardMaterial({
  color: "#f1f1f1",
});
const showcaseGlassMaterial = new THREE.MeshPhysicalMaterial({
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

const showcaseComponents: any = {
  0: ShowCaseContent0,
  3: ShowCaseContent3,
  6: ShowCaseContent6,
  7: ShowCaseContent7,
  9: ShowCaseContent9,
  10: ShowCaseContent10,
  11: ShowCaseContent11,
};

export function ShowCase({ position, index }: ShowCaseProps) {
  const ShowcaseComponent: any = showcaseComponents[index];
  const state = useThree();

  const [isZoomIn, setIsZoomIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  const setIsPlayerFocus = useSystemStore(
    (state: any) => state.setIsPlayerFocus,
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
     * Texture Setup
     */
    const textureLoader = new THREE.TextureLoader();
    const stoneTexture = textureLoader.load("asset/texture/stone.png");

    if (stoneTexture) {
      showcaseBodyMaterial.map = stoneTexture;
      showcaseBodyMaterial.metalnessMap = stoneTexture; // テクスチャを使用して金属感を制御
      stoneTexture.repeat.x = 2;
      stoneTexture.repeat.y = 1;
      stoneTexture.wrapS = THREE.RepeatWrapping;
      stoneTexture.wrapT = THREE.RepeatWrapping;
    }

    // /**
    //  * Debug
    //  */
    // const gui = getGui();
    // if (gui && isFirstTry) {
    //   isFirstTry = false;
    //   const showcaseFolder = gui.addFolder("Showcase");

    //   showcaseFolder
    //     .add(showcaseBodyMaterial, "metalness", 0, 1, 0.001)
    //     .name("metalness");

    //   showcaseFolder
    //     .add(showcaseBodyMaterial, "roughness", 0, 1, 0.001)
    //     .name("roughness");
    // }
    // return () => {
    //   unsubscibePlayerPosition();
    // };
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
        position.x, // prettier-ignore
        position.y + 5,
        position.z + 4,
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
        position.x, // prettier-ignore
        position.y + 1,
        position.z - 4,
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
        position.x - 0, // prettier-ignore
        position.y + 6.5,
        position.z + 8.5,
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
        position.x + 0, // prettier-ignore
        position.y + 1,
        position.z - 2.5,
      );

      lerpCameraTarget.lerp(endCameratarget, 5 * delta);

      state.camera.lookAt(
        lerpCameraTarget.x, // prettier-ignore
        lerpCameraTarget.y,
        lerpCameraTarget.z,
      );
    }
  });

  const handleZoomIn = () => {
    if (isZoomIn == false) {
      /**
       * Update to Current Camera Position
       */

      setLeapCamera(state.camera.position.clone());

      /**
       * Update to Current Camera Target Position
       */

      const cameraTargetPosition = state.camera.position.clone();

      // Playerの位置を逆算
      cameraTargetPosition.y -= 10.65;
      cameraTargetPosition.z -= 20.5;

      // ターゲット補正
      cameraTargetPosition.z -= 4.25;

      setLeapCameraTarget(cameraTargetPosition);

      setIsPlayerFocus(false);
      setIsZoomIn(true);
    }
  };

  const handleZoomOut = () => {
    setIsZoomIn(false);
    setIsPlayerFocus(true);

    setLeapCamera(
      new THREE.Vector3(
        position.x, // prettier-ignore
        position.y + 10,
        position.z + 27,
      ),
    );
  };

  return (
    <>
      <>
        {/* ShowCase */}
        <group
          scale={1.1}
          onClick={handleZoomIn}
          onDoubleClick={handleZoomOut}
          onPointerUp={handleZoomIn}
          onContextMenu={handleZoomOut}
        >
          {/* Bottom */}
          <mesh
            geometry={boxGeometry}
            material={showcaseBodyMaterial}
            position={[0, 0.5, 0]}
            scale={[4, 1, 4]}
          />

          {/* Bottom Layer */}
          <mesh
            geometry={boxGeometry}
            material={showcaseSheetMaterial}
            position={[0, 1.005, 0]}
            scale={[3.8, 0.01, 3.8]}
          />

          {/* Top Layer */}
          <mesh
            geometry={boxGeometry}
            material={showcaseSheetMaterial}
            position={[0, 5, 0]}
            scale={[3.8, 0.01, 3.8]}
          />

          {/* Body Left */}
          <mesh
            geometry={boxGeometry}
            material={showcaseGlassMaterial}
            position={[-1.95, 3, 0]}
            scale={[0.1, 4, 4]}
          />

          {/* Body Right */}
          <mesh
            geometry={boxGeometry}
            material={showcaseGlassMaterial}
            position={[1.95, 3, 0]}
            scale={[0.1, 4, 4]}
          />

          {/* Body Forward */}
          <mesh
            geometry={boxGeometry}
            material={showcaseGlassMaterial}
            position={[0, 3, -1.95]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[0.1, 4, 4]}
          />

          {/* Body Backward */}
          {/* <mesh
            geometry={boxGeometry}
            material={showcaseBodyMaterial}
            position={[0, 3, 1.95]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[0.1, 4, 4]}
          /> */}

          {/* Top */}
          <mesh
            geometry={boxGeometry}
            material={showcaseBodyMaterial}
            position={[0, 5.125, 0]}
            scale={[4, 0.25, 4]}
          />

          {/* Main Content */}
          <ShowcaseComponent />
        </group>
      </>
    </>
  );
}
