import { Canvas } from "@react-three/fiber";
import Experience from "../../Experience";

export function CanvasNormal() {
  return (
    <>
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
    </>
  );
}
