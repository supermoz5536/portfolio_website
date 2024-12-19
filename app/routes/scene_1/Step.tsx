import { Vector3, useLoader } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { Object3D } from "three";

type positionProps = {
  position: [number, number, number];
};

let boundingBox: THREE.Box3;

/**
 * Loader
 */
const gltfLoader: any = new GLTFLoader();
const dracoLoader: any = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Models
 */
export function Floor({ position }: positionProps) {
  const [scene, setScene] = useState<Object3D>();
  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
  const [adjustedPosition, setAdjustedPosition] =
    useState<[number, number, number]>();

  useEffect(() => {
    gltfLoader.load("/asset/model/floor.glb", (gltf: any) => {
      gltf.scene.scale.set(22, 22, 22);
      boundingBox = new THREE.Box3().setFromObject(gltf.scene);
      const positionY = boundingBox.min.y - boundingBox.max.y;
      setScene(gltf.scene);
      setAdjustedPosition([position[0], position[1] + positionY, position[2]]);
      setIsPositionReady(true);
    });
  }, []);

  return (
    <>
      {scene != null && isPositionReady && (
        <>
          <RigidBody type="fixed" colliders="hull">
            <primitive object={scene} position={adjustedPosition} />
          </RigidBody>
          <RigidBody type="fixed" colliders="hull">
            <primitive object={scene} position={adjustedPosition} />
          </RigidBody>
        </>
      )}
    </>
  );
}

export function Bridge() {
  const bridgeGeometry = new THREE.BoxGeometry(10, 1, 80);
  const bridgeMaterial = new THREE.MeshStandardMaterial({ color: "red" });
  const [adjustedPosition, setAdjustedPosition] =
    useState<[number, number, number]>();

  if (boundingBox) {
    setAdjustedPosition([0, 0, -(bridgeGeometry.parameters.depth / 2)]);
  }
  return (
    <>
      <mesh
        geometry={bridgeGeometry}
        material={bridgeMaterial}
        position={adjustedPosition}
      />
    </>
  );
}

export function Step() {
  return (
    <>
      <Floor position={[0, 0, 0]} />
      <Bridge />
      <Floor position={[0, 0, -80]} />
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

/* <primitive object={model} position={[0, 0, 0]} scale={10}></primitive> */

{
  /* モデル読み込みが完了後にJSX評価しないと
      Coliderの座標が適切に反映されない */
}
