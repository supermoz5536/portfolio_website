import { Canvas } from "@react-three/fiber";
import Experience from "../../Experience";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { NormalCustom } from "./PostProcessing/Normal/Normal";
import * as THREE from "three";
import { useEffect, useState } from "react";
import { useSystemStore } from "~/store/scene3/system_store";

export function CanvasNormal() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const scrollProgressTest = useSystemStore((state) => state.scrollProgressTest); // prettier-ignore

  useEffect(() => {
    // Device Setup
    if (/iPhone|Android.+Mobile/.test(navigator.userAgent)) {
      setIsMobile(true);
    }
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
          toneMapping: THREE.NoToneMapping,
          localClippingEnabled: true,
          alpha: true,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 4000,
          position: [0, 0, 100],
        }}
        dpr={isMobile ? [0.75, 0.75] : [1, 1]}
      >
        <Experience flag="normal" />
        {scrollProgressTest > 0.3 && (
          <>
            <EffectComposer>
              <ToneMapping mode={ToneMappingMode.NEUTRAL} />
              <NormalCustom />
              <Bloom luminanceThreshold={1.0} mipmapBlur intensity={0.1} />
              {isMobile ? (
                <DepthOfField
                  focusDistance={0.005}
                  focalLength={0.025}
                  bokehScale={3}
                />
              ) : (
                <DepthOfField
                  focusDistance={0.005}
                  focalLength={0.025}
                  bokehScale={6}
                />
              )}
            </EffectComposer>
          </>
        )}
      </Canvas>
    </>
  );
}
