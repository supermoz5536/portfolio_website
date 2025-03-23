import { useEffect, useRef } from "react";
import { HueSlideEffect } from "./HueSlideEffect";
import { useFrame } from "@react-three/fiber";
import { useSystemStore } from "~/store/scene1/system_store";

export function HueSlideCustom() {
  const hueSlideEffectRef = useRef(new HueSlideEffect());
  const skippedTimeRef = useRef();

  const isSkiped = useSystemStore((state: any) => state.isSkiped);

  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;
    hueSlideEffectRef.current.uniforms.get("uTime")!.value = elapsedTime; // prettier-ignore

    if (isSkiped == false && skippedTimeRef.current == null)
    hueSlideEffectRef.current.uniforms.get("uSkippedTime")!.value = elapsedTime; // prettier-ignore
    hueSlideEffectRef.current.uniforms.get("uSkipFactor")!.value = 1.0; // prettier-ignore
  });

  return (
    <>
      <primitive object={hueSlideEffectRef.current} />
    </>
  );
}
