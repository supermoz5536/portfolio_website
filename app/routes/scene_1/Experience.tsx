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
import { FullScreenClip } from "./Components/view/FullScreenClip.js";
import { FullScreenWAB } from "./Components/view/FullScreenWAB.js";
import { FullScreenMask } from "./Components/view/FullScreenMask.js";

export default function Experience() {
  const endRenderRate = 1.0;

  const animationFrameIdRef = useRef<any>();

  const [isRender, setIsRender] = useState(false);

  const { gl, advance } = useThree();

  const isMobile = useGlobalStore((state) => state.isMobile);

  const scrollProgressTopAndBottom = useSystemStore((state) => state.scrollProgressTopAndBottom); // prettier-ignore
  const isIntroEnd = useSystemStore((state) => state.isIntroEnd); // prettier-ignore
  const isAnimationEnd = useSystemStore((state) => state.isAnimationEnd); // prettier-ignore

  useEffect(() => {
    /**
     * Control Render for CPU Performance
     *
     * スキップ前で画面内　＝＞　no render
     * スキップ後で画面内　＝＞　render
     * スキップ後で画面外　＝＞　no render
     */

    if (!isIntroEnd && scrollProgressTopAndBottom < endRenderRate) {
      if (!isRender) {
        setIsRender(true);
        renderStart();
      }

      //
    } else if (isIntroEnd && scrollProgressTopAndBottom < endRenderRate) {
      if (!isRender) {
        setIsRender(true);
        renderStart();
      }

      //
    } else if (isIntroEnd && scrollProgressTopAndBottom >= endRenderRate) {
      if (isRender) {
        setIsRender(false);
        renderFinish();
      }
    }

    /**
     * Control Resolution for GPU Performance
     *
     * スキップ前で画面内　＝＞　低解像度
     * スキップ後で画面内　＝＞　通常解像度
     * スキップ後で画面外　＝＞　低解像度
     */

    let targetDpr = null;

    if (!isIntroEnd && scrollProgressTopAndBottom < endRenderRate) {
      if (isMobile) targetDpr = 0.65;
      if (!isMobile) targetDpr = 1.5;

      //
    } else if (isIntroEnd && scrollProgressTopAndBottom < endRenderRate) {
      if (isMobile) targetDpr = 0.65;
      if (!isMobile) targetDpr = 1.5;

      //
    } else if (isIntroEnd && scrollProgressTopAndBottom >= endRenderRate) {
      if (isMobile) targetDpr = 0.001;
      if (!isMobile) targetDpr = 0.001;
    }

    if (targetDpr && gl.getPixelRatio() != targetDpr) {
      gl.setPixelRatio(targetDpr);
    }
  }, [scrollProgressTopAndBottom, isIntroEnd]);

  function renderStart() {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    const loop = (t: number) => {
      advance(t / 1000);
      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    animationFrameIdRef.current = requestAnimationFrame(loop); // 初回も rAF に任せる
  }

  function renderFinish() {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
  }

  return (
    <>
      <color args={["#201919"]} attach="background" />
      <Camera />
      <EnvironmentLights />
      <Floors />
      <Earth />
      <Tower />
      <FullScreenClip />
      {/* {isMobile && <FullScreenWAB />} */}
      {isAnimationEnd || <FullScreenMask />}
    </>
  );
}
