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

export default function Experience() {
  return (
    <>
      <color args={["#201919"]} attach="background" />
      <OrbitControls makeDefault />
      <Camera />
      <Physics>
        <EnvironmentLights />
        <Player />
        <Floors />
      </Physics>
      <Tower />
      <Earth />
    </>
  );
}
