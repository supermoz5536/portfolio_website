import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GUI } from "lil-gui";
import {
  getEnvironmentLightsFolder,
  getGui,
  getShowcaseLightsFolder,
} from "../../util/lil-gui";

type ShowCaseLightProps = {
  shadowLevel: number;
  index: number;
};

export function EnvironmentLights() {
  const dirLightRef: any = useRef();
  const ambLightRef: any = useRef();
  const environmentLightsFolder = getEnvironmentLightsFolder();

  // useHelper(dirLightRef, THREE.DirectionalLightHelper, 4, "red");

  useEffect(() => {
    /**
     * Debug
     */
    if (environmentLightsFolder) {
      environmentLightsFolder
        .add(dirLightRef.current.position, "x", -40, 40)
        .name("Directional Light X");

      environmentLightsFolder
        .add(dirLightRef.current.position, "y", -40, 40)
        .name("Directional Light Y");

      environmentLightsFolder
        .add(dirLightRef.current.position, "z", -40, 40)
        .name("Directional Light Z");

      environmentLightsFolder
        .add(dirLightRef.current, "intensity", 0, 2, 0.001)
        .name("Directional Light intensity");

      environmentLightsFolder
        .add(ambLightRef.current, "intensity", 0, 2, 0.001)
        .name("Ambient Intensity");
    }
  }, []);

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
        intensity={1}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
        shadow-normalBias={0.005} // normalBias を追加
      />

      <ambientLight ref={ambLightRef} intensity={0.4} />
    </>
  );
}

/**
 * @param shadowLevel - 0から100の間で影の濃さを調整
 */
export function ShowCaseLight({ shadowLevel, index }: ShowCaseLightProps) {
  const withShadowRef: any = useRef();
  const withoutShadowRef: any = useRef();

  const [lerpIntengityWithShadow, setLerpIntengityWithShadow] = useState(0);
  const [targetIntengityWithShadow, setTargetIntengityWithShadow] = useState(0);

  const [lerpIntengityWithoutShadow, setLerpIntengityWithoutShadow] =
    useState(0);
  const [targetIntengityWithoutShadow, setTargetIntengityWithoutShadow] =
    useState(0);

  // useHelper(withShadowRef, THREE.PointLightHelper, 1, "red");
  // useHelper(withoutShadowRef, THREE.PointLightHelper, 1, "red");

  useEffect(() => {
    /**
     * Debug
     * useFrame内のintensityのイージング処理と競合するので
     * 必ず、useFrameをコメントアウトしてから実行する
     */

    // const showcaseLightsFolder = getShowcaseLightsFolder();

    // if (
    //   withShadowRef.current &&
    //   withoutShadowRef.current &&
    //   showcaseLightsFolder
    // ) {
    //   // with Shadow
    //   const withShadowX = showcaseLightsFolder
    //     .add(withShadowRef.current.position, "x", -10, 10, 0.0001)
    //     .name(`with ShadowX${index}`);

    //   const withShadowY = showcaseLightsFolder
    //     .add(withShadowRef.current.position, "y", 0, 15, 0.0001)
    //     .name(`with ShadowY${index}`);

    //   const withShadowZ = showcaseLightsFolder
    //     .add(withShadowRef.current.position, "z", -10, 10, 0.0001)
    //     .name(`with ShadowZ${index}`);

    //   const withShadowIntensity = showcaseLightsFolder
    //     .add(withShadowRef.current, "intensity", 0, 200, 0.0001)
    //     .name(`with ShadowStr${index}`);

    //   // without Shadow
    //   const withoutShadowX = showcaseLightsFolder
    //     .add(withoutShadowRef.current.position, "x", -10, 10, 0.0001)
    //     .name(`without ShadowX${index}`);

    //   const withoutShadowY = showcaseLightsFolder
    //     .add(withoutShadowRef.current.position, "y", 0, 15, 0.0001)
    //     .name(`without ShadowY${index}`);

    //   const withoutShadowZ = showcaseLightsFolder
    //     .add(withoutShadowRef.current.position, "z", -10, 10, 0.0001)
    //     .name(`without ShadowZ${index}`);

    //   const withoutShadowIntensity = showcaseLightsFolder
    //     .add(withoutShadowRef.current, "intensity", 0, 200, 0.0001)
    //     .name(`without ShadowStr${index}`);

    //   return () => {
    //     withShadowX.destroy();
    //     withShadowY.destroy();
    //     withShadowZ.destroy();
    //     withShadowIntensity.destroy();

    //     withoutShadowX.destroy();
    //     withoutShadowY.destroy();
    //     withoutShadowZ.destroy();
    //     withoutShadowIntensity.destroy();
    //   };
    // }

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
      {/* <pointLight
        ref={withShadowRef}
        color="#fff"
        intensity={lerpIntengityWithShadow}
        distance={15}
        position={[0, 5, 0]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        shadow-normalBias={0.05}
      /> */}

      {/* Without Shadow */}
      <pointLight
        ref={withoutShadowRef}
        color="#fff"
        intensity={lerpIntengityWithoutShadow}
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
