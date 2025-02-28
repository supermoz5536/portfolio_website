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
import * as THREE from "three";

export function CanvasOutline() {
  const boxRef = useRef<THREE.Mesh>(null);
  const [mesh, setMesh] = useState<THREE.Mesh | null>(null);

  useEffect(() => {
    if (boxRef.current) {
      // ここでレイヤーを有効にしてもOK
      boxRef.current.layers.enable(0);
      // ステートにMeshをセットし、再レンダリングをトリガー
      setMesh(boxRef.current);
    }
  }, [boxRef.current]);

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
          toneMapping: THREE.NoToneMapping,
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 4000,
          position: [0, 0, 100],
        }}
      >
        <Experience />
        <mesh
          ref={boxRef}
          geometry={new THREE.BoxGeometry(25, 25, 25)}
          material={
            new THREE.MeshStandardMaterial({
              color: "red",
            })
          }
        />
        {mesh && (
          <>
            <EffectComposer>
              <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
              <Outline
                selection={[mesh]}
                selectionLayer={0}
                edgeStrength={10}
                visibleEdgeColor={0xffffff}
                hiddenEdgeColor={0x00ffff}
              />
              <Bloom luminanceThreshold={1.0} mipmapBlur intensity={5.5} />
            </EffectComposer>
          </>
        )}
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
