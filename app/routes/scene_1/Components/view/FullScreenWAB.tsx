import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FullScreenWABMaterial } from "./Materials/FullScreenWABMaterial";
import { useSystemStore } from "~/store/scene1/system_store";
import { useFrame } from "@react-three/fiber";

const fullScreenGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);

/// WAB: White And Black
export function FullScreenWAB() {
  const materialRef = useRef<any>(FullScreenWABMaterial());
  const scrollProgressTopAndBottom = useSystemStore((state) => state.scrollProgressTopAndBottom); // prettier-ignore

  useFrame(() => {
    materialRef.current.uniforms.uScrollRatio = scrollProgressTopAndBottom;
  });

  return (
    <>
      <mesh geometry={fullScreenGeometry} material={materialRef.current} />
    </>
  );
}
