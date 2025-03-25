import { useEffect, useRef } from "react";
import { HueSlideEffect } from "./HueSlideEffect";
import { useFrame } from "@react-three/fiber";
import { useSystemStore } from "~/store/scene1/system_store";
import { useGlobalStore } from "~/store/global/global_store";
import { gsap } from "gsap/dist/gsap";
import * as THREE from "three";

let isFirstTry = true;

export function HueSlideCustom() {
  const startTimeRef = useRef<number>(0);
  const hueSlideEffectRef = useRef(new HueSlideEffect());
  const skippedTimeRef = useRef();
  const currentSpeedRef = useRef<number>(1.0);
  const beforeT1 = useRef(false);
  const afterT1 = useRef(false);
  const beforeT2 = useRef(false);
  const afterT2 = useRef(false);
  const beforeT3 = useRef(false);

  const isSkiped = useSystemStore((state: any) => state.isSkiped);
  const isMobile = useGlobalStore((state: any) => state.isMobile);
  const isLoaded = useGlobalStore((state: any) => state.isLoaded);

  useEffect(() => {
    hueSlideEffectRef.current.uniforms.get("uBlurIntensity")!.value = // prettier-ignore
      isMobile ? 0.1 : 0.2;
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const timeout1 = setTimeout(() => {
        beforeT1.current = true;
      }, 3000);

      const timeout2 = setTimeout(() => {
        beforeT1.current = false;
        afterT1.current = true;
      }, 6500);

      const timeout3 = setTimeout(() => {
        afterT1.current = false;
        beforeT2.current = true;
      }, 10000);

      const timeout4 = setTimeout(() => {
        beforeT2.current = false;
        afterT2.current = true;
      }, 12500);

      const timeout5 = setTimeout(() => {
        afterT2.current = false;
        beforeT3.current = false;
      }, 14000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        clearTimeout(timeout4);
        clearTimeout(timeout5);
      };
    }
  }, [isLoaded]);

  useFrame((state, delta) => {
    if (isLoaded) {
      if (isFirstTry) {
        isFirstTry = false;
        startTimeRef.current = state.clock.elapsedTime;
      }

      /**
       * Time
       */

      const elapsedTime = state.clock.elapsedTime;
      hueSlideEffectRef.current.uniforms.get("uTime")!.value = elapsedTime - startTimeRef.current; // prettier-ignore

      /**
       * Gradation's Speed - To avoid Yellow Color behind Texts.
       */

      if (beforeT1.current) setSpeedRatio(delta, 0.775);
      if (afterT1.current) setSpeedRatio(delta, 0.775);
      if (beforeT2.current) setSpeedRatio(delta, 0.785);
      if (afterT2.current) setSpeedRatio(delta, 0.9375);

      /**
       * Conditional Flag
       */

      if (isSkiped == false && skippedTimeRef.current == null) {
        hueSlideEffectRef.current.uniforms.get("uSkippedTime")!.value = elapsedTime - startTimeRef.current; // prettier-ignore
        hueSlideEffectRef.current.uniforms.get("uSkipFactor")!.value = 1.0; // prettier-ignore
      }
    }
  });

  function setSpeedRatio(delta: number, targetRatio: number) {
    currentSpeedRef.current = THREE.MathUtils.lerp(
      currentSpeedRef.current,
      targetRatio,
      delta * 0.3,
    );

    hueSlideEffectRef.current.uniforms.get("uSpeedRatio")!.value =
      currentSpeedRef.current;
  }

  return (
    <>
      <primitive object={hueSlideEffectRef.current} />
    </>
  );
}
