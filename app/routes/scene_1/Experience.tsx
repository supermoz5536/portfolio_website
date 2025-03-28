/// デスクトップにおいて
/// コンテンツにZoomIn時にOrbitControlをOFFにしないと
/// 背景が暗くなる不具合が発生する

import { Floors } from "./Components/view/Floor.js";
import { EnvironmentLights } from "./Components/view/Lights.js";
import { Earth } from "./Components/view/Earth.js";
import { Tower } from "./Components/view/Tower.js";
import { Camera } from "./Components/view/Camera.js";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useSystemStore } from "~/store/scene1/system_store.js";
import { useGlobalStore } from "~/store/global/global_store.js";

type ExperienceProps = {
  setDprMobile: React.Dispatch<React.SetStateAction<number>>;
  setDprDeskTop: React.Dispatch<React.SetStateAction<number>>;
};

// let isIntroEnd = false;
export default function Experience({
  setDprMobile,
  setDprDeskTop,
}: ExperienceProps) {
  const endRenderRate = 1.0;

  const animationFrameIdRef = useRef<any>();

  const [isRender, setIsRender] = useState(true);

  const { advance } = useThree();

  const isMobile = useGlobalStore((state) => state.isMobile);
  const isPreLoaded = useGlobalStore((state) => state.isPreLoaded);

  const scrollProgressTopAndBottom = useSystemStore((state) => state.scrollProgressTopAndBottom); // prettier-ignore
  const isSkiped = useSystemStore((state) => state.isSkiped); // prettier-ignore
  const isIntroEnd = useSystemStore((state) => state.isIntroEnd); // prettier-ignore

  useEffect(() => {
    /**
     * Control Render for CPU Performance
     *
     * スキップ前で画面内　＝＞　no render
     * スキップ後で画面内　＝＞　render
     * スキップ後で画面外　＝＞　no render
     */

    if (!isIntroEnd && scrollProgressTopAndBottom < endRenderRate) {
      setIsRender(true);
      renderStart();

      //
    } else if (isIntroEnd && scrollProgressTopAndBottom < endRenderRate) {
      setIsRender(true);
      renderStart();

      //
    } else if (isIntroEnd && scrollProgressTopAndBottom >= endRenderRate) {
      setIsRender(false);
      renderFinish();
    }

    /**
     * Control Resolution for GPU Performance
     *
     * スキップ前で画面内　＝＞　低解像度
     * スキップ後で画面内　＝＞　通常解像度
     * スキップ後で画面外　＝＞　低解像度
     */

    if (!isIntroEnd && scrollProgressTopAndBottom < endRenderRate) {
      if (isMobile) setDprMobile(0.05);
      if (!isMobile) setDprDeskTop(Math.min(window.devicePixelRatio, 1.5));

      //
    } else if (isIntroEnd && scrollProgressTopAndBottom < endRenderRate) {
      if (isMobile) setDprMobile(0.65);
      if (!isMobile) setDprDeskTop(Math.min(window.devicePixelRatio, 2.0));

      //
    } else if (isIntroEnd && scrollProgressTopAndBottom >= endRenderRate) {
      if (isMobile) setDprMobile(0.001);
      if (!isMobile) setDprDeskTop(0.001);
    }
  }, [scrollProgressTopAndBottom, isIntroEnd]);

  function renderStart() {
    const timeSec = performance.now();
    const timeMs = timeSec / 1000;

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    loop(timeMs);

    function loop(t: number) {
      advance(t / 1000);
      animationFrameIdRef.current = requestAnimationFrame(loop);
    }
  }

  function renderFinish() {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
  }

  return (
    <>
      <color args={["#201919"]} attach="background" />
      <Camera />
      <EnvironmentLights />
      <Floors />
      <Earth />
      {isMobile || <Tower />}
    </>
  );
}
