import { useEffect, useRef, useState } from "react";
import { useSystemStore } from "~/store/scene1/system_store";
import * as THREE from "three";
import { FullScreenClipMaterial } from "./Materials/FullScreenClipMaterial";
import { useFrame } from "@react-three/fiber";

const fullScreenGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);

export function FullScreenClip() {
  const fullScreenMaterialRef = useRef(FullScreenClipMaterial());

  const lerpScrollRatio1Ref = useRef(0);
  const lerpScrollRatio2Ref = useRef(0);

  const scrollProgressTopAndBottom = useSystemStore((state) => state.scrollProgressTopAndBottom); // prettier-ignore

  useEffect(() => {
    fullScreenMaterialRef.current.uniforms.uAspectRatio.value =
      window.innerWidth / window.innerHeight;

    // Callback
    const resizeCallback = () => {
      fullScreenMaterialRef.current.uniforms.uAspectRatio.value =
        window.innerWidth / window.innerHeight;
    };

    // Listener
    window.addEventListener("resize", resizeCallback);

    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);

  useFrame((state, delta) => {
    // Culculate lerp
    lerpScrollRatio1Ref.current = THREE.MathUtils.damp(
      lerpScrollRatio1Ref.current,
      scrollProgressTopAndBottom,
      1.0,
      delta,
    );

    lerpScrollRatio2Ref.current = THREE.MathUtils.damp(
      lerpScrollRatio2Ref.current,
      lerpScrollRatio1Ref.current,
      1.0,
      delta,
    );

    // Send uniform
    fullScreenMaterialRef.current.uniforms.uScrollRatio.value =
      lerpScrollRatio2Ref.current;

    fullScreenMaterialRef.current.uniforms.uAngle.value =
      lerpScrollRatio2Ref.current * Math.PI * 2;
  });

  return (
    <>
      <mesh
        renderOrder={-5}
        frustumCulled={false}
        geometry={fullScreenGeometry}
        material={fullScreenMaterialRef.current}
      />
    </>
  );
}
