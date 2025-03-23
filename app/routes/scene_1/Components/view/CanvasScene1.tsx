import { Canvas } from "@react-three/fiber";
import Experience from "../../Experience";
import { EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { useEffect, useState } from "react";
import { ToneMappingMode, BlendFunction } from "postprocessing";
import { useGlobalStore } from "~/store/global/global_store";
import { WhiteCustom } from "./PostProcessing/White/WhiteCustom";
import { HueSlideCustom } from "./PostProcessing/HueSlide/HueSlideCustom";
import { useSystemStore } from "~/store/scene1/system_store";
import { WhiteSlideCustom } from "./PostProcessing/WhiteSlide/WhiteSlideCustom";

export function CanvasScene1() {
  const isMobile = useGlobalStore((state) => state.isMobile);
  const [dpr, setDpr] = useState(2.0);

  const isLoaded = useGlobalStore((state: any) => state.isLoaded);
  const isIntroEnded = useSystemStore((state: any) => state.isIntroEnd);

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
          <WhiteCustom />
          {isIntroEnded || <HueSlideCustom />}
          <WhiteSlideCustom />
        </EffectComposer>
      </Canvas>
    </>
  );
}
