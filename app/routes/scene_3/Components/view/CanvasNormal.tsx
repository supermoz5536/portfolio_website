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
      </Canvas>
    </>
  );
}
