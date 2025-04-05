import { Canvas, useThree } from "@react-three/fiber";
import Experience from "../../Experience";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import { ToneMappingMode } from "postprocessing";
import { useGlobalStore } from "~/store/global/global_store";
import { WhiteCustom } from "./PostProcessing/White/WhiteCustom";
import { HueSlideCustom } from "./PostProcessing/HueSlide/HueSlideCustom";
import { useSystemStore } from "~/store/scene1/system_store";
import { WhiteSlideCustom } from "./PostProcessing/WhiteSlide/WhiteSlideCustom";
import { KernelSize } from "postprocessing";

export function PreCompile() {
  const resultRef = useRef<any>(null);

  const setIsCompiledScene1 = useGlobalStore(
    (state: any) => state.setIsCompiledScene1,
  );

  const { gl, scene, camera } = useThree();

  useEffect(() => {
    resultRef.current = runCompile();

    if (resultRef.current) {
      setIsCompiledScene1(true);
    }
  }, [gl, scene, camera]);

  async function runCompile() {
    await gl.compileAsync(scene, camera);
  }

  return null;
}

export function CanvasScene1() {
  const [dprMobile] = useState(0.05);
  const [dprDeskTop, setDprDeskTop] = useState<number>(2.0);

  const isMobile = useGlobalStore((state) => state.isMobile);
  const isPreLoaded = useGlobalStore((state) => state.isPreLoaded);
  const isIntroEnded = useSystemStore((state: any) => state.isIntroEnd);

  useEffect(() => {
    setDprDeskTop(Math.min(window.devicePixelRatio, 2.0));
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
          position: [0, 0, 0],
        }}
        dpr={isMobile ? dprMobile : dprDeskTop}
      >
        {isPreLoaded && (
          <>
            <Experience />
            <PreCompile />
          </>
        )}

        {/* {isIntroEnded || (
          <EffectComposer>
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
            <HueSlideCustom />
            <WhiteSlideCustom />
          </EffectComposer>
        )} */}
      </Canvas>
    </>
  );
}
