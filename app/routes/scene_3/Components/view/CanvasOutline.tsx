import { Canvas } from "@react-three/fiber";
import Experience from "../../Experience";
import {
  EffectComposer,
  Bloom,
  Outline,
  HueSaturation,
  ToneMapping,
  Vignette,
  Glitch,
  Noise,
  DepthOfField,
} from "@react-three/postprocessing";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ToneMappingMode, BlendFunction, GlitchMode } from "postprocessing";
import { Resizer, KernelSize } from "postprocessing";
import * as THREE from "three";
import { OutLineCustom } from "./PostProcessing/Outline/Outline";

export function CanvasOutline() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Device Setup
     */

    if (/iPhone|Android.+Mobile/.test(navigator.userAgent)) {
      setIsMobile(true);
    }
  }, []);

  return (
    <>
      <Canvas
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
        dpr={isMobile ? [0.75, 0.75] : [1, 1]}
      >
        <Experience />
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
