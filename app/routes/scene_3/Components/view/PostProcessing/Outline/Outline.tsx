import { useSystemStore } from "~/store/scene3/system_store";
import { OutLineEffect } from "./OutlineEffect";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useGlobalStore } from "~/store/global/global_store";

export function OutLineCustom() {
  const { size } = useThree();
  const isMobile = useGlobalStore((state) => state.isMobile);
  const scrollProgress = useSystemStore((state) => state.scrollProgressTopAndTop); // prettier-ignore

  const OutlineEffect = new OutLineEffect({
    x: size.width * (isMobile ? 1.0 : 0.75),
    y: size.height * (isMobile ? 1.0 : 0.75),
    scrollProgress: scrollProgress,
  });

  return (
    <>
      <primitive object={OutlineEffect} />
    </>
  );
}
