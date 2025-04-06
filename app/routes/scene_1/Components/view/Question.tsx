import { useEffect, useRef, useState } from "react";
import { Object3D } from "three";
import { useGlobalStore } from "~/store/global/global_store";
import { useSystemStore } from "~/store/scene1/system_store";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function Question() {
  const modelRef = useRef<any>();
  const lerpScrollRatioRef = useRef(0);
  const prevScrollRatioRef = useRef(0);

  const [scene, setScene] = useState<Object3D>();
  const [modelSize, setModelSize] = useState(3.5);
  // const [modelPos, setModelPos] = useState(new THREE.Vector3(0, 15, 0));

  const assets = useGlobalStore((state: any) => state.assets);
  const scrollProgress = useSystemStore((state) => state.scrollProgressTopAndBottom); // prettier-ignore

  useEffect(() => {
    /**
     * Import Model
     */

    const questionScene = assets.gltf.question.scene.clone();

    questionScene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.renderOrder = -10;
      }
    });
    setScene(questionScene);
  }, [assets.gltf.question.scene]);

  useFrame((state, delta) => {
    if (modelRef.current) {
      /**
       * Get Lerped Scroll
       */

      // // Calc lerp
      // lerpScrollRatioRef.current = THREE.MathUtils.lerp(
      //   prevScrollRatioRef.current,
      //   scrollProgress,
      //   delta * 1.5,
      // );

      lerpScrollRatioRef.current = THREE.MathUtils.damp(
        lerpScrollRatioRef.current,
        scrollProgress,
        1.25,
        delta,
      );

      // Save result for next lerp
      prevScrollRatioRef.current = lerpScrollRatioRef.current;

      /**
       * Position
       */

      // scroll [0.0 <=> 1.0] => Position.y [35.0 <=> 17.5]
      const posMultiplier = 1.5;
      modelRef.current.position.y =
        35 - 17.5 * lerpScrollRatioRef.current * posMultiplier;

      /**
       * Rotation
       */

      modelRef.current.rotation.x += Math.PI * 0.21 * delta;
      modelRef.current.rotation.y += Math.PI * 0.14 * delta;
    }
  });

  return (
    <>
      {scene && <primitive ref={modelRef} object={scene} scale={modelSize} />}
    </>
  );
}
