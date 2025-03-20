import { useRef } from "react";
import { NormalEffect } from "./NormalEffect";

export function NormalCustom() {
  const normalEffectRef = useRef(new NormalEffect());

  return (
    <>
      <primitive object={normalEffectRef.current} />
    </>
  );
}
