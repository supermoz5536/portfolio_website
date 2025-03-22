import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSystemStore } from "~/store/scene2/system_store";
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
            blending: THREE.AdditiveBlending,
          })
        }
        position={[61, normHeight, -62]}
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
        position={[61, normHeight + 0.01, -62]}
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
        position={[61, normHeight / 2, -62]}
        scale={[normWidth, normHeight, 1]}
      />
    </>
  );
}

export function MidPlane() {
  const mixerRef = useRef<any>();
  const [scene, setScene] = useState();
  const loadingManager = useGlobalStore((state) => state.loadingManager);

  const waveMaterial: any = useMemo(() => {
    const waveMaterial = new THREE.MeshStandardMaterial({
      color: "blue",
      transparent: true,
      opacity: 0.7,
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
     * Loader
     */

    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader(loadingManager);
    dracoLoader.setDecoderPath("/draco/");
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load("/asset/model/midPlane.glb", (gltf: any) => {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.recieveShadow = true;
        }
        setScene(gltf.scene);
      });

      // glTF にアニメーションが含まれている場合の処理
      if (gltf.animations && gltf.animations.length > 0) {
        // AnimationMixer を gltf.scene を対象に作成し、mixerRef.current に保持する
        mixerRef.current = new THREE.AnimationMixer(gltf.scene);
        // glTF に含まれるすべての AnimationClip をループ処理で Action として登録し再生開始する
        // アニメーションクリップという生のアニメーション情報を
        // clipActionメソッドで、AnimationMixerクラスのミキサーが扱えるよう変換して再生￥
        gltf.animations.forEach((clip: any) => {
          const action = mixerRef.current.clipAction(clip);
          action.play();
        });
      }
    });
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
        geometry={midPlaneGeometry}
        material={waveMaterial}
        // position={[61, -3.25 - 0.325, -62]}
        position={[61, -3.5, -62]}
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
        position={[61, -3.25 - 0.325, -62]}
        rotation={[Math.PI / 2, 0, -Math.PI * 0.2 - Math.PI / 4]}
        scale={[35.1, 35.1, 0.75]} // 0.1: Z-Fighting 防止
      />
      {/* Main Model */}
      {scene && (
        <primitive
          object={scene}
          position={[61, -3.25, -62]}
          rotation={[0, Math.PI * 0.2 - Math.PI / 4, 0]}
        />
      )}
    </>
  );
}

