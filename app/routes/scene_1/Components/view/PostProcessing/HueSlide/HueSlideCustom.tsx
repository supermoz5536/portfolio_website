import { useEffect, useRef } from "react";
import { HueSlideEffect } from "./HueSlideEffect";
import { useFrame } from "@react-three/fiber";
import { useSystemStore } from "~/store/scene1/system_store";
import { useGlobalStore } from "~/store/global/global_store";
import { gsap } from "gsap/dist/gsap";
import * as THREE from "three";

let isFirstTry = true;
let isFirstTryDelta = true;

export function HueSlideCustom() {
  const startTimeRef = useRef<number>(0);
  const hueSlideEffectRef = useRef(new HueSlideEffect());
  const currentSpeedRef = useRef<number>(1.0);
  const deltaAcumRef = useRef<number>(0);
  const acumCountRef = useRef<number>(0);
  const deltaRef = useRef<number>(0.03);

  /**
   * Control Speed
   */
  const beforeT1 = useRef(false);
  const afterT1 = useRef(false);
  const beforeT2 = useRef(false);
  const afterT2 = useRef(false);
  const beforeT3 = useRef(false);

  /**
   * Store State
   */
  const isSkiped = useSystemStore((state: any) => state.isSkiped);
  const isMobile = useGlobalStore((state: any) => state.isMobile);
  const isLoaded = useGlobalStore((state: any) => state.isLoaded);

  useEffect(() => {
    hueSlideEffectRef.current.uniforms.get("uBlurIntensity")!.value = // prettier-ignore
      isMobile ? 0.1 : 0.2;
  }, []);

  /**
   *  Callback for isLoaded
   */

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
        beforeT1.current = false;
        afterT1.current = false;
        beforeT2.current = true;
      }, 10000);

      const timeout4 = setTimeout(() => {
        beforeT1.current = false;
        afterT1.current = false;
        beforeT2.current = false;
        afterT2.current = true;
      }, 12500);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        clearTimeout(timeout4);
      };
    }
  }, [isLoaded]);

  useFrame((state, delta) => {
    /* ----------------
        Before Loaded
     ---------------- */
    deltaAcumRef.current += delta;
    acumCountRef.current++;

    if (isFirstTryDelta && acumCountRef.current > 10) {
      isFirstTryDelta = false;
      deltaRef.current = deltaAcumRef.current / acumCountRef.current;
    }

    /* ----------------
        After Loaded
     ---------------- */
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
       *
       *
       * setSpeedRatio を経由して uSpeedRatio を更新しているが
       * isSkiped == true の切り替え時に関しては
       * 「スキップ関連の状態変更」と「グラデーション速度」が依存関係を持つことで
       * グラデーション速度が異常上昇する不具合が生じてしまう。
       * 対策：条件分岐して独立性を保持。
       */

      if (!isSkiped) {
        if (beforeT1.current) setSpeedRatio(delta, 0.775);
        if (afterT1.current) setSpeedRatio(delta, 0.775);
        if (beforeT2.current) setSpeedRatio(delta, 0.785);
        if (afterT2.current) {
          isMobile // 変動の程度を調整 (ベース値の uTime の値が尺の後半で増加してるため)
            ? setSpeedRatio(delta, 0.835)
            : setSpeedRatio(delta, 0.9375);
        }
      }

      /**
       * Conditional Flag
       */

      if (isSkiped == false) {
        hueSlideEffectRef.current.uniforms.get("uSkippedTime")!.value = elapsedTime - startTimeRef.current; // prettier-ignore
        hueSlideEffectRef.current.uniforms.get("uSkipFactor")!.value = 1.0; // prettier-ignore
      }
    }
  });

  /* -------------
       Function
    ------------- */

  function setSpeedRatio(delta: number, targetRatio: number) {
    currentSpeedRef.current = THREE.MathUtils.lerp(
      currentSpeedRef.current,
      targetRatio,
      isMobile // モバイル端末でのスクロール時に delta が乱れるため補正
        ? deltaRef.current * 0.3
        : delta * 0.3,
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
