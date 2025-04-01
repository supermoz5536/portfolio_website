import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSystemStore } from "~/store/scene1/system_store";
import ThreePlayerStore from "../../../../store/scene2/three_player_store";
import ThreeContentsStore from "../../../../store/scene2/three_contents_store";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { ArrowPlaneMaterial } from "./Materials/ArrowPlaneMaterial";
import { TopCirclePulseMaterial } from "./Materials/TopCirclePulseMaterial";
import { InsideConeMaterial } from "./Materials/InsideConeMaterial";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { FresnelConeMaterial } from "./Materials/FresnelConeMaterial";
import { useGlobalStore } from "~/store/global/global_store";
import { gsap } from "gsap/dist/gsap";

type CommonProps = {
  normWidth: number;
  normHeight: number;
};

const floorsRow0 = [0, 1, 2];
const floorsRow1 = [3, 4, 5];
const floorsRow2 = [6, 7, 8];
const floorsRow3 = [9, 10, 11];

const floorsCol0 = [0, 3, 6, 9];
const floorsCol1 = [1, 4, 7, 10];
const floorsCol2 = [2, 5, 8, 11];

/**
 * Geometry and Material
 */

const circleGeometry = new THREE.CircleGeometry(0.5, 32);
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const midPlaneGeometry = new THREE.PlaneGeometry(1, 1, 50, 50);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const bottomConeGeometry = new THREE.ConeGeometry(25, 40, 4); // 第一引数は、外接円の半径

