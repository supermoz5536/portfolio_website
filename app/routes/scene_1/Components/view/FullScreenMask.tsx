import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FullScreenMaskMaterial } from "./Materials/FullScreenMaskMaterial";
import { useSystemStore } from "~/store/scene1/system_store";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap/dist/gsap";

const fullScreenGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);

let isFirstTry = true;
export function FullScreenMask() {
  const materialRef = useRef<any>(FullScreenMaskMaterial());
  const animationRatioRef = useRef({ opacity: 1.0 });

  const isIntroEnded = useSystemStore((state: any) => state.isIntroEnd);

  useEffect(() => {
    // if (isFirstTry) {
    if (isFirstTry && isIntroEnded) {
      isFirstTry = false;
      gsap.to(animationRatioRef.current, {
        duration: 1,
        opacity: 0,
        ease: "sine.out",
        delay: 2,
        onUpdate: () => {
          materialRef.current.uniforms.uOpacity.value =
            animationRatioRef.current.opacity;
        },
      });
    }
  }, [isIntroEnded]);

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
