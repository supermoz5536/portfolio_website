/// デスクトップにおいて、
/// コンテンツにZoomIn時にOrbitControlをOFFにしないと
/// 背景が暗くなる不具合が発生する

import { OrbitControls, PointerLockControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Player } from "./Components/view/Player.js";
import { Floors } from "./Components/view/Floor.js";
import { EnvironmentLights } from "./Components/view/Lights.js";
import { Earth } from "./Components/view/Earth.js";
import { Tower } from "./Components/view/Tower.js";
import { Camera } from "./Components/view/Camera.js";
import * as THREE from "three";
import { useEffect, useState } from "react";

export default function Experience() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Device Setup
     */

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
  return (
    <>
      <color args={["#201919"]} attach="background" />
      <Camera />
      <EnvironmentLights />
      <Floors />
      {isMobile || (
        <>
          <Tower />
          <Earth />
        </>
      )}
    </>
  );
}
