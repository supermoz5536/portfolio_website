import { useEffect, useRef } from "react";
import { WhiteSlideEffect } from "./WhiteSlideEffect";
import { useFrame } from "@react-three/fiber";
import { useSystemStore } from "~/store/scene1/system_store";
import { useGlobalStore } from "~/store/global/global_store";

export function WhiteSlideCustom() {
  const whiteSlideEffectRef = useRef<any>(new WhiteSlideEffect());
  const loadedTimeRef = useRef();

  const isLoaded = useGlobalStore((state: any) => state.isLoaded);

  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;
    whiteSlideEffectRef.current.uniforms.get("uTime")!.value = elapsedTime; // prettier-ignore

    if (isLoaded == false && loadedTimeRef.current == null)
    whiteSlideEffectRef.current.uniforms.get("uLoadedTime")!.value = elapsedTime; // prettier-ignore
    whiteSlideEffectRef.current.uniforms.get("uLoadFactor")!.value = 1.0; // prettier-ignore
  });

  return (
    <>
      <primitive object={whiteSlideEffectRef.current} />
    </>
  );
}
