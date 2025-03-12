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

type ExprienceProps = {
  flag: "outline" | "normal";
};

export default function Experience({ flag }: ExprienceProps) {
  let startRenderRate = 0;
  let endRenderRate = 0;

  const animationFrameIdRef = useRef<any>();

  const { gl, advance } = useThree();
  const scrollProgressTest = useSystemStore((state) => state.scrollProgressTest); // prettier-ignore

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isRender, setIsRender] = useState(false);

  useEffect(() => {
    // Device Setup
    if (/iPhone|Android.+Mobile/.test(navigator.userAgent)) {
      setIsMobile(true);
    }

    /**
     * Resize
     */

    // Callback
    const resizeCallback = () => {
      if (/iPhone|Android.+Mobile/.test(navigator.userAgent)) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Listener
    window.addEventListener("resize", resizeCallback);

    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);

  useEffect(() => {
    /**
     * Control Render for CPU Performance
     */

    if (flag == "outline") {
      if (scrollProgressTest < 0) {
        setIsRender(false);
        renderFinish();
      } else if (scrollProgressTest > 0.55) {
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
      if (scrollProgressTest > 0) {
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

    if (scrollProgressTest < startRenderRate) {
      gl.setPixelRatio(0.001);
    } else if (scrollProgressTest > endRenderRate) {
      gl.setPixelRatio(0.001);
    } else {
      if (!isMobile) gl.setPixelRatio(1.7);
      if (isMobile && flag == "outline") gl.setPixelRatio(0.8);
      if (isMobile && flag == "normal") gl.setPixelRatio(0.6);
    }
  }, [scrollProgressTest]);

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
      {isMobile || (
        <>
          <Tower />
        </>
      )}
      <Earth />
    </>
  );
}
