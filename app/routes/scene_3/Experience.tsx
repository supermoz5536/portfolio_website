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
import { useEffect } from "react";

type ExperienceType = {
  outlineRef: React.MutableRefObject<any>;
};

export default function Experience({ outlineRef }: ExperienceType) {
  useEffect(() => {
    if (outlineRef && outlineRef.current) {
      // Outline エフェクトで抽出するレイヤー (例: 10) に設定
      outlineRef.current.layers.set(10);
      console.log(outlineRef);
    }
  }, []);

  return (
    <>
      <color args={["#201919"]} attach="background" />
      <OrbitControls makeDefault />
      <Camera />
      <Physics>
        <EnvironmentLights />
        <Floors />
      </Physics>
      <Tower />
      <Earth />
      <mesh
        ref={outlineRef}
        geometry={new THREE.BoxGeometry(50, 50, 50)}
        material={new THREE.MeshStandardMaterial({ color: "red" })}
      />
    </>
  );
}
