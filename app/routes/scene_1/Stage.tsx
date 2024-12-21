import { Vector3, useLoader } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { Object3D } from "three";
import { floorPowerOfTwo } from "three/src/math/MathUtils.js";

type stageProps = {
  position: [number, number, number];
  scene: Object3D;
  boundingBox: THREE.Box3;
};
const floorAxesInterval = -64;
const floorSpaceInterval = 40;

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
  const FloorTopSuareLength = Math.abs(boundingBox.max.z - boundingBox.min.z);

  const triangleBase = floorSpaceInterval; // 底辺
  const triangleHeight = 0; // 高さ
  const triangleSlope = Math.hypot(triangleBase, triangleHeight); // 斜辺
  const triangleAngle = Math.atan(triangleHeight / triangleBase); // 角度

  const bridgeGeometry = new THREE.BoxGeometry(
    FloorTopSuareLength / 3,
    FloorTopSuareLength / 50,
    triangleSlope,
  );
  const bridgeMaterial = new THREE.MeshStandardMaterial({ color: "blue" });

  const [adjustedPositionChild, setAdjustedPositionChild] =
    useState<[number, number, number]>();
  const [adjustedPositionParent, setAdjustedPositionParent] = useState<
    [number, number, number]
  >([0, 0, 0]);

  useEffect(() => {
    setAdjustedPositionParent([
      position[0],
      position[1] - bridgeGeometry.parameters.height / 2,
      position[2] - FloorTopSuareLength / 2,
    ]);

    setAdjustedPositionChild([0, 0, -bridgeGeometry.parameters.depth / 2]);
  }, [position, scene, boundingBox]);

  return (
    <>
      <group
        position={adjustedPositionParent}
        rotation={new THREE.Euler(triangleAngle, 0, 0)}
      >
        <mesh
          geometry={bridgeGeometry}
          material={bridgeMaterial}
          position={adjustedPositionChild}
        />
      </group>
    </>
  );
}

export function Stage() {
  const stageRow = 4;
  const stageColumn = 3;
  const stagePositions = [];
  const [scene, setScene] = useState<Object3D>();
  const [boundingBoxFloor, setBoundingBoxFloor] = useState<THREE.Box3>();

  /* Initialize Importing Each Model */
  useEffect(() => {
    gltfLoader.load("/asset/model/floor.glb", (gltf: any) => {
      gltf.scene.scale.set(1, 1, 1);
      setScene(gltf.scene);
      const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
      setBoundingBoxFloor(boundingBox);
    });
  }, []);

  /* Calculate Each Position for Floor */
  for (let rowIndex = 0; rowIndex < stageRow; rowIndex++) {
    for (let columnIndex = 0; columnIndex < stageColumn; columnIndex++) {
      const firstLeftColumnPosition = [
        columnIndex * 64,
        (rowIndex * 64) / 4,
        rowIndex * -64,
      ];
      const position = [
        firstLeftColumnPosition[0],
        firstLeftColumnPosition[1] + (columnIndex * 64) / 4,
        rowIndex * -64,
      ];
      stagePositions.push(position);
    }
  }

  return (
    <>
      {scene != null && boundingBoxFloor != null && (
        <>
          {stagePositions.map((position, index) => {
            const hiddenArray = [1, 2, 4, 5, 8];

            // Skip unnecesarry floor
            if (hiddenArray.includes(index)) return;

            return (
              <Floor
                position={[position[0], position[1], position[2]]}
                scene={scene.clone()}
                boundingBox={boundingBoxFloor}
              />
            );
          })}
        </>
      )}
    </>
  );
}

{
  /* <Floor
position={[0, 0, 0]}
scene={scene.clone()}
boundingBox={boundingBoxFloor}
/>
<Bridge
position={[0, 0, 0]}
scene={scene.clone()}
boundingBox={boundingBoxFloor}
/>

<Floor
position={[0, 20, -60]}
scene={scene.clone()}
boundingBox={boundingBoxFloor}
/>
<Bridge
position={[0, 20, -60]}
scene={scene.clone()}
boundingBox={boundingBoxFloor}
/>
<Floor
position={[0, 40, -120]}
scene={scene.clone()}
boundingBox={boundingBoxFloor}
/> */
}
