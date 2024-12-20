import { Vector3, useLoader } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { Object3D } from "three";

type stageProps = {
  position: [number, number, number];
  scene: Object3D;
  boundingBox: THREE.Box3;
};

const floorInterval = 80;

/**
 * Loader
 */
const gltfLoader: any = new GLTFLoader();
const dracoLoader: any = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Model Setting
 */
export function Floor({ position, scene, boundingBox }: stageProps) {
  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
  const [adjustedPosition, setAdjustedPosition] =
    useState<[number, number, number]>();

  useEffect(() => {
    boundingBox = new THREE.Box3().setFromObject(scene);
    setAdjustedPosition([position[0], position[1], position[2]]);
    setIsPositionReady(true);
  }, [position, scene, boundingBox]);

  return (
    <>
      {isPositionReady && (
        <>
          <RigidBody type="fixed" colliders="hull">
            <primitive object={scene} position={adjustedPosition} />
          </RigidBody>
        </>
      )}
    </>
  );
}

export function Bridge({ position, scene, boundingBox }: stageProps) {
  /* FloorTopLengthの取得値が想定値の２倍になる不具合　→ /2 で調整 */
  const FloorTopSideLength =
    Math.abs(boundingBox.max.z - boundingBox.min.z) / 2;

  const triangleBase = floorInterval - FloorTopSideLength; // 底辺
  const triangleHeight = 0; // 高さ
  const triangleSlope = Math.hypot(triangleBase, triangleHeight); // 斜辺
  const triangleAngle = Math.atan(triangleHeight / triangleBase); // 角度

  const bridgeGeometry = new THREE.BoxGeometry(1, 1, 5);

  const bridgeMaterial = new THREE.MeshStandardMaterial({ color: "blue" });
  const [adjustedPosition, setAdjustedPosition] =
    useState<[number, number, number]>();

  console.log("boundingBox.max.z", boundingBox.max.z);

  useEffect(() => {
    setAdjustedPosition([0, 0, 0]);
  }, [position, scene, boundingBox]);

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

export function Stage() {
  const [scene, setScene] = useState<Object3D>();
  const [boundingBoxFloor, setBoundingBoxFloor] = useState<THREE.Box3>();

  useEffect(() => {
    gltfLoader.load("/asset/model/floor.glb", (gltf: any) => {
      gltf.scene.scale.set(1, 1, 1);
      setScene(gltf.scene);
      const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
      setBoundingBoxFloor(boundingBox);
    });
  }, []);

  return (
    <>
      {scene != null && boundingBoxFloor != null && (
        <>
          <Floor
            position={[0, 0, 0]}
            scene={scene.clone()}
            boundingBox={boundingBoxFloor}
          />
          {/* <Bridge
            position={[0, 0, 0]}
            scene={scene.clone()}
            boundingBox={boundingBoxFloor}
          /> */}
          {/* <Floor
            position={[0, 20, -floorInterval]}
            scene={scene.clone()}
            boundingBox={boundingBoxFloor}
          /> */}
        </>
      )}
    </>
  );
}
