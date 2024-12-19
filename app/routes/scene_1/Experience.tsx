import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Level from "./Level.js";
import Lights from "./Lights.js";
import { Player } from "./Player.js";
import { Floor, Step } from "./Step.js";

export default function Experience() {
  return (
    <>
      <color args={["#bdedfc"]} attach="background" />
      <axesHelper scale={100} />
      <OrbitControls makeDefault />
      <Physics debug>
        <Level />
        <Lights />
        <Player />
        <Step />
      </Physics>
    </>
  );
}
