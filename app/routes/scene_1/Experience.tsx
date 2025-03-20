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
import { useSystemStore } from "~/store/scene1/system_store.js";
import { useGlobalStore } from "~/store/global/global_store.js";

export default function Experience() {
  const endRenderRate = 1.0;

  const animationFrameIdRef = useRef<any>();

  const { gl, advance } = useThree();
  const isMobile = useGlobalStore((state) => state.isMobile);
  const scrollProgressTopAndBottom = useSystemStore((state) => state.scrollProgressTopAndBottom); // prettier-ignore

  const [isRender, setIsRender] = useState(false);

  // useEffect(() => {
  //   console.log(scrollProgressTopAndBottom);
  // }, [scrollProgressTopAndBottom]);

  useEffect(() => {
    /**
     * Control Render for CPU Performance
     */

    if (scrollProgressTopAndBottom >= endRenderRate) {
      setIsRender(false);
      renderFinish();
    } else {
      if (!isRender) {
        console.log("1", scrollProgressTopAndBottom);
        setIsRender(true);
        renderStart();
      }
    }

    /**
     * Control Resolution for GPU Performance
     */

    if (scrollProgressTopAndBottom >= endRenderRate) {
      console.log("2", scrollProgressTopAndBottom);
      gl.setPixelRatio(0.001);
    } else {
      console.log("3", scrollProgressTopAndBottom);
      if (isMobile) gl.setPixelRatio(0.65);
      if (!isMobile) gl.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    }
  }, [scrollProgressTopAndBottom]);

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
      {isMobile || (
        <>
          <Tower />
        </>
      )}
    </>
  );
}
