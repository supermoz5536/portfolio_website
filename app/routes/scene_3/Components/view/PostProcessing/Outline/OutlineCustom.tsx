import { useSystemStore } from "~/store/scene3/system_store";
import { OutLineEffect } from "./OutlineEffect";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useGlobalStore } from "~/store/global/global_store";
import { Vector2 } from "three";

export function OutLineCustom() {
  const { size } = useThree();
  const isMobile = useGlobalStore((state) => state.isMobile);
  const scrollProgress = useSystemStore((state) => state.scrollProgressTopAndTop); // prettier-ignore
  const sizeX = size.width * (isMobile ? 1.0 : 0.75);
  const sizeY = size.height * (isMobile ? 1.0 : 0.75);

  const tempVec2Ref = useRef(new Vector2());
  tempVec2Ref.current.x = 1 / sizeX;
  tempVec2Ref.current.y = 1 / sizeY;

  const OutlineEffectRef = useRef(
    new OutLineEffect({
      x: 1 / sizeX,
      y: 1 / sizeY,
      scrollProgress: scrollProgress,
    }),
  );

  useEffect(() => {
    tempVec2Ref.current.x = 1 / sizeX;
    tempVec2Ref.current.y = 1 / sizeY;

    OutlineEffectRef.current.uniforms.get("texelSize")!.value =
      tempVec2Ref.current;

    OutlineEffectRef.current.uniforms.get("scrollProgress")!.value =
      scrollProgress;
  }, [sizeX, sizeY, scrollProgress]);

  return (
    <>
      <primitive object={OutlineEffectRef.current} />
    </>
  );
}
