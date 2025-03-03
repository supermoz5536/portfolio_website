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

export function CanvasNormal() {
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
      >
        <Experience />
        <EffectComposer>
          <ToneMapping mode={ToneMappingMode.NEUTRAL} />
          {/* <NormalCustom /> */}
          <Bloom luminanceThreshold={1.0} mipmapBlur intensity={0.1} />
          <DepthOfField
            focusDistance={0.005}
            focalLength={0.025}
            bokehScale={6}
          />
        </EffectComposer>
      </Canvas>
    </>
  );
}
