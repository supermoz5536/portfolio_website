import { useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DirectionalLightHelper } from "three";

export default function Lights() {
  const light: any = useRef();
  useHelper(light, DirectionalLightHelper, 4, "red");

  useFrame((state) => {
    if (light.current) {
      light.current.position.x = state.camera.position.x + 10;
      light.current.position.y = state.camera.position.y + 15;
      light.current.position.z = state.camera.position.z + 10;
      light.current.target.position.x = state.camera.position.x;
      light.current.target.position.y = state.camera.position.y;
      light.current.target.position.z = state.camera.position.z - 5;
      light.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <directionalLight
        ref={light}
        color={"#ffffff"}
        castShadow
        position={[3, 3, 1]}
        intensity={4.75}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-top={100}
        shadow-camera-right={100}
        shadow-camera-bottom={-100}
        shadow-camera-left={-100}
      />
      <ambientLight intensity={1.75} />
    </>
  );
}
