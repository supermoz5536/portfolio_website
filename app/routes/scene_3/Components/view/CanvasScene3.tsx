import { Canvas, advance, useThree } from "@react-three/fiber";
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
import { PreCompile } from "~/service/setup/preCompile";

export function CanvasScene3() {
  const isMobile = useGlobalStore((state) => state.isMobile);
  const [dpr, setDpr] = useState(2.0);

  const isPreLoaded = useGlobalStore((state) => state.isPreLoaded);

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
            <PreCompile sceneNumber={3} />
          </>
        )}

        <EffectComposer>
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Bloom
            luminanceThreshold={1.0}
            intensity={0.1}
            kernelSize={KernelSize.VERY_LARGE}
          />

          {isMobile ? (
            <>
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
