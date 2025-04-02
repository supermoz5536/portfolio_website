import { useEffect, useRef, useState } from "react";
import { useSystemStore } from "~/store/scene1/system_store";
import * as THREE from "three";
import { FullScreenClipMaterial } from "./Materials/FullScreenClipMaterial";
import { useFrame } from "@react-three/fiber";

const fullScreenGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);

export function FullScreenClip() {
  const fullScreenMaterialRef = useRef(FullScreenClipMaterial());

  const lerpScrollRatioRef = useRef(0);
  const prevScrollRatioRef = useRef(0);

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
    if (scrollProgressTopAndBottom == 1.0) {
      /**
       * Off Screen
       */
      lerpScrollRatioRef.current = 1.0;
      prevScrollRatioRef.current = 1.0;

      fullScreenMaterialRef.current.uniforms.uScrollRatio.value =
        lerpScrollRatioRef.current;

      fullScreenMaterialRef.current.uniforms.uAngle.value =
        lerpScrollRatioRef.current * Math.PI * 2;
    } else {
      /**
       * On Screen
       */
      // Culculate lerp
      lerpScrollRatioRef.current = THREE.MathUtils.lerp(
        prevScrollRatioRef.current,
        scrollProgressTopAndBottom,
        0.015 * delta,
      );

      // Save result for next lerp
      prevScrollRatioRef.current = lerpScrollRatioRef.current;

      // Send uniform
      fullScreenMaterialRef.current.uniforms.uScrollRatio.value =
        lerpScrollRatioRef.current;

      fullScreenMaterialRef.current.uniforms.uAngle.value =
        lerpScrollRatioRef.current * Math.PI * 2;
    }
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
