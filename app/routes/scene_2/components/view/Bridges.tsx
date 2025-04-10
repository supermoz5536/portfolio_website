import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useGlobalStore } from "~/store/global/global_store";
import { useSystemStore } from "~/store/scene2/system_store";

type bridgeProps = {
  position: THREE.Vector3;
  boundingBox: THREE.Box3;
  heightDifference: number;
};

// 隣り合うフロア間の空間距離 (10 Unit)
const floorSpaceInterval = 40;

const stoneBridgeMaterial = new THREE.MeshPhysicalMaterial({
  color: "white", // 完全な白
});

// const transparentBridgeMaterial = new THREE.MeshPhysicalMaterial({
//   metalness: 0,
//   roughness: 0,
//   transmission: 1,
//   ior: 1.62,
//   thickness: 0.001,
//   opacity: 0.95, // 透明度を強調
//   // transparent: true, // 透明を有効化
//   color: 0xffffff, // 完全な白
// });

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

  const parentRef: any = useRef();
  const childRef: any = useRef();

  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
  const [smoothSlope] = useState(triangleSlope);
  const [smoothAngle, setSmoothAngle] = useState(
    new THREE.Euler(triangleAngle, 0, 0),
  );
  const [smoothBridgeGeometry] = useState(
    new THREE.BoxGeometry(
      FloorTopSuareLength / 5,
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
    new THREE.Vector3(0, 0, smoothBridgeGeometry.parameters.depth / 2),
  );

  const assets = useGlobalStore((state: any) => state.assets);

  useEffect(() => {
    // mesh のポジション確定まで RigidBody を待機
    setIsPositionReady(true);

    /**
     * Texture Setup
     */

    const stoneTexture = assets.texture.stone;

    if (stoneTexture) {
      stoneBridgeMaterial.map = stoneTexture;
      stoneTexture.colorSpace = THREE.SRGBColorSpace;

      stoneTexture.repeat.x = 0.7;
      stoneTexture.repeat.y = 0.7;

      stoneTexture.wrapS = THREE.RepeatWrapping;
      stoneTexture.wrapT = THREE.RepeatWrapping;

      stoneTexture.offset.x = 0.2;
      stoneTexture.offset.y = 0.7;

      stoneTexture.center.x = 0.5;
      stoneTexture.center.y = 0.5;

      stoneTexture.rotation = Math.PI / 2;
    }
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
        (smoothBridgeGeometry.parameters.depth * targetScaleZ) / 2,
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
            material={stoneBridgeMaterial}
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
      FloorTopSuareLength / 5,
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
    new THREE.Vector3(-smoothBridgeGeometry.parameters.width / 2, 0, 0),
  );

  useEffect(() => {
    setIsPositionReady(true);
  }, []);

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
            material={stoneBridgeMaterial}
          />
        </RigidBody>
      )}
    </>
  );
}
