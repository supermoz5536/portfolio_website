import { Canvas, useThree } from "@react-three/fiber";
import Experience from "../../Experience";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  ToneMapping,
} from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import { ToneMappingMode, BlendFunction } from "postprocessing";
import { KernelSize } from "postprocessing";
import { OutLineCustom } from "./PostProcessing/Outline/OutlineCustom";
import { useGlobalStore } from "~/store/global/global_store";
import { NormalCustom } from "./PostProcessing/Normal/Normal";

export function PreCompile() {
  const resultRef = useRef<any>(null);

  const setIsCompiledScene3 = useGlobalStore(
    (state: any) => state.setIsCompiledScene3,
  );

  const { gl, scene, camera } = useThree();

  useEffect(() => {
    resultRef.current = runCompile();

    if (resultRef.current) {
      setIsCompiledScene3(true);
    }
  }, [gl, scene, camera]);

  async function runCompile() {
    await gl.compileAsync(scene, camera);
  }

  return null;
}

export function CanvasScene3() {
  const isMobile = useGlobalStore((state) => state.isMobile);
  const [dpr, setDpr] = useState(2.0);

  const isPreLoaded = useGlobalStore((state) => state.isPreLoaded);
  const isLoaded = useGlobalStore((state) => state.isLoaded);

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio, 2.0));
  }, []);
  return (
    <>
      <Canvas
        frameloop="never"
        style={{
          minHeight: "100vh",
          height: "100%",
          width: "100%",
          zIndex: 0,
        }}
        shadows
        gl={{
          localClippingEnabled: true,
          alpha: true,
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 4000,
          position: [0, 0, 100],
        }}
        dpr={isMobile ? 0.65 : dpr}
      >
        {isPreLoaded && (
          <>
            <Experience />
            <PreCompile />
          </>
        )}

        <EffectComposer>
          {/**
           * Mobile のShowcaseContentsの内容が簡易的になっているので
           * Section1を実装後のパフォーマンスを踏まえて
           * コンテンツ内容を最終調整する。
           * パフォーマンスに余裕があればPCと同じコンテンツ内容も検討する
           */}
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />

          {isMobile ? (
            <>
              <Bloom
                luminanceThreshold={1.0}
                intensity={2.1} // Setting For NormalCustom
                // intensity={1} // Setting For No NormalCustom
                kernelSize={KernelSize.VERY_LARGE}
              />
              <DepthOfField
                blendFunction={BlendFunction.NORMAL}
                focusDistance={0.001}
                focalLength={0.0025}
                bokehScale={3.75}
                worldFocusRange={130}
              />
            </>
          ) : (
            <>
              <Bloom
                luminanceThreshold={1.0}
                intensity={0.1}
                kernelSize={KernelSize.VERY_LARGE}
              />
              <DepthOfField
                focusDistance={0.005}
                focalLength={0.025}
                bokehScale={6}
              />
            </>
          )}
          <NormalCustom />
          <OutLineCustom />
        </EffectComposer>
      </Canvas>
    </>
  );
}
