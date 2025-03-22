import { useEffect, useRef, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { Object3D } from "three";
import React from "react";
import ThreePlayer from "../../../../store/scene2/three_player_store";
import { ShowCase } from "./ShowCase";
import { FloorContents } from "./FloorContents";
import { Bridge, BridgeRight } from "./Bridges";
import { useGlobalStore } from "~/store/global/global_store";

type floorProps = {
  position: THREE.Vector3;
  scene: Object3D;
};

/**
 * Model Setting
 */
export function Floor({ position, scene }: floorProps) {
  const rigidBodyRef: any = useRef();
  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
  const [adjustedPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(position.x, position.y, position.z),
  );

  /* 初回マウントの、meshのポジションが確定されるまでRigidBodyを待機 */
  useEffect(() => {
    setIsPositionReady(true);
  }, []);

  // /* 初回マウント後以降の更新 */
  // useFrame((state, delta) => {
  //   adjustedPosition.lerp(position, 0.5 * delta);
  //   if (rigidBodyRef.current) {
  //     rigidBodyRef.current.setNextKinematicTranslation({
  //       x: adjustedPosition.x,
  //       y: adjustedPosition.y,
  //       z: adjustedPosition.z,
  //     });
  //   }
  // });

  return (
    <>
      {isPositionReady && (
        <>
          <group
            ref={rigidBodyRef}
            position={adjustedPosition}
            userData={{ key: "floor" }}
          >
            <primitive object={scene} />
          </group>
        </>
      )}
    </>
  );
}

export function Floors() {
  let floorPositions: THREE.Vector3[] = [];
  const stageRow = 4;
  const stageColumn = 3;
  const floorAxesInterval = 64; // フロア間の中心軸の距離 (高さの差分の基準値としても利用)
  const [controlRatePositionY, setControlRatePositionY] = useState(0.275); // フロア間のy軸の調節用変数
  const [scene, setScene] = useState<Object3D>();
  const [boundingBoxFloor, setBoundingBoxFloor] = useState<THREE.Box3>();

  const loadingManager = useGlobalStore((state) => state.loadingManager);

  /* Initialize */
  useEffect(() => {
    /**
     * Loader
     */
    const gltfLoader: any = new GLTFLoader();
    const dracoLoader: any = new DRACOLoader(loadingManager);
    dracoLoader.setDecoderPath("/draco/");
    gltfLoader.setDRACOLoader(dracoLoader);

    /* Importing Each Model  */
    gltfLoader.load("/asset/model/floor.glb", (gltf: any) => {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });

      const boundingBox = new THREE.Box3().setFromObject(gltf.scene);

      setScene(gltf.scene);
      setBoundingBoxFloor(boundingBox);
    });

    /* Listem Player Current Floor */
    const unsubscibePlayerPosition = ThreePlayer.subscribe(
      (state: any) => state.currentFloorNum,
      (value) => {
        if ([0].includes(value)) setControlRatePositionY(0.275);
        if ([1, 3].includes(value)) setControlRatePositionY(0.225);
        if ([2, 4, 6].includes(value)) setControlRatePositionY(0.175);
        if ([5, 7, 9].includes(value)) setControlRatePositionY(0.125);
        if ([8, 10].includes(value)) setControlRatePositionY(0.075);
        if ([11].includes(value)) setControlRatePositionY(0.025);
      },
    );
    return () => {
      unsubscibePlayerPosition();
    };
  }, []);

  /* Calculate Each Position for Floor */
  for (let rowIndex = 0; rowIndex < stageRow; rowIndex++) {
    for (let columnIndex = 0; columnIndex < stageColumn; columnIndex++) {
      const firstLeftColumnFloorPosition = [
        columnIndex * floorAxesInterval,
        rowIndex * floorAxesInterval * controlRatePositionY,
        rowIndex * -floorAxesInterval,
      ];
      const floorPosition = new THREE.Vector3(
        firstLeftColumnFloorPosition[0],
        firstLeftColumnFloorPosition[1] +
          columnIndex * floorAxesInterval * controlRatePositionY,
        rowIndex * -floorAxesInterval,
      );
      floorPositions = [...floorPositions, floorPosition];
    }
  }

  return (
    <>
      {scene != null && boundingBoxFloor != null && (
        <>
          {floorPositions.map((floorPosition: any, index: any) => {
            const hiddenFloorArray = [1, 2, 4, 5, 8];
            const hiddenBridgeForward = [0, 7, 11];
            const hiddenBridgeRight = [0, 3, 6, 9];

            // Skip unnecesarry floor
            if (hiddenFloorArray.includes(index)) return;

            return (
              <React.Fragment key={`Fragment${index}`}>
                <Floor position={floorPosition} scene={scene.clone()} />

                {/* 非表示リストにindexが含まれる場合、Brigdeの表示を無効化 */}
                {!hiddenBridgeForward.includes(index) && (
                  <Bridge
                    position={floorPosition}
                    boundingBox={boundingBoxFloor}
                    heightDifference={floorAxesInterval * controlRatePositionY}
                  />
                )}

                {/* 非表示リストにindexが含まれる場合、Brigdeの表示を無効化 */}
                {!hiddenBridgeRight.includes(index) && (
                  // Bridgeを回転させて再利用

                  <BridgeRight
                    position={floorPosition}
                    boundingBox={boundingBoxFloor}
                    heightDifference={floorAxesInterval * controlRatePositionY}
                  />
                )}

                <FloorContents index={index} position={floorPosition} />

                {/* Particle Codes */}
                {/* パーティクルもShowCaseのイージングのコードを利用してフロアの上下リフトに追従 */}
                {/* here */}
              </React.Fragment>
            );
          })}
        </>
      )}
    </>
  );
}
