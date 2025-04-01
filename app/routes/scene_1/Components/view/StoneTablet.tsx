import * as THREE from "three";
import { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Object3D } from "three";
import { useGlobalStore } from "~/store/global/global_store";

type StoneTabletProps = {
  position: THREE.Vector3;
  index: number;
};

export function StoneTablet({ position, index }: StoneTabletProps) {
  const [scene, setScene] = useState<Object3D>();
  const assets = useGlobalStore((state: any) => state.assets);

  useEffect(() => {
    /**
     * Importing Model
     */

    const stoneTabletScene = assets.gltf.stoneTablet.scene.clone();

    stoneTabletScene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.renderOrder = -10;
      }
    });
    setScene(stoneTabletScene);
  }, []);

  return (
    <>
      {scene && (
        <primitive
          object={scene}
          scale={8.75}
          position={[44.75, 1.75 + 7.5, -26.75]}
          rotation={[0, -Math.PI / 1.5, 0]}
        />
      )}
    </>
  );
}
