import * as THREE from "three";
import waveVertexShader from "./shaders/wave/vertex.glsl";
import waveFragmentShader from "./shaders/wave/fragment.glsl";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getGui } from "./lil-gui";

export function Wave() {
  const wavesRef: any = useRef();
  const gui = getGui();

  useEffect(() => {
    if (wavesRef.current && gui) {
      const wavesGui = gui.addFolder("Waves");

      wavesGui
        .add(
          wavesRef.current.material.uniforms.uBigWavesElevation,
          "value",
          0,
          10,
          0.001,
        )
        .name("wavesElevation");

      wavesGui
        .add(
          wavesRef.current.material.uniforms.uBigWavesFrequency.value,
          "x",
          0,
          2,
          0.001,
        )
        .name("wavesFrequency.x");

      wavesGui
        .add(
          wavesRef.current.material.uniforms.uBigWavesFrequency.value,
          "y",
          0,
          2,
          0.001,
        )
        .name("wavesFrequency.z");
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
        geometry={new THREE.PlaneGeometry(15, 15, 128, 128)}
        material={
          new THREE.ShaderMaterial({
            vertexShader: waveVertexShader,
            fragmentShader: waveFragmentShader,
            uniforms: {
              uBigWavesElevation: { value: 2.8 },
              uBigWavesFrequency: { value: new THREE.Vector2(0.2, 0.4) },
              uElapseTime: { value: 0 },
            },
          })
        }
        // material={testMaterial}
        position={[0, 5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      />
    </>
  );
}
