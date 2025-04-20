import { useSystemStore } from "~/store/scene1/system_store";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { WABEffect } from "./WABEffect";
import { useFrame } from "@react-three/fiber";

export function WABCustom() {
  const lerpScrollRatioRef = useRef(0);
  const wabEffectRef = useRef(new WABEffect());

  const scrollProgressTopAndBottom = useSystemStore((state) => state.scrollProgressTopAndBottom); // prettier-ignore

  useFrame((state, delta) => {
    // Culculate lerp
    lerpScrollRatioRef.current = THREE.MathUtils.damp(
      lerpScrollRatioRef.current,
      scrollProgressTopAndBottom,
      1.25,
      delta,
    );

    wabEffectRef.current.uniforms.get("uScrollRatio")!.value =
      lerpScrollRatioRef.current;
  });

  return (
    <>
      <primitive object={wabEffectRef.current} />
    </>
  );
}
