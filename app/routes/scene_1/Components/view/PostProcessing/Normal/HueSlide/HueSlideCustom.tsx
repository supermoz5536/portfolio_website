import { useEffect, useRef } from "react";
import { HueSlideEffect } from "./HueSlideEffect";
import { useFrame } from "@react-three/fiber";
import { useSystemStore } from "~/store/scene1/system_store";

export function HueSlideCustom() {
  const hueSlideEffectRef = useRef(new HueSlideEffect());
  const isSkiped = useSystemStore((state: any) => state.isSkiped);

  useEffect(() => {
    hueSlideEffectRef.current.uniforms.get("uIsSkiped")!.value = isSkiped; // prettier-ignore
  }, [isSkiped]);

  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;
    hueSlideEffectRef.current.uniforms.get("uTime")!.value = elapsedTime; // prettier-ignore
  });

  return (
    <>
      <primitive object={hueSlideEffectRef.current} />
    </>
  );
}
