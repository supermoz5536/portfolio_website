import { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Object3D } from "three";

/**
 * Loader
 */
const gltfLoader: any = new GLTFLoader();
const dracoLoader: any = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader);

export function Question() {
  const [scene, setScene] = useState<Object3D>();

  /* Initialize */
  useEffect(() => {
    /* Importing Each Model  */
    gltfLoader.load("/asset/model/question.glb", (gltf: any) => {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      setScene(gltf.scene);
    });
  }, []);

  return (
    <>
      {scene && <primitive object={scene} position={[0, 3, 0]} scale={0.7} />}
    </>
  );
}
