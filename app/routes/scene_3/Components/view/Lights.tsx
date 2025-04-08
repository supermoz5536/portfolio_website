import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GUI } from "lil-gui";
import {
  getEnvironmentLightsFolder,
  getGui,
  getShowcaseLightsFolder,
} from "../../util/lil-gui";
import { useGlobalStore } from "~/store/global/global_store";

type ShowCaseLightProps = {
  shadowLevel: number;
  index: number;
};

export function EnvironmentLights() {
  const dirLightRef: any = useRef();
  const ambLightRef: any = useRef();
  const environmentLightsFolder = getEnvironmentLightsFolder();

  const isMobile = useGlobalStore((state) => state.isMobile);

  // useEffect(() => {
  //   /**
  //    * Debug
  //    */
  //   if (environmentLightsFolder) {
  //     environmentLightsFolder
  //       .add(dirLightRef.current.position, "x", -40, 40)
  //       .name("Directional Light X");

  //     environmentLightsFolder
  //       .add(dirLightRef.current.position, "y", -40, 40)
  //       .name("Directional Light Y");

  //     environmentLightsFolder
  //       .add(dirLightRef.current.position, "z", -40, 40)
  //       .name("Directional Light Z");

  //     environmentLightsFolder
  //       .add(dirLightRef.current, "intensity", 0, 2, 0.001)
  //       .name("Directional Light intensity");

  //     environmentLightsFolder
  //       .add(ambLightRef.current, "intensity", 0, 2, 0.001)
  //       .name("Ambient Intensity");
  //   }
  // }, []);

  useFrame((state) => {
    if (dirLightRef.current) {
      dirLightRef.current.position.x = state.camera.position.x + 6;
      dirLightRef.current.position.y = state.camera.position.y + 6;
      dirLightRef.current.position.z = state.camera.position.z + 3;
      dirLightRef.current.target.position.x = state.camera.position.x;
      dirLightRef.current.target.position.y = state.camera.position.y;
      dirLightRef.current.target.position.z = state.camera.position.z - 5;
      dirLightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <directionalLight
        ref={dirLightRef}
        color={"#ffffff"}
        // position={[4, 4, 4]}
        position={[15, 15, 15]}
        intensity={isMobile ? 1 : 1}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
        shadow-bias={-0.001}
        shadow-normalBias={0.1}
      />

      <ambientLight ref={ambLightRef} intensity={isMobile ? 0.4 : 0.4} />
    </>
  );
}

export function ShowCaseLight({ shadowLevel, index }: ShowCaseLightProps) {
  return (
    <>
      <pointLight
        color="#fff"
        intensity={100}
        distance={15}
        position={[index == 0 ? -1.8 : 0, 5, 0]}
        shadow-mapSize-width={1024} // 解像度を2048x2048に設定
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        shadow-normalBias={0.05}
      />
    </>
  );
}
