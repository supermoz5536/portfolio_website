import { useLoader } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function StepModel() {
  const [scene, setScene] = useState();
  const [model, setModel] = useState<any>();

  /**
   * Models
   */
  const gltfLoader: any = new GLTFLoader();
  const dracoLoader: any = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");

  gltfLoader.setDRACOLoader(dracoLoader);

  //   const gltf = useLoader(GLTFLoader, "/asset/model/glTF/Duck.gltf");
  //   console.log("success", gltf);
  //   model = gltf.scene.children[0].children[0];
  //   console.log("success", model);

  useEffect(() => {
    // gltfLoader.load("/asset/model/glTF/Duck.gltf", (gltf: any) => {
    // gltfLoader.load("/asset/model/humbergar_test2.glb", (gltf: any) => {
    gltfLoader.load("/asset/model/floor.glb", (gltf: any) => {
      console.log("success", gltf);
      const importedModel = gltf.scene.children[0].children[0];
      // console.log("importedModel", importedModel);
      setScene(gltf.scene);
      setModel(importedModel);
    });
  }, []);

  useEffect(() => {
    // console.log("scene", scene);
  }, [scene]);

  useEffect(() => {
    // console.log("model", model);
    // if (model) {
    //   model.position.set(0, 0, 0);
    //   model.rotation.set(0, 0, 0);
    //   model.scale.set(0.1, 0.1, 0.1);
    // }
  }, [model]);

  return (
    <>
      {scene != null && (
        <>
          <RigidBody type="fixed" colliders="hull">
            <primitive
              object={scene}
              position={[0, -15.25, 0]}
              rotation={[0, 0, 0]}
              scale={22}
            />
          </RigidBody>
          {/* <primitive object={model} position={[0, 0, 0]} scale={10}></primitive> */}
        </>
      )}
    </>
  );
}
