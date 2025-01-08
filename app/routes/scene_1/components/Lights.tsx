import { useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import ThreePlayer from "../../../store/three_player_store";
import * as THREE from "three";
import { GUI } from "lil-gui";
import { getGui } from "../util/lil-gui";

type ShowCaseLightProps = {
  shadowLevel: number;
};

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
      // const lightsGui = gui.addFolder("Lights");
      // lightsGui
      //   .add(dirLightRef.current.position, "x", -40, 40)
      //   .name("dirLight.y");
      // lightsGui
      //   .add(pointLightRef.current.position, "x", -10, 10)
      //   .name("pointLight.x");
      // lightsGui
      //   .add(pointLightRef.current.position, "y", 0, 15)
      //   .name("pointLight.y");
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
      {/* 
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
      /> */}
    </>
  );
}

/**
 * @param shadowLevel - 0から100の間で影の濃さを調整
 */
export function ShowCaseLight({ shadowLevel }: ShowCaseLightProps) {
  const withShadowRef: any = useRef();
  const withoutShadowRef: any = useRef();
  const gui = getGui();

  const [lerpIntengityWithShadow, setLerpIntengityWithShadow] = useState(0);
  const [targetIntengityWithShadow, setTargetIntengityWithShadow] = useState(0);

  const [lerpIntengityWithoutShadow, setLerpIntengityWithoutShadow] =
    useState(0);
  const [targetIntengityWithoutShadow, setTargetIntengityWithoutShadow] =
    useState(0);

  useHelper(withShadowRef, THREE.PointLightHelper, 1, "red");

  useEffect(() => {
    /**
     * Debug
     */

    if (gui) {
      if (withShadowRef.current && gui) {
        const lightsFolder = gui.addFolder("Lights");

        lightsFolder
          .add(withShadowRef.current.position, "x", -10, 10, 0.0001)
          .name("pointLight.x");

        lightsFolder
          .add(withShadowRef.current.position, "y", 0, 15, 0.0001)
          .name("pointLight.y");

        lightsFolder
          .add(withShadowRef.current.position, "z", -10, 10, 0.0001)
          .name("pointLight.Z");

        lightsFolder.close();
      }
    }

    setTargetIntengityWithShadow(shadowLevel);
    setTargetIntengityWithoutShadow(100 - shadowLevel);
  }, []);

  useFrame((state, delta) => {
    if (withShadowRef.current) {
      const newLerpIntensityWithShadow = THREE.MathUtils.lerp(
        lerpIntengityWithShadow, // start
        targetIntengityWithShadow, // end
        delta, // alpha
      );

      withShadowRef.current.intensity = newLerpIntensityWithShadow;

      /* 次の計算に使うための状態を保存 */
      setLerpIntengityWithShadow(newLerpIntensityWithShadow);
    }

    if (withoutShadowRef.current) {
      const newLerpIntensityWithoutShadow = THREE.MathUtils.lerp(
        lerpIntengityWithoutShadow, // start
        targetIntengityWithoutShadow, // end
        delta, // alpha
      );

      withoutShadowRef.current.intensity = newLerpIntensityWithoutShadow;

      /* 次の計算に使うための状態を保存 */
      setLerpIntengityWithoutShadow(newLerpIntensityWithoutShadow);
    }
  });

  return (
    <>
      {/* With Shadow */}
      <pointLight
        ref={withShadowRef}
        color="#fff"
        intensity={lerpIntengityWithShadow}
        distance={15}
        position={[0, 5, 0]}
        castShadow
        shadow-mapSize-width={1024} // 解像度を2048x2048に設定
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        shadow-normalBias={0.005} // normalBias を追加
      />

      {/* Without Shadow */}
      <pointLight
        ref={withoutShadowRef}
        color="#fff"
        intensity={lerpIntengityWithoutShadow}
        distance={15}
        position={[0, 5, 0]}
        shadow-mapSize-width={1024} // 解像度を2048x2048に設定
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        shadow-normalBias={0.005} // normalBias を追加
      />
    </>
  );
}
