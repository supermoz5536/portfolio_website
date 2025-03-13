import { Canvas } from "@react-three/fiber";
import Experience from "../../Experience";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode, KernelSize } from "postprocessing";
import { NormalCustom } from "./PostProcessing/Normal/Normal";
import * as THREE from "three";
import { useEffect, useState } from "react";
import { useSystemStore } from "~/store/scene3/system_store";
import Stats from "three/examples/jsm/libs/stats.module.js";

export function CanvasNormal() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

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
          // toneMapping: THREE.NoToneMapping,
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
      >
        <Experience flag="normal" />

        <EffectComposer>
          <ToneMapping mode={ToneMappingMode.NEUTRAL} />
          <NormalCustom />
          {isMobile ? (
            <>
              <Bloom
                luminanceThreshold={1.0}
                intensity={0.1}
                kernelSize={KernelSize.MEDIUM}
                resolutionScale={0.3}
              />
              {/* DepthOfField：
               * Mobileで影ができるような不具合が出たらオフにする
               */}
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
        </EffectComposer>
      </Canvas>
    </>
  );
}
