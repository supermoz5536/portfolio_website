import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Experience from "./Experience";
import { KeyboardControls, useKeyboardControls } from "@react-three/drei";

export const ThreeSceneOld2 = () => {
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
            pointerEvents: "none",
          }}
          shadows
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [2.5, 4, 6],
          }}
        >
          <Experience />
        </Canvas>
      </KeyboardControls>
      ,
    </>
  );
};

export default ThreeSceneOld2;
