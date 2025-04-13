import Experience from "./Experience";
import { StoneTabletView } from "../scene_2/Components/view/StoneTabletView";
import { Canvas, useThree } from "@react-three/fiber";
import { KeyboardControls, useKeyboardControls } from "@react-three/drei";
import { MovementPad } from "./Components/view/Interface";
import { useEffect, useRef, useState } from "react";
import { useGlobalStore } from "~/store/global/global_store";
import { PreCompile } from "~/service/setup/preCompile";

const EntryPointThree = () => {
  const initPlayerCoord = { x: 0, y: 4, z: 8 };

  const [dpr, setDpr] = useState(2.0);

  const isMobile = useGlobalStore((state) => state.isMobile);
  const isPreLoaded = useGlobalStore((state) => state.isPreLoaded);

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio, 2.0));
  }, []);

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
          }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 3200,
            position: [
              initPlayerCoord.x,
              initPlayerCoord.y + 5,
              initPlayerCoord.z + 15,
            ],
          }}
          dpr={isMobile ? 0.6 : dpr}
        >
          {isPreLoaded && (
            <>
              <Experience />
              <PreCompile sceneNumber={2} />
            </>
          )}
        </Canvas>
        <MovementPad />
        <StoneTabletView />
      </KeyboardControls>
    </>
  );
};

export default EntryPointThree;
