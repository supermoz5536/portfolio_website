/// デスクトップにおいて、
/// コンテンツにZoomIn時にOrbitControlをOFFにしないと
/// 背景が暗くなる不具合が発生する

import { Floors } from "./Components/view/Floor.js";
import { EnvironmentLights } from "./Components/view/Lights.js";
import { Earth } from "./Components/view/Earth.js";
import { Tower } from "./Components/view/Tower.js";
import { Camera } from "./Components/view/Camera.js";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useSystemStore } from "~/store/scene3/system_store.js";
import { useGlobalStore } from "~/store/global/global_store.js";

export default function Experience() {
  const startRenderRate = 0.0;

  const animationFrameIdRef = useRef<any>();

  const [isRender, setIsRender] = useState(true);

  const { gl, advance } = useThree();

  const isMobile = useGlobalStore((state) => state.isMobile);
  const scrollProgressTopAndBottom = useSystemStore((state) => state.scrollProgressTopAndBottom); // prettier-ignore

  useEffect(() => {
    /**
     * Control Render for CPU Performance
     */

    if (scrollProgressTopAndBottom <= startRenderRate) {
      setIsRender(false);
      renderFinish();
    } else {
      if (!isRender) {
        setIsRender(true);
        renderStart();
      }
    }

    /**
     * Control Resolution for GPU Performance
     */

    if (scrollProgressTopAndBottom <= startRenderRate) {
      gl.setPixelRatio(0.001);
    } else {
      if (isMobile) gl.setPixelRatio(0.65);
      if (!isMobile) gl.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    }
  }, [scrollProgressTopAndBottom]);

  function renderStart() {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
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
    }
  }

  return (
    <>
      <color args={["#201919"]} attach="background" />
      <Camera />
      <EnvironmentLights />
      <Floors />
      <Earth />
      {isMobile || (
        <>
          <Tower />
        </>
      )}
    </>
  );
}
