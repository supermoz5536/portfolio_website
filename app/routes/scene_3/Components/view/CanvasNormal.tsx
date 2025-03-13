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
import { useGlobalStore } from "~/store/global/global_store";

export function CanvasNormal() {
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

        {/* EffectComposer単体で曇り不具合が発生する */}
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
        </EffectComposer>
      </Canvas>
    </>
  );
}
