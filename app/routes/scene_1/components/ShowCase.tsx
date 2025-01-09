import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Waves } from "./Waves";
import { ShowCaseLight } from "./Lights";
import { Question } from "./Question";
import ThreePlayer from "../../../store/three_player_store";
import {
  ShowCaseContent0,
  ShowCaseContent3,
  ShowCaseContent6,
  ShowCaseContent7,
  ShowCaseContent9,
  ShowCaseContent10,
  ShowCaseContent11,
} from "./ShowCaseContents";
import { getGui } from "../util/lil-gui";

type ShowCaseProps = {
  index: number;
};

let isFirstTry = true;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const showcaseBodyMaterial = new THREE.MeshStandardMaterial({
  // color: "black",
  metalness: 1,
  roughness: 0,
});
const showcaseSheetMaterial = new THREE.MeshStandardMaterial({
  color: "#f1f1f1",
});
const showcaseGlassMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 0,
  transmission: 1,
  ior: 1.62,
  thickness: 0.001,
  opacity: 0.95, // 透明度を強調
  transparent: true, // 透明を有効化
  color: 0xffffff, // 完全な白
  depthWrite: false,
});

const showcaseComponents: any = {
  0: ShowCaseContent0,
  3: ShowCaseContent3,
  6: ShowCaseContent6,
  7: ShowCaseContent7,
  9: ShowCaseContent9,
  10: ShowCaseContent10,
  11: ShowCaseContent11,
};

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader();

export function ShowCase({ index }: ShowCaseProps) {
  // const rigidBodyRef: any = useRef();
  // const groupRef: any = useRef();

  const displayedQuestion = [7, 9, 10, 11];
  const displayedGreenWave = [0, 3, 6, 9];
  const displayedBlueWave = [9];

  const ShowcaseComponent: any = showcaseComponents[index];

  const [isPositionReady, setIsPositionReady] = useState<boolean>(false);
  const [currentFloorNum, setCurrentFloorNum] = useState(0);
  const [shadowLevel, setShadowLevel] = useState(75);

  /* 初回マウントの、meshのポジションが確定されるまでRigidBodyを待機 */
  useEffect(() => {
    setIsPositionReady(true);

    /**
     * Texture Setup
     */
    const stoneTexture = textureLoader.load("asset/texture/stone.png");

    if (stoneTexture) {
      showcaseBodyMaterial.map = stoneTexture;
      showcaseBodyMaterial.metalnessMap = stoneTexture; // テクスチャを使用して金属感を制御
      showcaseBodyMaterial.bumpScale = 0.3; // デフォルトは 1 だが、視覚的に目立つよう増加
      // stoneTexture.colorSpace = THREE.NoColorSpace; // グレースケールデータのために色空間無効化
      // stoneTexture.colorSpace = THREE.SRGBColorSpace;

      stoneTexture.repeat.x = 2;
      stoneTexture.repeat.y = 1;
      stoneTexture.wrapS = THREE.RepeatWrapping;
      stoneTexture.wrapT = THREE.RepeatWrapping;
    }

    /* Listem Current Floor */
    const unsubscibePlayerPosition = ThreePlayer.subscribe(
      (state: any) => state.currentFloorNum,
      (value) => {
        setCurrentFloorNum(value);

        // Light Shadow Level for Player
        if ([0].includes(value)) setShadowLevel(70);
        if ([3].includes(value)) setShadowLevel(100);
        if ([6, 7].includes(value)) setShadowLevel(50);
        if ([9].includes(value)) setShadowLevel(25);
        if ([10, 11].includes(value)) setShadowLevel(0);
      },
    );

    // /**
    //  * Debug
    //  */
    // const gui = getGui();
    // if (gui && isFirstTry) {
    //   isFirstTry = false;
    //   const showcaseFolder = gui.addFolder("Showcase");

    //   showcaseFolder
    //     .add(showcaseBodyMaterial, "metalness", 0, 1, 0.001)
    //     .name("metalness");

    //   showcaseFolder
    //     .add(showcaseBodyMaterial, "roughness", 0, 1, 0.001)
    //     .name("roughness");
    // }
    return () => {
      unsubscibePlayerPosition();
    };
  }, []);

  return (
    <>
      {isPositionReady && (
        <>
          {/* ShowCase */}
          <group scale={1.1}>
            {/* Bottom */}
            <mesh
              geometry={boxGeometry}
              material={showcaseBodyMaterial}
              position={[0, 0.5, 0]}
              scale={[4, 1, 4]}
            />

            {/* Bottom Layer */}
            <mesh
              geometry={boxGeometry}
              material={showcaseSheetMaterial}
              position={[0, 1.005, 0]}
              scale={[3.8, 0.01, 3.8]}
            />

            {/* Top Layer */}
            <mesh
              geometry={boxGeometry}
              material={showcaseSheetMaterial}
              position={[0, 5, 0]}
              scale={[3.8, 0.01, 3.8]}
            />

            {/* Body Left */}
            <mesh
              geometry={boxGeometry}
              material={showcaseGlassMaterial}
              position={[-1.95, 3, 0]}
              scale={[0.1, 4, 4]}
            />

            {/* Body Right */}
            <mesh
              geometry={boxGeometry}
              material={showcaseGlassMaterial}
              position={[1.95, 3, 0]}
              scale={[0.1, 4, 4]}
            />

            {/* Body Forward */}
            <mesh
              geometry={boxGeometry}
              material={showcaseGlassMaterial}
              position={[0, 3, -1.95]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[0.1, 4, 4]}
            />

            {/* Body Backward */}
            {/* <mesh
            geometry={boxGeometry}
            material={showcaseBodyMaterial}
            position={[0, 3, 1.95]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[0.1, 4, 4]}
          /> */}

            {/* Top */}
            <mesh
              geometry={boxGeometry}
              material={showcaseBodyMaterial}
              position={[0, 5.125, 0]}
              scale={[4, 0.25, 4]}
            />

            {/* Empty Content */}
            {displayedQuestion.includes(index) && <Question />}

            {/* Main Content */}
            <ShowcaseComponent />

            {/* Waves */}
            {displayedGreenWave.includes(index) && <Waves flag={0} />}
            {displayedBlueWave.includes(index) && <Waves flag={1} />}

            {/* Light Right Above ShowCase */}
            {currentFloorNum == index && (
              <ShowCaseLight shadowLevel={shadowLevel} index={index} />
            )}
          </group>
        </>
      )}
    </>
  );
}
