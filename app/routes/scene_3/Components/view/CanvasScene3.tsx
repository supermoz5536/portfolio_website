import { Canvas } from "@react-three/fiber";
import Experience from "../../Experience";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  ToneMapping,
} from "@react-three/postprocessing";
import { useEffect, useState } from "react";
import { ToneMappingMode } from "postprocessing";
import { KernelSize } from "postprocessing";
import { OutLineCustom } from "./PostProcessing/Outline/Outline";
import { useGlobalStore } from "~/store/global/global_store";
import { NormalCustom } from "./PostProcessing/Normal/Normal";

export function CanvasScene3() {
  const isMobile = useGlobalStore((state) => state.isMobile);
  const [dpr, setDpr] = useState(2.0);

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
        <Experience />
        <EffectComposer>
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <NormalCustom />
          {isMobile ? (
            <>
              <Bloom
                luminanceThreshold={1.0}
                intensity={0.1}
                kernelSize={KernelSize.SMALL}
                resolutionScale={0.3}
              />
              <DepthOfField
                focusDistance={0.005}
                focalLength={0.025}
                bokehScale={2}
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
          <OutLineCustom />
        </EffectComposer>
      </Canvas>
    </>
  );
}
