import { Canvas } from "@react-three/fiber";
import Experience from "../../Experience";
import {
  EffectComposer,
  // Bloom,
  // Outline,
  // HueSaturation,
  // ToneMapping,
  // Vignette,
  // Glitch,
  // Noise,
  // DepthOfField,
} from "@react-three/postprocessing";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ToneMappingMode, BlendFunction, GlitchMode } from "postprocessing";
import { Resizer, KernelSize } from "postprocessing";
import * as THREE from "three";
import { OutLineCustom } from "./PostProcessing/Outline/Outline";
import { useSystemStore } from "~/store/scene3/system_store";
import { useGlobalStore } from "~/store/global/global_store";

export function CanvasOutline() {
  const isMobile = useGlobalStore((state) => state.isMobile);
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
        dpr={isMobile ? 0.5 : 1.7}
      >
        <Experience flag="outline" />
        <EffectComposer>
          <OutLineCustom />
        </EffectComposer>
      </Canvas>
    </>
  );
}

{
  /* <Glitch
            delay={new THREE.Vector2(1.5, 3.5)}
            duration={new THREE.Vector2(0.1, 10.0)}
            strength={new THREE.Vector2(0.3, 1.0)}
            mode={GlitchMode.SPORADIC} // glitch mode
            active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
            ratio={0.85} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
          />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} />
          <Bloom luminanceThreshold={1.0} mipmapBlur intensity={0.5} />
          <DepthOfField
            focusDistance={0.025}
            focalLength={0.025}
            bokehScale={6}
          /> */
}
