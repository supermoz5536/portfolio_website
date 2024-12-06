import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Level from "./Level.js";

export default function Experience() {
  return (
    <>
      <color args={["#bdedfc"]} attach="background" />
      <OrbitControls makeDefault />
      <Physics>
        <Level count={10} seed={10} />
      </Physics>
    </>
  );
}
