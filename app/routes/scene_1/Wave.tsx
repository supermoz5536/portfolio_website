import * as THREE from "three";
import waveVertexShader from "./shaders/wave/vertex.glsl";
import waveFragmentShader from "./shaders/wave/fragment.glsl";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getGui } from "./lil-gui";

type waveProps = {
  flag: number;
};

export function Wave({ flag }: waveProps) {
  const wavesRef: any = useRef();

  // Debug
  const gui = getGui();
  const debugObj: any = {};

  if (flag == 0) {
    debugObj.uSurfaceColor = "#50ad54";
    debugObj.uDepthColor = "#009405";
  } else if (flag == 1) {
    debugObj.uSurfaceColor = "#5ad2e0";
    debugObj.uDepthColor = "#00c2c9";
  }

  useEffect(() => {
    if (wavesRef.current && gui) {
      const wavesGui = gui.addFolder("Waves");
      wavesGui.add(wavesRef.current.position, "y", 0, 3, 0.0001).name("PositionY"); // prettier-ignore

      wavesGui.add(wavesRef.current.material.uniforms.uBigWavesElevation,"value", 0, 10, 0.001).name("wavesElevation"); // prettier-ignore
      wavesGui.add(wavesRef.current.material.uniforms.uBigWavesFrequency.value,"x", 0, 2, 0.001).name("wavesFrequency.x"); // prettier-ignore
      wavesGui.add(wavesRef.current.material.uniforms.uBigWavesFrequency.value,"y", 0, 2, 0.001).name("wavesFrequency.z"); // prettier-ignore
      wavesGui.add(wavesRef.current.material.uniforms.uBigWavesSpeed.value,"x", 0, 2, 0.001).name("wavesSpeed.x"); // prettier-ignore
      wavesGui.add(wavesRef.current.material.uniforms.uBigWavesSpeed.value, "y", 0, 2, 0.001).name("wavesSpeed.z"); // prettier-ignore

      wavesGui.add(wavesRef.current.material.uniforms.uSmallWavesElevation, "value", 0, 2, 0.001).name("uSmallWavesElevation"); // prettier-ignore
      wavesGui.add(wavesRef.current.material.uniforms.uSmallWavesFrequency, "value", 0, 2, 0.001).name("uSmallWavesFrequency"); // prettier-ignore
      wavesGui.add(wavesRef.current.material.uniforms.uSmallWavesSpeed, "value", 0, 2, 0.001).name("uSmallWavesSpeed"); // prettier-ignore
      wavesGui.add(wavesRef.current.material.uniforms.uSmallWavesIteration, "value", 0, 5, 0.001).name("uSmallWavesIteration"); // prettier-ignore

      wavesGui
        .addColor(debugObj, "uSurfaceColor")
        .onChange((value: any) => {
          wavesRef.current.material.uniforms.uSurfaceColor.value.set(value);
        })
        .name("uSurfaceColor");

      wavesGui
        .addColor(debugObj, "uDepthColor")
        .onChange((value: any) => {
          wavesRef.current.material.uniforms.uDepthColor.value.set(value);
        })
        .name("uDepthColor");

      wavesGui.add(wavesRef.current.material.uniforms.uColorOffset,"value", 0, 10, 0.001).name("uColorOffset") // prettier-ignore
      wavesGui.add(wavesRef.current.material.uniforms.uColorMultiplier,"value", 0, 20, 0.001).name("uColorMultiplier"); // prettier-ignore
    }
  }, []);

  useFrame((state, delta) => {
    const elapseTime = state.clock.elapsedTime;
    if (wavesRef.current) {
      wavesRef.current.material.uniforms.uElapseTime.value = elapseTime;
    }
  });

  return (
    <>
      <mesh
        ref={wavesRef}
        geometry={new THREE.PlaneGeometry(1, 1, 256, 256)}
        material={
          new THREE.ShaderMaterial({
            vertexShader: waveVertexShader,
            fragmentShader: waveFragmentShader,
            uniforms: {
              uElapseTime: { value: 0.0 },

              // For Vertex
              uBigWavesElevation: { value: 0.0 },
              uBigWavesFrequency: { value: new THREE.Vector2(0.0, 0.0) },
              uBigWavesSpeed: { value: new THREE.Vector2(0.0, 0.0) },

              uSmallWavesElevation: { value: 0.217 },
              uSmallWavesFrequency: { value: 1.833 },
              uSmallWavesSpeed: { value: 0.254 },
              uSmallWavesIteration: { value: 2.0 },

              // For Fragment
              uSurfaceColor: { value: new THREE.Color(debugObj.uSurfaceColor) },
              uDepthColor: { value: new THREE.Color(debugObj.uDepthColor) },
              uColorOffset: { value: 0.289 },
              uColorMultiplier: { value: 15.0 },
            },
          })
        }
        // material={testMaterial}
        position={[0, flag == 0 ? 0.975 : 3.49, 0]}
        rotation={[flag == 0 ? -Math.PI / 2 : Math.PI / 2, 0, 0]}
        scale={[2.7, 2.7, 1]}
        castShadow
        receiveShadow
      />
    </>
  );
}
