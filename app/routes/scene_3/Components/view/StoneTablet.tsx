import * as THREE from "three";
import { useEffect, useState } from "react";
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

    assets.gltf.stoneTablet.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    setScene(assets.gltf.stoneTablet.scene.clone());
  }, []);

  return (
    <>
      {scene && (
        <primitive
          object={scene}
          scale={1.75}
          position={[8.75, 1.75, -8.75]}
          rotation={[0, -Math.PI / 1.5, 0]}
        />
      )}
    </>
  );
}
