import { useLoader } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { Object3D } from "three";

export function StepModel() {
  const [scene, setScene] = useState<Object3D>();
  let boundingBox = new THREE.Box3();

  /**
   * Models
   */
  const gltfLoader: any = new GLTFLoader();
  const dracoLoader: any = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  gltfLoader.setDRACOLoader(dracoLoader);

  useEffect(() => {
    gltfLoader.load("/asset/model/floor.glb", (gltf: any) => {
      console.log("success", gltf);
      setScene(gltf.scene);
    });
  }, []);

  useEffect(() => {
    // console.log("scene", scene);
    if (scene) {
      boundingBox.setFromObject(scene);
      scene.position.set(0, boundingBox.min.y - boundingBox.max.y, 0);
    }
  }, [scene]);

  return (
    <>
      {scene != null && (
        <>
          <RigidBody type="fixed" colliders="hull">
            <primitive
              object={scene}
              // position={[0, boundingBox.min.y - boundingBox.max.y, 0]}
              scale={22}
            />
          </RigidBody>
          {/* <primitive object={model} position={[0, 0, 0]} scale={10}></primitive> */}
        </>
      )}
    </>
  );
}

// ======================================================================
// const [model, setModel] = useState<any>();
// const importedModel = gltf.scene.children[0].children[0];
// setModel(importedModel);

// useEffect(() => {
//   console.log("model", model);
//   if (model) {
//     model.position.set(0, 0, 0);
//     model.rotation.set(0, 0, 0);
//     model.scale.set(0.1, 0.1, 0.1);
//   }
// }, [model]);
