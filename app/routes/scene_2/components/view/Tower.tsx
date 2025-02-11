import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useSystemStore } from "~/store/system_store";
import ThreePlayerStore from "../../../../store/three_player_store";
import ThreeContentsStore from "../../../../store/three_contents_store";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { ArrowPlaneMaterial } from "./Materials/ArrowPlaneMaterial";
import { TopCirclePulseMaterial } from "./Materials/TopCirclePulseMaterial";
import { InsideConeMaterial } from "./Materials/InsideConeMaterial";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { FresnelConeMaterial } from "./Materials/FresnelConeMaterial";

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

/**
 * Loader
 */

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader);

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
  const [scene, setScene] = useState();
  const mixerRef = useRef<any>();

  useEffect(() => {
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
    if (mixerRef.current) {
      // update(): 引数の数値ごとにミキサー内のアニメーションを更新
      mixerRef.current.update(delta);
    }
  });

  return (
    <>
      {scene && (
        <primitive
          object={scene}
          position={[61, -3.25, -62]}
          rotation={[0, Math.PI * 0.2 - Math.PI / 4, 0]}
        />
      )}

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

  const setIsPlayerFocus = useSystemStore((state: any) => state.setIsPlayerFocus); // prettier-ignore
  const currentPosition = ThreePlayerStore((state: any) => state.currentPosition); // prettier-ignore
  const setIsContentSelectedMouseDown = ThreeContentsStore((state: any) => state.setIsContentSelectedMouseDown); // prettier-ignore

  const [isDown, setIsDown] = useState(false);
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
     * Device Setup
     */

    if (typeof window !== "undefined") {
      if (window.innerWidth < 500) setIsMobile(true);
      if (window.innerWidth >= 500) setIsMobile(false);
    }

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
      position={[0, -12.5, 0]}
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
