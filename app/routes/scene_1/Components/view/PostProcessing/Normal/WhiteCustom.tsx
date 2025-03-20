import { useSystemStore } from "~/store/scene1/system_store";

import { useEffect, useRef } from "react";
import { WhiteEffect } from "./WhiteEffect";

export function WhiteCustom() {
  const scrollProgressTopAndBottom = useSystemStore((state) => state.scrollProgressTopAndBottom); // prettier-ignore

  const normalEffectRef = useRef(new WhiteEffect());

  useEffect(() => {
    normalEffectRef.current.uniforms.get("scrollProgress")!.value =
      scrollProgressTopAndBottom;
  }, [scrollProgressTopAndBottom]);

  return (
    <>
      <primitive object={normalEffectRef.current} />
    </>
  );
}
