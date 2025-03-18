import Experience from "./Experience";
import { StoneTabletView } from "../../scene_2/Components/view/StoneTabletView";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, useKeyboardControls } from "@react-three/drei";
import { MovementPad } from "./Components/view/Interface";

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
            zIndex: 0,
          }}
          shadows
          gl={{ localClippingEnabled: true, alpha: true }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 4000,
            position: [0, 0, 100],
          }}
        >
          <Experience />
        </Canvas>
        {/* <MovementPad /> */}
        {/* <StoneTabletView /> */}
      </KeyboardControls>
    </>
  );
};

export default EntryPointThree;