const glassMaterial = new THREE.MeshPhysicalMaterial({
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

const towerPositionX = 0;
const towerPositionZ = 0;

export function TopCircle({ normWidth, normHeight }: CommonProps) {
  return (
    <>
      <mesh
        geometry={circleGeometry}
        material={
          new THREE.MeshBasicMaterial({
            color: "blue",
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide,
            // blending: THREE.AdditiveBlending,
          })
        }
        position={[towerPositionX, normHeight, towerPositionZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[normWidth, normWidth, 1]}
      />
    </>
  );
}

export function TopCirclePulse({ normWidth, normHeight }: CommonProps) {
  const material = TopCirclePulseMaterial();

  useFrame((state) => {
    const elapseTime = state.clock.elapsedTime;
    material.uniforms.uTime.value = elapseTime;
  });

  return (
    <>
      <mesh
        geometry={circleGeometry}
        material={material}
        position={[towerPositionX, normHeight + 0.01, towerPositionZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[normWidth, normWidth, 1]}
      />
    </>
  );
}

export function ArrowPlane({ normWidth, normHeight }: CommonProps) {
  const arrowPlaneRef = useRef<any>();
  const lookAtTagetRef = useRef<any>(new THREE.Vector3());
  const threeState = useThree();
  const material = ArrowPlaneMaterial();

  useFrame((state) => {
    const elapseTime = state.clock.elapsedTime;
    material.uniforms.uTime.value = elapseTime;

    if (arrowPlaneRef.current) {
      // Set target
      lookAtTagetRef.current.copy(threeState.camera.position);
      lookAtTagetRef.current.y = 0;

      // Apply target
      arrowPlaneRef.current.lookAt(lookAtTagetRef.current);
    }
  });

  return (
    <>
      <mesh
        ref={arrowPlaneRef}
        geometry={planeGeometry}
        material={material}
        position={[towerPositionX, normHeight / 2, towerPositionZ]}
        scale={[normWidth, normHeight, 1]}
      />
    </>
  );
}

export function MidPlane() {
  const mixerRef = useRef<any>();
  const sceneRef = useRef<any>();

  const [scene, setScene] = useState();

  const assets = useGlobalStore((state: any) => state.assets);
  const waveMaterial: any = useMemo(() => {
    const waveMaterial = new THREE.MeshStandardMaterial({
      color: "blue",
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    waveMaterial.onBeforeCompile = (shader) => {
      // -- shader へのアクセスに userDataを 経由する理由 --
      // Three.js の標準マテリアルは、
      // 内部的にシェーダーコードをコンパイルして利用するため
      // onBeforeCompile 内で生成された shader オブジェクトは
      // マテリアル外部へは公開されない仕様のため
      shader.uniforms.uTime = { value: 0.0 };
      waveMaterial.userData.shader = shader;

      // shader でのグローバルな値の宣言
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `#include <common>
        
        uniform float uTime;
        `,
      );

      // shader > vertexShader のコードを置換・拡張する処理
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
          #include <begin_vertex>

          float Math_PI = 3.141592653589793238462643383279502884197;
          

        /**
        * Distance
        */

        float period = 2.0;

        // 周期 period における進捗率 [0.0 => 1.0]
        float t = mod(uTime, period) / period;

        float r = t * sqrt(2.0) / 2.0; // [0.0 => (√2 / 2)]

        vec2 A = vec2(0.5); // uv中心
        vec2 B = uv.xy; // uv頂点座標

        float AB = distance(A, B);
        float d = 0.0; // 「uv頂点座標」と「それに最も近い円周上の頂点」との距離

        if (AB < r) {
            d = r - AB;
        } else if (AB == r) {
            d = 0.0;
        } else if (AB > r) {
            d = AB - r;
        }

        /**
        * Apply Intensity
        */

        // dは0から大きくなるほど波が小さくなる
        // d[0.0 - 0.1]で波があるとすると
        // 同区間で[1.0 - 0.0] の波の高さのIntensityが適当
        float waveHeightIntensity = 1.0 - smoothstep(0.0, 0.05, d);

        // 中心から遠ざかるほど指数関数的に減少
        waveHeightIntensity *= 1.0 / r;

        transformed.z -= waveHeightIntensity * 0.21;
        `,
      );
    };

    return waveMaterial;
  }, []);

  useEffect(() => {
    /**
     * Load Model
     */

    const midPlaneScene = assets.gltf.midPlane.scene.clone();

    midPlaneScene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.recieveShadow = true;
        child.transparent = true;
        child.renderOrder = 10;
      }
      sceneRef.current = midPlaneScene;
      setScene(sceneRef.current);
    });

    // glTF にアニメーションが含まれている場合の処理
    if (
      assets.gltf.midPlane.animations &&
      assets.gltf.midPlane.animations.length > 0
    ) {
      // AnimationMixer を gltf.scene を対象に作成し、mixerRef.current に保持する
      mixerRef.current = new THREE.AnimationMixer(sceneRef.current);
      // glTF に含まれるすべての AnimationClip をループ処理で Action として登録し再生開始する
      // アニメーションクリップという生のアニメーション情報を
      // clipActionメソッドで、AnimationMixerクラスのミキサーが扱えるよう変換して再生￥
      assets.gltf.midPlane.animations.forEach((clip: any) => {
        const action = mixerRef.current.clipAction(clip);
        action.play();
      });
    }
  }, []);
  useFrame((state, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta);
    if (waveMaterial.userData.shader) {
      waveMaterial.userData.shader.uniforms.uTime.value =
        state.clock.elapsedTime;
    }
  });

  return (
    <>
      {/* Wave Plane */}
      <mesh
        renderOrder={5}
        geometry={midPlaneGeometry}
        material={waveMaterial}
        // position={[61, -3.25 - 0.325, -62]}
        position={[towerPositionX, -3.5, towerPositionZ]}
        rotation={[Math.PI / 2, 0, -Math.PI * 0.2 - Math.PI / 4]}
        scale={[35.1, 35.1, 0.75]} // 0.1: Z-Fighting 防止
      />

      {/* Base Plane */}
      <mesh
        geometry={boxGeometry}
        material={
          new THREE.MeshBasicMaterial({
            color: "red",
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
          })
        }
        position={[towerPositionX, -3.25 - 0.325, towerPositionZ]}
        rotation={[Math.PI / 2, 0, -Math.PI * 0.2 - Math.PI / 4]}
        scale={[35.1, 35.1, 0.75]} // 0.1: Z-Fighting 防止
      />

      {/* Main Model */}
      {scene && (
        <primitive
          object={scene}
          position={[towerPositionX, -3.25, towerPositionZ]}
          rotation={[0, Math.PI * 0.2 - Math.PI / 4, 0]}
        />
      )}
    </>
  );
}

export function BottomCone() {
  const bottomHeight = 40;
  const bottomConePosition = new THREE.Vector3(
    towerPositionX,
    -bottomHeight / 3 - 10,
    towerPositionZ,
  );

  return (
    <>
      <mesh
        renderOrder={10}
        geometry={bottomConeGeometry}
        material={glassMaterial}
        position={bottomConePosition}
        rotation={[Math.PI, -Math.PI * 0.2, 0]}
      />
    </>
  );
}

export function InsideCone() {
  const bottomHeight = 40;
  const bottomConePosition = new THREE.Vector3(
    towerPositionX,
    -bottomHeight / 3 - 10,
    towerPositionZ,
  );
  const material = InsideConeMaterial();

  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;
    material.uniforms.uTime.value = elapsedTime;
  });

  return (
    <>
      <mesh
        geometry={bottomConeGeometry}
        material={material}
        position={bottomConePosition}
        rotation={[Math.PI, -Math.PI * 0.2, 0]}
        scale={0.8}
        receiveShadow
      />
    </>
  );
}

export function FresnelCone() {
  const bottomHeight = 40;
  const bottomConePosition = new THREE.Vector3(
    towerPositionX,
    -bottomHeight / 3 - 10,
    towerPositionZ,
  );
  const material = FresnelConeMaterial();

  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;
    material.uniforms.uTime.value = elapsedTime;
  });

  return (
    <>
      <mesh
        geometry={bottomConeGeometry}
        material={material}
        position={bottomConePosition}
        rotation={[Math.PI, -Math.PI * 0.2, 0]}
        scale={0.8001}
        receiveShadow
      />
    </>
  );
}

let isFirstTry = true;
export function Tower() {
  const animationRatioRef = useRef({ scale: 0 });

  const [normWidth, setNormWidth] = useState(35);
  const [normHeight, setNormHeight] = useState(10);
  const [animationRatio, setAnimationRatio] = useState({
    scale: isFirstTry ? 0 : 1,
  });

  const isIntroEnded = useSystemStore((state: any) => state.isIntroEnd);

  useEffect(() => {
    // if (isFirstTry) {
    if (isFirstTry && isIntroEnded) {
      isFirstTry = false;

      gsap.to(animationRatioRef.current, {
        duration: 8,
        scale: 1,
        ease: "power3.inOut",
        delay: 1,
        onUpdate: () => {
          setAnimationRatio({
            scale: animationRatioRef.current.scale,
          });
        },
      });
    }
  }, [isIntroEnded]);

  return (
    <group
      position={[0, 0, 0]}
      rotation={[0, Math.PI * 0.35, 0]}
      scale={animationRatio.scale}
    >
      <group position={[0, -2.5, 0]}>
        <TopCircle normWidth={normWidth} normHeight={normHeight} />
        <TopCirclePulse normWidth={normWidth} normHeight={normHeight} />
        <ArrowPlane normWidth={normWidth} normHeight={normHeight} />
      </group>

      <MidPlane />
      <BottomCone />
      <FresnelCone />
      <InsideCone />
    </group>
  );
}
