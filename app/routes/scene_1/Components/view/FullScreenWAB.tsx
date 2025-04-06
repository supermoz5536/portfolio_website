import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FullScreenWABMaterial } from "./Materials/FullScreenWABMaterial";
import { useSystemStore } from "~/store/scene1/system_store";
import { useFrame, useThree } from "@react-three/fiber";

const fullScreenGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);

/// WAB: White And Black
export function FullScreenWAB() {
  const materialRef = useRef<any>(FullScreenWABMaterial());
  const renderTarget = useRef<any>(null);
  const lerpScrollRatioRef = useRef(0);

  const scrollProgressTopAndBottom = useSystemStore((state) => state.scrollProgressTopAndBottom); // prettier-ignore

  const { gl, camera, scene } = useThree();

  useEffect(() => {
    renderTarget.current = new THREE.RenderTarget(
      window.innerWidth,
      window.innerHeight,
      { generateMipmaps: false },
    );
  }, []);

  useFrame((state, delta) => {
    gl.setRenderTarget(renderTarget.current);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // Culculate lerp
    lerpScrollRatioRef.current = THREE.MathUtils.damp(
      lerpScrollRatioRef.current,
      scrollProgressTopAndBottom,
      1.25,
      delta,
    );

    materialRef.current.uniforms.uTexture.value = 
     renderTarget.current.texture; // prettier-ignore

    materialRef.current.uniforms.uScrollRatio.value =
      lerpScrollRatioRef.current;
  });

  return (
    <>
      <mesh
        geometry={fullScreenGeometry}
        material={materialRef.current}
        frustumCulled={false}
      />
    </>
  );
}
