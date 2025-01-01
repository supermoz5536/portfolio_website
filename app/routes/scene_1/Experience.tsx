import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Lights from "./Lights.js";
import { Player } from "./Player.js";
import { Stage } from "./Stage.js";

export default function Experience() {
  return (
    <>
      <color args={["#bdedfc"]} attach="background" />
      {/* <axesHelper position={[0, 0.05, 0]} scale={1000} /> */}
      <gridHelper
        position={[0, 0, 0]}
        args={[1000, 250, "#cccccc", "#cccccc"]} // 1 grid = 4 unit
      />
      <OrbitControls makeDefault />
      <Physics>
        <Lights />
        <Player />
        <Stage />
      </Physics>
    </>
  );
}
