import { useEffect, useState } from "react";
import { Object3D } from "three";
import { useGlobalStore } from "~/store/global/global_store";

export function Question() {
  const [scene, setScene] = useState<Object3D>();

  const assets = useGlobalStore((state: any) => state.assets);

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

  return (
    <>
      {scene && <primitive object={scene} position={[0, 15, 0]} scale={3.5} />}
    </>
  );
}
