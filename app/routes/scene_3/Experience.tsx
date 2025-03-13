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

type ExprienceProps = {
  flag: "outline" | "normal";
};

export default function Experience({ flag }: ExprienceProps) {
  let startRenderRate = 0;
  let endRenderRate = 0;

  const animationFrameIdRef = useRef<any>();

  const { gl, advance } = useThree();

  const isMobile = useGlobalStore((state) => state.isMobile);
  const scrollProgressTopAndTop = useSystemStore((state) => state.scrollProgressTopAndTop); // prettier-ignore

  const [isRender, setIsRender] = useState(false);

  useEffect(() => {
    /**
     * Control Render for CPU Performance
     */

    if (flag == "outline") {
      if (scrollProgressTopAndTop < 0) {
        setIsRender(false);
        renderFinish();
      } else if (scrollProgressTopAndTop > 0.55) {
        setIsRender(false);
        renderFinish();
      } else {
        if (!isRender) {
          setIsRender(true);
          renderStart();
        }
      }
    }

    if (flag == "normal") {
      if (scrollProgressTopAndTop > 0) {
        if (!isRender) {
          setIsRender(true);
          renderStart();
        }
      } else {
        setIsRender(false);
        renderFinish();
      }
    }

    /**
     * Control Resolution for GPU Performance
     */

    if (flag == "outline") {
      startRenderRate = 0.0;
      endRenderRate = 0.55;
    } else if (flag == "normal") {
      startRenderRate = 0.0;
      endRenderRate = 1.0;
    }

    if (scrollProgressTopAndTop < startRenderRate) {
      gl.setPixelRatio(0.001);
    } else if (scrollProgressTopAndTop > endRenderRate) {
      gl.setPixelRatio(0.001);
    } else {
      if (!isMobile) gl.setPixelRatio(1.7);
      if (isMobile && flag == "outline") gl.setPixelRatio(0.5);
      if (isMobile && flag == "normal") gl.setPixelRatio(0.8);
    }
  }, [scrollProgressTopAndTop]);

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
      {isMobile && <>{flag == "normal" && <Earth />}</>}
      {isMobile || (
        <>
          <Earth />
          {flag == "normal" && <Tower />}
        </>
      )}
    </>
  );
}
