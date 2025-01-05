import { useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import ThreePlayer from "../../../store/three_player_store";
import * as THREE from "three";
import { GUI } from "lil-gui";
import { getGui } from "../util/lil-gui";

export default function Lights() {
  const sampleDirLightRef: any = useRef();
  useHelper(sampleDirLightRef, THREE.DirectionalLightHelper, 4, "red");

  const dirLightRef: any = useRef();
  useHelper(dirLightRef, THREE.DirectionalLightHelper, 4, "red");

  const pointLightRef: any = useRef();
  useHelper(pointLightRef, THREE.PointLightHelper, 1, "red");

  const gui = getGui();

  /* Initialize */
  useEffect(() => {
    if (gui) {
      const lightsGui = gui.addFolder("Lights");

      // lightsGui
      //   .add(dirLightRef.current.position, "x", -40, 40)
      //   .name("dirLight.y");
      lightsGui
        .add(pointLightRef.current.position, "x", -10, 10)
        .name("pointLight.x");
      lightsGui
        .add(pointLightRef.current.position, "y", 0, 15)
        .name("pointLight.y");
    }

    /* Listem Player Current Floor */
    const unsubscibePlayerPosition = ThreePlayer.subscribe(
      (state: any) => state.currentFloorNum,
      (value) => {},
    );
    return () => {
      unsubscibePlayerPosition();
    };
  }, []);

  useFrame((state) => {
    // if (sampleDirLightRef.current) {
    //   sampleDirLightRef.current.position.x = state.camera.position.x + 10;
    //   sampleDirLightRef.current.position.y = state.camera.position.y + 15;
    //   sampleDirLightRef.current.position.z = state.camera.position.z + 10;
    //   sampleDirLightRef.current.target.position.x = state.camera.position.x;
    //   sampleDirLightRef.current.target.position.y = state.camera.position.y;
    //   sampleDirLightRef.current.target.position.z = state.camera.position.z - 5;
    //   sampleDirLightRef.current.target.updateMatrixWorld();
    // }
    // if (dirLightRef.current) {
    //   dirLightRef.current.position.x = state.camera.position.x + 6;
    //   dirLightRef.current.position.y = state.camera.position.y + 6;
    //   dirLightRef.current.position.z = state.camera.position.z + 3;
    //   dirLightRef.current.target.position.x = state.camera.position.x;
    //   dirLightRef.current.target.position.y = state.camera.position.y;
    //   dirLightRef.current.target.position.z = state.camera.position.z - 5;
    //   dirLightRef.current.target.updateMatrixWorld();
    // }
  });

  return (
    <>
      {/* <directionalLight
        ref={sampleDirLightRef}
        color={"#ffffff"}
        castShadow
        position={[3, 3, 1]}
        intensity={4.75}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-top={100}
        shadow-camera-right={100}
        shadow-camera-bottom={-100}
        shadow-camera-left={-100}
      /> */}
      {/* <directionalLight
        ref={dirLightRef}
        color={"#ffffff"}
        castShadow
        position={[15, 15, 10]}
        intensity={1.75}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
        shadow-normalBias={0.05} // normalBias を追加
      /> */}

      <ambientLight intensity={0.75} />

      <pointLight
        ref={pointLightRef}
        color="#fff"
        intensity={1000}
        distance={15}
        position={[0, 12.5, 0]}
        castShadow
        shadow-mapSize-width={1024} // 解像度を2048x2048に設定
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        shadow-normalBias={0.005} // normalBias を追加
      />
    </>
  );
}
