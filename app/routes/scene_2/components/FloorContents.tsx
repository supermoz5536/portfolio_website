import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ShowCase } from "./ShowCase";
import { RigidBody } from "@react-three/rapier";
import { Fireflies } from "./Fireflies";
import ThreePlayer from "../../../store/three_player_store";
import { ShowCaseLight } from "./Lights";
import { Waves } from "./Waves";
import { Question } from "./Question";

type FloorContentsProps = {
  index: number;
  position: THREE.Vector3;
};

const transparentMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false,
});

const playerShadowMaterial = new THREE.MeshStandardMaterial({
  color: "black",
  transparent: true,
  opacity: 1,
});

const displayedQuestion = [7, 9, 10, 11];
const displayedGreenWave = [0, 3, 6, 9];
const displayedBlueWave = [9];

export function FloorContents({ index, position }: FloorContentsProps) {
  const rigidBodyRef = useRef<any>();
  const groupRef = useRef<any>();
  const playerShadowRef = useRef<any>();

  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [isPlayerShadowVisible, setIsPlayerShadowVisible] = useState(false);
  const [currentPlayerPosition, setCurrentPlayerPosition] = 
    useState(new THREE.Vector3(0, 0, 7)); // prettier-ignore
  const [adjustedPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(position.x, position.y, position.z),
  );

  useEffect(() => {
    // 初回マウントの、meshのポジションが確定されるまでRigidBodyを待機
    setIsPositionReady(true);

    /**
     * Texture Setup
     */

    const textureLoader = new THREE.TextureLoader();
    const playerShadowTexture = textureLoader.load(
      "asset/texture/playerShadow.jpg",
    );

    playerShadowMaterial.alphaMap = playerShadowTexture;

    /*
     * Listem Player Position and FloorNum
     */

    const unsubscibePlayer = ThreePlayer.subscribe(
      (state: any) => ({
        currentPosition: state.currentPosition,
        currentFloorNum: state.currentFloorNum,
        isVisibleShadow: state.isVisibleShadow,
      }),
      ({ currentPosition, currentFloorNum, isVisibleShadow }) => {
        setCurrentPlayerPosition(currentPosition);
        setCurrentFloor(currentFloorNum);
        setIsPlayerShadowVisible(isVisibleShadow);
      },
    );

    return () => {
      unsubscibePlayer();
    };
  }, [index]);

  useFrame((state, delta) => {
    adjustedPosition.lerp(position, 0.5 * delta);

    if (rigidBodyRef.current) {
      rigidBodyRef.current.setNextKinematicTranslation({
        x: adjustedPosition.x,
        y: adjustedPosition.y,
        z: adjustedPosition.z,
      });
    }

    if (groupRef.current) {
      groupRef.current.position.set(
        adjustedPosition.x,
        adjustedPosition.y,
        adjustedPosition.z,
      );
    }

    if (playerShadowRef.current) {
      /*
       * Player Shadow
       */

      setPlayerShadowPosition();
      setPlayerShadowOpacity();
      setPlayerShadowClipping(currentFloor);
    }
  });

  function setPlayerShadowPosition(): void {
    const currentFloorCenter = new THREE.Vector3(
      position.x,
      position.y,
      position.z,
    );

    const directionToPlayer = new THREE.Vector3().subVectors(
      currentPlayerPosition,
      currentFloorCenter,
    );

    const normalizedDirection = directionToPlayer.clone().normalize();

    const offsetDistance = 0.35;

    const playerShadowPositionGlobal = currentPlayerPosition
      .clone()
      .add(normalizedDirection.multiplyScalar(offsetDistance));

    // parent は <group>
    // leap の動的ポジションを保持している。
    const parent = playerShadowRef.current.parent;

    // ローカル座標に変換
    const playerShadowPositionLocal = playerShadowPositionGlobal.clone();
    parent.worldToLocal(playerShadowPositionLocal);

    playerShadowRef.current.position.set(
      playerShadowPositionLocal.x,
      0.15,
      playerShadowPositionLocal.z,
    );
  }

  function setPlayerShadowOpacity(): void {
    const distanceFromLocalCenterToPlayer =
    new THREE.Vector3(position.x, position.y, position.z).distanceTo(currentPlayerPosition) // prettier-ignore

    if (distanceFromLocalCenterToPlayer < 8) {
      playerShadowRef.current.material.opacity = 1;
    } else if (
      distanceFromLocalCenterToPlayer >= 8 &&
      distanceFromLocalCenterToPlayer <= 16
    ) {
      playerShadowRef.current.material.opacity =
        1 - (distanceFromLocalCenterToPlayer - 8) / 8;
    } else {
      playerShadowRef.current.material.opacity = 0;
    }
  }

  function setPlayerShadowClipping(currentFloor: number): void {
    let clippingPlanes = [];
    let rowMultiply = 0;
    let colMultiply = 0;

    const row0 = [0, 1, 2];
    const row1 = [3, 4, 5];
    const row2 = [6, 7, 8];
    const row3 = [9, 10, 11];

    const col0 = [0, 3, 6, 9];
    const col1 = [1, 4, 7, 10];
    const col2 = [2, 5, 8, 11];

    if (row0.includes(currentFloor)) rowMultiply = 0;
    if (row1.includes(currentFloor)) rowMultiply = 1;
    if (row2.includes(currentFloor)) rowMultiply = 2;
    if (row3.includes(currentFloor)) rowMultiply = 3;

    if (col0.includes(currentFloor)) colMultiply = 0;
    if (col1.includes(currentFloor)) colMultiply = 1;
    if (col2.includes(currentFloor)) colMultiply = 2;

    // Forword
    clippingPlanes.push(
      new THREE.Plane(
        new THREE.Vector3(0, 0, 1),
        12 + 64 * rowMultiply, // prettier-ignore
      ),
    );

    // Backword
    clippingPlanes.push(
      new THREE.Plane(
        new THREE.Vector3(0, 0, -1),
        - ((12 + 64 * rowMultiply) - 24), // prettier-ignore
      ),
    );

    // Left
    clippingPlanes.push(
      new THREE.Plane(
        new THREE.Vector3(1, 0, 0),
        12 + 64 * colMultiply, // prettier-ignore
      ),
    );

    // Right
    clippingPlanes.push(
      new THREE.Plane(
        new THREE.Vector3(-1, 0, 0),
        - ((12 + 64 * colMultiply) - 24), // prettier-ignore
      ),
    );

    playerShadowRef.current.material.clippingPlanes = clippingPlanes;
  }

  return (
    <>
      {isPositionReady && (
        <>
          {/* 衝突判定のないFloor上のコンテンツグループ */}
          <group ref={groupRef} position={adjustedPosition}>
            <Fireflies index={index} />
            <ShowCase index={index} />

            {/* Waves */}
            {displayedGreenWave.includes(index) && <Waves flag={0} />}
            {displayedBlueWave.includes(index) && <Waves flag={1} />}

            {/* Empty Content */}
            {displayedQuestion.includes(index) && <Question />}

            {/* Playerがいるフロアのみ生成 */}
            {currentFloor == index && (
              <>
                {/* ShowCase */}
                <ShowCaseLight shadowLevel={0} index={index} />

                {/*
                 * Player Shadow
                 *
                 * rayCastメソッド で Floor との判定処理をしたい場合は
                 * isPlayerShadowVisible が利用可能
                 */}
                {isPlayerShadowVisible && <></>}
                <>
                  <mesh
                    ref={playerShadowRef}
                    geometry={new THREE.PlaneGeometry(2.1, 2.1)}
                    material={playerShadowMaterial}
                    position={[
                      currentPlayerPosition.x,
                      0.05,
                      currentPlayerPosition.z,
                    ]}
                    rotation={[(Math.PI * 3) / 2, 0, 0]}
                  />
                </>
              </>
            )}
          </group>

          {/* 衝突判定のあるFloor上のコンテンツ */}
          <RigidBody
            ref={rigidBodyRef}
            position={adjustedPosition}
            type="kinematicPosition"
            colliders="hull"
          >
            {/* ShowCaseの代替用コライダーを適用するコンポーネント */}
            <mesh
              geometry={new THREE.BoxGeometry(4, 10.5, 4)}
              material={transparentMaterial}
              scale={1.1}
            />
          </RigidBody>
        </>
      )}
    </>
  );
}