export function BottomCone() {
  const bottomHeight = 40;
  const bottomConePosition = new THREE.Vector3(61, -bottomHeight / 3 - 10, -62);

  return (
    <>
      <mesh
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
  const bottomConePosition = new THREE.Vector3(61, -bottomHeight / 3 - 10, -62);
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
  const bottomConePosition = new THREE.Vector3(61, -bottomHeight / 3 - 10, -62);
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

export function Tower() {
  const state = useThree();
  const cameraBasePosition = new THREE.Vector3(61, -23, -62);

  const isMobile = useGlobalStore((state) => state.isMobile);
  const currentPosition = ThreePlayerStore((state: any) => state.currentPosition); // prettier-ignore
  const setIsPlayerFocus = useSystemStore((state: any) => state.setIsPlayerFocus); // prettier-ignore
  const setIsContentSelectedMouseDown = ThreeContentsStore((state: any) => state.setIsContentSelectedMouseDown); // prettier-ignore

  const [isDown, setIsDown] = useState(false);
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [isTouchMoveOn, setIsTouchMoveOn] = useState(false);
  const [normWidth, setNormWidth] = useState(40);
  const [normHeight, setNormHeight] = useState(10);

  const [lerpCamera, setLeapCamera] = useState(
    new THREE.Vector3(
      cameraBasePosition.x, // prettier-ignore
      cameraBasePosition.y + 10,
      cameraBasePosition.z + 27,
    ),
  );

  const [lerpCameraTarget, setLeapCameraTarget] = useState(
    new THREE.Vector3(
      cameraBasePosition.x, // prettier-ignore
      cameraBasePosition.y,
      cameraBasePosition.z - 4.25,
    ),
  );

  useEffect(() => {
    /**
     * Add Listener
     */

    const unsubscribeIsPlayerFocused = useSystemStore.subscribe(
      (state: any) => state.isPlayerFocused,
      (value) => {
        if (value == true) handleZoomOut();
      },
    );

    const unsubscribeCurrentFloorNum = ThreePlayerStore.subscribe(
      (state: any) => state.currentFloorNum,
      (value) => {
        if (floorsRow0.includes(value)) {
          setNormHeight(10);
          setNormWidth(40);
        } else if (floorsRow1.includes(value)) {
          setNormHeight(20);
          setNormWidth(30);
        } else if (floorsRow2.includes(value)) {
          setNormHeight(30);
          setNormWidth(20);
        } else if (floorsRow3.includes(value)) {
          setNormHeight(40);
          setNormWidth(10);
        }
      },
    );

    //該当コンテンツ外でマウス/タップがキャンセルされた際の初期化
    const handleMouseUp = () => setIsDown(false);
    const handleTouchEnd = () => setIsDown(false);
    const handleTouchCancel = () => setIsDown(false);

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchCancel);

    return () => {
      unsubscribeIsPlayerFocused();
      unsubscribeCurrentFloorNum();
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, []);

  useFrame((state, delta) => {
    /**
     * Desktop
     */

    if (isZoomIn && !isMobile) {
      /**
       * Position Camera
       */
      const endPositionCamera = new THREE.Vector3(
        cameraBasePosition.x - 40, // prettier-ignore
        cameraBasePosition.y + 40,
        cameraBasePosition.z + 85,
      );

      lerpCamera.lerp(endPositionCamera, 5 * delta);

      state.camera.position.set(
        lerpCamera.x, // prettier-ignore
        lerpCamera.y,
        lerpCamera.z,
      );

      /**
       * Position Camera Target
       */

      const endCameratarget = new THREE.Vector3(
        cameraBasePosition.x, // prettier-ignore
        cameraBasePosition.y + 20,
        cameraBasePosition.z,
      );

      lerpCameraTarget.lerp(endCameratarget, 5 * delta);

      state.camera.lookAt(
        lerpCameraTarget.x, // prettier-ignore
        lerpCameraTarget.y,
        lerpCameraTarget.z,
      );
    }

    /**
     * Mobile
     */

    if (isZoomIn && isMobile) {
      /**
       * Position Camera
       */
      const endPositionCamera = new THREE.Vector3(
        cameraBasePosition.x - 45, // prettier-ignore
        cameraBasePosition.y + 45,
        cameraBasePosition.z + 120,
      );

      lerpCamera.lerp(endPositionCamera, 5 * delta);

      state.camera.position.set(
        lerpCamera.x, // prettier-ignore
        lerpCamera.y,
        lerpCamera.z,
      );

      /**
       * Position Camera Target
       */

      const endCameratarget = new THREE.Vector3(
        cameraBasePosition.x, // prettier-ignore
        cameraBasePosition.y + 15,
        cameraBasePosition.z,
      );

      lerpCameraTarget.lerp(endCameratarget, 5 * delta);

      state.camera.lookAt(
        lerpCameraTarget.x, // prettier-ignore
        lerpCameraTarget.y,
        lerpCameraTarget.z,
      );
    }
  });

  const handlePointerDown = () => {
    setIsDown(true);
    setIsContentSelectedMouseDown(true);
  };

  const handleZoomIn = () => {
    if (isDown && !isZoomIn && !isTouchMoveOn) {
      setIsDown(false);
      setIsContentSelectedMouseDown(false);
      setIsPlayerFocus(false);
      setIsZoomIn(true);

      /**
       * Update to Current Camera Position
       */

      setLeapCamera(state.camera.position.clone());

      /**
       * Update to Current Camera Target Position
       */

      const cameraTargetPosition = state.camera.position.clone();

      // Direction
      const forwardDir: any = new THREE.Vector3();
      forwardDir.subVectors(currentPosition, state.camera.position);
      forwardDir.y = 0;
      forwardDir.normalize();

      // Player に照準
      cameraTargetPosition.y -= 5;
      cameraTargetPosition.add(forwardDir.multiplyScalar(15));

      // cameraTarget に照準
      cameraTargetPosition.add(forwardDir.multiplyScalar(10));

      setLeapCameraTarget(cameraTargetPosition);
    }
  };

  const handleZoomOut = () => {
    setIsZoomIn(false);
    setIsPlayerFocus(true);
  };

  return (
    <group
      onPointerDown={handlePointerDown}
      onPointerUp={handleZoomIn}
      position={[15, 7, 10]}
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
