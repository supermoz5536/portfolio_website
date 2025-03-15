import Experience from "./Experience";
import { StoneTabletView } from "../scene_2/Components/view/StoneTabletView";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, useKeyboardControls } from "@react-three/drei";
import { MovementPad } from "./Components/view/Interface";
import { useGlobalStore } from "~/store/global/global_store";
import { useEffect, useState } from "react";

const EntryPointThree = () => {
  const isMobile = useGlobalStore((state) => state.isMobile);
  // const [isMac, setIsMac] = useState<boolean>();

  // useEffect(() => {
  //   const detectedOS = navigator.platform.includes("Mac");
  //   setIsMac(detectedOS);
  // }, []);

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
          frameloop="never"
          style={{
            minHeight: "100vh",
            height: "100%",
            width: "100%",
            zIndex: 0,
          }}
          shadows
          gl={{
            localClippingEnabled: true,
            alpha: true,
            // powerPreference: "high-performance",
          }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 4000,
            position: [0, 0, 100],
          }}
          dpr={isMobile ? [0.01, 0.01] : [1.5, 1.5]}
        >
          <Experience />
        </Canvas>
        <MovementPad />
        <StoneTabletView />
      </KeyboardControls>
    </>
  );
};

export default EntryPointThree;
