import { Vector3, useLoader } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { Object3D } from "three";
import { floorPowerOfTwo } from "three/src/math/MathUtils.js";
import { ShowCase } from "./ShowCase";
import React from "react";

type floorProps = {
  position: [number, number, number];
  scene: Object3D;
};

type bridgeProps = {
  position: [number, number, number];
  boundingBox: THREE.Box3;
  heightDifference: number;
};

// 隣り合うフロアの中心軸の距離
// ratePositionYDiff を乗算してY軸の高さの差異を算出するための
// 基準値として利用
const floorAxesInterval = 64;
// 隣り合うフロア間のy軸の調節用の変数
const ratePositionYDiff = 0.25;
// 隣り合うフロア間の空間距離 (10 Unit)
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
export function Floor({ position, scene }: floorProps) {
  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
  const [adjustedPosition, setAdjustedPosition] =
    useState<[number, number, number]>();

  useEffect(() => {
    setAdjustedPosition([position[0], position[1], position[2]]);
    setIsPositionReady(true);
  }, [position, scene]);

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

export function Bridge({
  position,
  boundingBox,
  heightDifference,
}: bridgeProps) {
  const FloorTopSuareLength = Math.abs(boundingBox.max.z - boundingBox.min.z);

  const triangleBase = floorSpaceInterval; // 底辺
  const triangleHeight = heightDifference; // 高さ
  const triangleSlope = Math.hypot(triangleBase, triangleHeight); // 斜辺
  const triangleAngle = Math.atan(triangleHeight / triangleBase); // 角度

  const bridgeGeometry = new THREE.BoxGeometry(
    FloorTopSuareLength / 3,
    FloorTopSuareLength / 50,
    triangleSlope,
  );
  // const bridgeMaterial = new THREE.MeshStandardMaterial({ color: "blue" });
  const bridgeMaterial = new THREE.MeshPhysicalMaterial({
    metalness: 0,
    roughness: 0,
    transmission: 1,
    ior: 1.62,
    thickness: 0.001,
    opacity: 0.95, // 透明度を強調
    transparent: true, // 透明を有効化
    color: 0xffffff, // 完全な白
  });

  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
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
    setIsPositionReady(true);
  }, [position, boundingBox]);

  return (
    <>
      {isPositionReady && (
        <group
          position={adjustedPositionParent}
          rotation={new THREE.Euler(triangleAngle, 0, 0)}
        >
          <RigidBody type="fixed" colliders="hull">
            <mesh
              geometry={bridgeGeometry}
              material={bridgeMaterial}
              position={adjustedPositionChild}
            />
          </RigidBody>
        </group>
      )}
    </>
  );
}

export function Stage() {
  const stageRow = 4;
  const stageColumn = 3;
  const floorPositions = [];
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
      const firstLeftColumnFloorPosition = [
        columnIndex * floorAxesInterval,
        rowIndex * floorAxesInterval * ratePositionYDiff,
        rowIndex * -floorAxesInterval,
      ];
      const floorPosition = [
        firstLeftColumnFloorPosition[0],
        firstLeftColumnFloorPosition[1] +
          columnIndex * floorAxesInterval * ratePositionYDiff,
        rowIndex * -floorAxesInterval,
      ];
      floorPositions.push(floorPosition);
    }
  }

  return (
    <>
      {scene != null && boundingBoxFloor != null && (
        <>
          {floorPositions.map((floorPosition, index) => {
            const hiddenFloorArray = [1, 2, 4, 5, 8];
            const hiddenBridgeForward = [9, 10, 11];
            const hiddenBridgeRight = [0, 3, 7, 11];

            // Skip unnecesarry floor
            if (hiddenFloorArray.includes(index)) return;

            return (
              <React.Fragment key={`Fragment${index}`}>
                <Floor
                  position={[
                    floorPosition[0],
                    floorPosition[1],
                    floorPosition[2],
                  ]}
                  scene={scene.clone()}
                />

                {/* 非表示リストにindexが含まれる場合、Brigdeの表示を無効化 */}
                {!hiddenBridgeForward.includes(index) && (
                  <Bridge
                    position={[
                      floorPosition[0],
                      floorPosition[1],
                      floorPosition[2],
                    ]}
                    boundingBox={boundingBoxFloor}
                    heightDifference={floorAxesInterval * ratePositionYDiff}
                  />
                )}

                {/* 非表示リストにindexが含まれる場合、Brigdeの表示を無効化 */}
                {!hiddenBridgeRight.includes(index) && (
                  // Bridgeを回転させて再利用
                  <group
                    position={[
                      floorPosition[0],
                      floorPosition[1],
                      floorPosition[2],
                    ]}
                    rotation={[0, -Math.PI / 2, 0]}
                  >
                    <Bridge
                      position={[0, 0, 0]}
                      boundingBox={boundingBoxFloor}
                      heightDifference={floorAxesInterval * ratePositionYDiff}
                    />
                  </group>
                )}
                <ShowCase
                  position={[
                    floorPosition[0],
                    floorPosition[1],
                    floorPosition[2],
                  ]}
                />
              </React.Fragment>
            );
          })}
        </>
      )}
    </>
  );
}
