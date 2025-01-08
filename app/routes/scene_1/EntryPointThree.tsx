import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Experience from "./Experience";
import { KeyboardControls, useKeyboardControls } from "@react-three/drei";

const EntryPointThree = () => {
  return (
    <>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "KeyW"] },
          { name: "backward", keys: ["ArrowDown", "KeyS"] },
          { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
          { name: "rightward", keys: ["ArrowRight", "KeyD"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <Canvas
          style={{
            minHeight: "100vh",
            height: "100%",
            width: "100%",
            // pointerEvents: "none",
          }}
          shadows
          // Canvas の呼び出し時に
          // PerspectiveCamera が設定可能
          camera={{
            // Floor[0]のShowCaseのアップ
            // fov: 45,
            // near: 0.1,
            // far: 4000,
            // position: [0, 5, 5.25],

            fov: 45,
            near: 0.1,
            far: 4000,
            position: [10.5, 20, 30],

            // fov: 45,
            // near: 0.1,
            // far: 4000,
            // position: [2.5, 4, 6],
          }}
        >
          <Experience />
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default EntryPointThree;
