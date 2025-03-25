import { useEffect, useState } from "react";
import { Object3D } from "three";
import { useGlobalStore } from "~/store/global/global_store";

export function Question() {
  const [scene, setScene] = useState<Object3D>();

  const assets = useGlobalStore((state: any) => state.assets);

  useEffect(() => {
    assets.gltf.question.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    setScene(assets.gltf.question.scene.clone());
  }, [assets.gltf.question.scene]);

  return (
    <>
      {scene && <primitive object={scene} position={[0, 3, 0]} scale={0.7} />}
    </>
  );
}
