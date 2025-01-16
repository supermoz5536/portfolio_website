import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Player } from "./components/Player.js";
import { Floors } from "./components/Floor.js";
import * as THREE from "three";
import { Waves } from "./components/Waves.js";
import { EnvironmentLights } from "./components/Lights.js";

export default function Experience() {
  return (
    <>
      {/* <color args={["#bdedfc"]} attach="background" /> */}
      <color args={["#201919"]} attach="background" />
      {/* <axesHelper position={[0, 0.05, 0]} scale={1000} /> */}
      {/* <gridHelper
        position={[0, 0, 0]}
        args={[1000, 250, "#cccccc", "#cccccc"]} // 1 grid = 4 unit
      /> */}
      <OrbitControls makeDefault />
      <Physics>
        <EnvironmentLights />
        <Player />
        <Floors />
      </Physics>
    </>
  );
}
