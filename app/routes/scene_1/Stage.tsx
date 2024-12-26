import { Vector3, useFrame, useLoader } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { Object3D } from "three";
import { floorPowerOfTwo } from "three/src/math/MathUtils.js";
import { ShowCase } from "./ShowCase";
import React from "react";
import ThreePlayer from "../../store/three_player_store";
import { isRef } from "@react-three/fiber/dist/declarations/src/core/utils";

type floorProps = {
  position: THREE.Vector3;
  scene: Object3D;
};

type bridgeProps = {
  position: THREE.Vector3;
  boundingBox: THREE.Box3;
  heightDifference: number;
};

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
  const rigidBodyRef: any = useRef();
  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
  const [adjustedPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(position.x, position.y, position.z),
  );

  /* 初回マウントの、meshのポジションが確定されるまでRigidBodyを待機 */
  useEffect(() => {
    setIsPositionReady(true);
  }, []);

  /* 初回マウント後以降の更新 */
  useFrame((state, delta) => {
    adjustedPosition.lerp(position, 0.5 * delta);
    if (rigidBodyRef.current) {
      rigidBodyRef.current.setNextKinematicTranslation({
        x: adjustedPosition.x,
        y: adjustedPosition.y,
        z: adjustedPosition.z,
      });
    }
  });

  return (
    <>
      {isPositionReady && (
        <>
          <RigidBody
            ref={rigidBodyRef}
            position={adjustedPosition}
            type="kinematicPosition"
            colliders="hull"
          >
            <primitive object={scene} />
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

  const bridgeMaterial = new THREE.MeshPhysicalMaterial({
    color: "white", // 完全な白
  });

  // const bridgeMaterial = new THREE.MeshPhysicalMaterial({
  //   metalness: 0,
  //   roughness: 0,
  //   transmission: 1,
  //   ior: 1.62,
  //   thickness: 0.001,
  //   opacity: 0.95, // 透明度を強調
  //   // transparent: true, // 透明を有効化
  //   color: 0xffffff, // 完全な白
  // });

  const parentRef: any = useRef();
  const childRef: any = useRef();

  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
  const [smoothSlope] = useState(triangleSlope);
  const [smoothAngle, setSmoothAngle] = useState(
    new THREE.Euler(triangleAngle, 0, 0),
  );
  const [smoothBridgeGeometry] = useState(
    new THREE.BoxGeometry(
      FloorTopSuareLength / 3,
      FloorTopSuareLength / 50,
      triangleSlope,
    ),
  );
  const [smoothPositionParent, setSmoothPositionParent] = useState(
    new THREE.Vector3(
      position.x,
      position.y - smoothBridgeGeometry.parameters.height / 2,
      position.z + FloorTopSuareLength / 2,
    ),
  );
  const [smoothPositionChild] = useState(
    new THREE.Vector3(0, 0, +smoothBridgeGeometry.parameters.depth / 2),
  );

  /**
   * 初回マウントの、meshのポジションが確定されるまでRigidBodyを待機
   */
  useEffect(() => {
    setIsPositionReady(true);
  }, []);

  /* 初回マウント後の Bridge のポジションと角度の変更 */
  useFrame((state, delta) => {
    if (parentRef.current && childRef.current) {
      /**
       * Parentの更新
       */
      const targetPositionParent = new THREE.Vector3(
        position.x,
        position.y - childRef.current.geometry.parameters.height / 2,
        position.z + FloorTopSuareLength / 2,
      );

      smoothPositionParent.lerp(targetPositionParent, 0.5 * delta);

      setSmoothPositionParent(
        new THREE.Vector3(
          smoothPositionParent.x,
          smoothPositionParent.y,
          smoothPositionParent.z,
        ),
      );

      parentRef.current.setNextKinematicTranslation({
        x: smoothPositionParent.x,
        y: smoothPositionParent.y,
        z: smoothPositionParent.z,
      });

      /* 角度更新 */
      const smoothedAngleX = THREE.MathUtils.lerp(
        smoothAngle.x, // start
        triangleAngle, // end
        0.5 * delta, // alpha
      );

      /* 次の計算に使うための状態を保存 */
      setSmoothAngle(new THREE.Euler(smoothedAngleX, 0, 0));

      /* オイラー角からクォータニオンに変換 */
      const rigidBodyQuotanion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(smoothedAngleX, 0, 0),
      );

      /* クォータニオンでRigidBodyの回転角を更新 */
      parentRef.current.setNextKinematicRotation({
        x: rigidBodyQuotanion.x,
        y: rigidBodyQuotanion.y,
        z: rigidBodyQuotanion.z,
        w: rigidBodyQuotanion.w,
      });
    }

    /**
     * Childの更新
     */
    if (childRef.current) {
      /**Geometryのサイズ更新 */
      const targetBase = floorSpaceInterval; // 底辺
      const targetHeight = heightDifference; // 高さ
      // Geometryのサイズ制御できないあまり部分を
      // +2することでフロア内部にめり込ませて隠蔽
      const targetSlope = Math.hypot(targetBase, targetHeight) + 1;
      const targetScaleZ = targetSlope / smoothSlope;

      childRef.current.scale.set(1, 1, targetScaleZ);

      /* Positionの更新 */
      childRef.current.position.set(
        0,
        0,
        (+smoothBridgeGeometry.parameters.depth * targetScaleZ) / 2,
      );
    }
  });

  return (
    <>
      {isPositionReady && (
        <RigidBody
          ref={parentRef}
          type="kinematicPosition"
          colliders="hull"
          position={smoothPositionParent}
          rotation={smoothAngle}
        >
          <mesh
            ref={childRef}
            castShadow
            receiveShadow
            position={smoothPositionChild}
            geometry={smoothBridgeGeometry}
            material={bridgeMaterial}
          />
        </RigidBody>
      )}
    </>
  );
}

export function BridgeRight({
  position,
  boundingBox,
  heightDifference,
}: bridgeProps) {
  const FloorTopSuareLength = Math.abs(boundingBox.max.x - boundingBox.min.x);

  const triangleBase = floorSpaceInterval; // 底辺
  const triangleHeight = heightDifference; // 高さ
  const triangleSlope = Math.hypot(triangleBase, triangleHeight); // 斜辺
  const triangleAngle = Math.atan(triangleHeight / triangleBase); // 角度

  const bridgeMaterial = new THREE.MeshPhysicalMaterial({
    color: "white", // 完全な白
  });

  // const bridgeMaterial = new THREE.MeshPhysicalMaterial({
  //   metalness: 0,
  //   roughness: 0,
  //   transmission: 1,
  //   ior: 1.62,
  //   thickness: 0.001,
  //   opacity: 0.95, // 透明度を強調
  //   // transparent: true, // 透明を有効化
  //   color: 0xffffff, // 完全な白
  // });

  const parentRef: any = useRef();
  const childRef: any = useRef();

  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
  const [smoothSlope] = useState(triangleSlope);
  const [smoothAngle, setSmoothAngle] = useState(
    new THREE.Euler(0, 0, triangleAngle),
  );
  const [smoothBridgeGeometry] = useState(
    new THREE.BoxGeometry(
      triangleSlope,
      FloorTopSuareLength / 50,
      FloorTopSuareLength / 3,
    ),
  );
  const [smoothPositionParent, setSmoothPositionParent] = useState(
    new THREE.Vector3(
      position.x - FloorTopSuareLength / 2,
      position.y - smoothBridgeGeometry.parameters.height / 2,
      position.z,
    ),
  );
  const [smoothPositionChild] = useState(
    new THREE.Vector3(0, 0, +smoothBridgeGeometry.parameters.depth / 2),
  );

  /**
   * 初回マウントの、meshのポジションが確定されるまでRigidBodyを待機
   */
  useEffect(() => {
    setIsPositionReady(true);
  }, []);

  /* 初回マウント後の Bridge のポジションと角度の変更 */
  useFrame((state, delta) => {
    if (parentRef.current && childRef.current) {
      /**
       * Parentの更新
       */
      const targetPositionParent = new THREE.Vector3(
        position.x - FloorTopSuareLength / 2,
        position.y - childRef.current.geometry.parameters.height / 2,
        position.z,
      );

      smoothPositionParent.lerp(targetPositionParent, 0.5 * delta);

      setSmoothPositionParent(
        new THREE.Vector3(
          smoothPositionParent.x,
          smoothPositionParent.y,
          smoothPositionParent.z,
        ),
      );

      parentRef.current.setNextKinematicTranslation({
        x: smoothPositionParent.x,
        y: smoothPositionParent.y,
        z: smoothPositionParent.z,
      });

      /* 角度更新 */
      const smoothedAngleZ = THREE.MathUtils.lerp(
        smoothAngle.z, // start
        triangleAngle, // end
        0.5 * delta, // alpha
      );

      /* 次の計算に使うための状態を保存 */
      setSmoothAngle(new THREE.Euler(0, 0, smoothedAngleZ));

      /* オイラー角からクォータニオンに変換 */
      const rigidBodyQuotanion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, 0, smoothedAngleZ),
      );

      /* クォータニオンでRigidBodyの回転角を更新 */
      parentRef.current.setNextKinematicRotation({
        x: rigidBodyQuotanion.x,
        y: rigidBodyQuotanion.y,
        z: rigidBodyQuotanion.z,
        w: rigidBodyQuotanion.w,
      });
    }

    /**
     * Childの更新
     */
    if (childRef.current) {
      /**Geometryのサイズ更新 */
      const targetBase = floorSpaceInterval; // 底辺
      const targetHeight = heightDifference; // 高さ
      // Geometryのサイズ制御できないあまり部分を
      // +2することでフロア内部にめり込ませて隠蔽
      const targetSlope = Math.hypot(targetBase, targetHeight) + 1;
      const targetScaleX = targetSlope / smoothSlope;

      childRef.current.scale.set(targetScaleX, 1, 1);

      /* Positionの更新 */
      childRef.current.position.set(
        (-smoothBridgeGeometry.parameters.width * targetScaleX) / 2,
        0,
        0,
      );
    }
  });

  return (
    <>
      {isPositionReady && (
        <RigidBody
          ref={parentRef}
          type="kinematicPosition"
          colliders="hull"
          position={smoothPositionParent}
          rotation={smoothAngle}
        >
          <mesh
            castShadow
            receiveShadow
            ref={childRef}
            position={smoothPositionChild}
            geometry={smoothBridgeGeometry}
            material={bridgeMaterial}
          />
        </RigidBody>
      )}
    </>
  );
}

export function Stage() {
  const stageRow = 4;
  const stageColumn = 3;
  const floorAxesInterval = 64; // フロア間の中心軸の距離 (高さの差分の基準値としても利用)
  let floorPositions: THREE.Vector3[] = [];
  const [controlRatePositionY, setControlRatePositionY] = useState(0.275); // フロア間のy軸の調節用変数
  const [scene, setScene] = useState<Object3D>();
  const [boundingBoxFloor, setBoundingBoxFloor] = useState<THREE.Box3>();

  /* Initialize */
  useEffect(() => {
    /* Importing Each Model  */
    gltfLoader.load("/asset/model/floor2.glb", (gltf: any) => {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
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
