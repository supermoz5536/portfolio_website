import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import backGroundVertex from "./Materials/shaders/earthBackground/vertex.glsl";
import backGroundFragment from "./Materials/shaders/earthBackground/fragment.glsl";
import { EarthSphereMaterial } from "./Materials/EarthSphereMaterial";
import { getGui } from "../../util/lil-gui";
import { StarsMaterial } from "./Materials/StarsMaterial";
import { SunMaterial } from "./Materials/SunMaterial";
import { useGlobalStore } from "~/store/global/global_store";

type CommonProps = {
  sunPosition: THREE.Vector3;
  playerMoveRatio: number;
};

type SphereProps = CommonProps;
type UseCustomRenderProps = CommonProps;

type BackGroundProps = {
  textureSky: any;
  textureGround: any;
};
type GetSunPositionProps = { playerMoveRatio: number };
type StartsProps = { sunPosition: THREE.Vector3 };
type SunPositionProps = {
  sunPosition: THREE.Vector3;
  playerPosition: THREE.Vector3;
};

/**
 * Geometry / Material
 */
const startsGeometry = new THREE.BufferGeometry();

const sunGeometry = new THREE.CircleGeometry(20);
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  blending: THREE.AdditiveBlending, // 加算ブレンドを適用
});

export function useCustomRenderSky({
  sunPosition,
  playerMoveRatio,
}: UseCustomRenderProps) {
  const state = useThree();
  const customRender = useRef<any>({});
  const sphere = Sphere({ sunPosition, playerMoveRatio });

  useEffect(() => {
    /**
     * Setup Custom Render
     */
    customRender.current.scene = new THREE.Scene();

    customRender.current.camera = state.camera.clone();
    customRender.current.camera.quaternion.copy(state.camera.quaternion);
    customRender.current.camera.position.copy(state.camera.position);

    customRender.current.resolutionRatio = 0.1;
    customRender.current.renderTarget = new THREE.RenderTarget(
      window.innerWidth * customRender.current.resolutionRatio,
      window.innerHeight * customRender.current.resolutionRatio,
      // Options
      //    generateMipmaps: 遠くのオブジェクトがぼやけるように自動で解像度を落とす
      //    パフォーマンス最適化のために無効化
      { generateMipmaps: false },
    );

    customRender.current.texture = customRender.current.renderTarget.texture;

    customRender.current.scene.add(sphere);
  }, []);

  useFrame(() => {
    // cunstomRenderを同じ視点で描画させるため、通常カメラと回転角を同期
    customRender.current.camera.quaternion.copy(state.camera.quaternion);
    customRender.current.camera.position.copy(state.camera.position);

    // レンダーターゲットを解像度を下げた customRender に設定
    state.gl.setRenderTarget(customRender.current.renderTarget);
    // レンダーのセットアップ
    state.gl.render(customRender.current.scene, customRender.current.camera);
    // 通常のレンダーに設定を切り替え（さもないと通常のプレイ画面が描画されない）
    state.gl.setRenderTarget(null);
  });

  return customRender.current;
}

export function useCustomRenderGround() {
  const state = useThree();
  const customRender = useRef<any>({});
  const ground = Ground();

  useEffect(() => {
    /**
     * Setup Custom Render
     */
    customRender.current.scene = new THREE.Scene();

    customRender.current.camera = state.camera.clone();
    customRender.current.camera.quaternion.copy(state.camera.quaternion);
    customRender.current.camera.position.copy(state.camera.position);

    customRender.current.resolutionRatio = 0.5;
    customRender.current.renderTarget = new THREE.RenderTarget(
      window.innerWidth * customRender.current.resolutionRatio,
      window.innerHeight * customRender.current.resolutionRatio,
      // Options
      //    generateMipmaps: 遠くのオブジェクトがぼやけるように自動で解像度を落とす
      //    パフォーマンス最適化のために無効化
      { generateMipmaps: false },
    );

    customRender.current.texture = customRender.current.renderTarget.texture;

    customRender.current.scene.add(ground);
  }, []);

  useFrame(() => {
    // cunstomRenderを同じ視点で描画させるため、通常カメラと回転角を同期
    customRender.current.camera.quaternion.copy(state.camera.quaternion);
    customRender.current.camera.position.copy(state.camera.position);

    // レンダーターゲットを解像度を下げた customRender に設定
    state.gl.setRenderTarget(customRender.current.renderTarget);
    // レンダーのセットアップ
    state.gl.render(customRender.current.scene, customRender.current.camera);
    // 通常のレンダーに設定を切り替え（さもないと通常のプレイ画面が描画されない）
    state.gl.setRenderTarget(null);
  });

  return customRender.current;
}

export function getSunPosition({ playerMoveRatio }: GetSunPositionProps) {
  const sunDistance = 1000;

  const sunPosition = new THREE.Vector3(128, 0, 192);
  sunPosition.setFromSphericalCoords(
    sunDistance,
    // phi [π → 1/3π]
    ((1 - playerMoveRatio) * (2 / 3) + 1 / 3) * Math.PI,
    // theta [-1/4π → 3/4π] [starts at ＋z]
    ((1 - playerMoveRatio) * (-5 / 4) + (3 - 0.5 / 4)) * Math.PI,
  );

  return sunPosition;
}

export function Background({ textureSky, textureGround }: BackGroundProps) {
  const state = useThree();
  const backGroundRef = useRef<any>();
  const materialRef = useRef<any>(
    new THREE.ShaderMaterial({
      uniforms: {
        uTextureSky: { value: null },
        uTextureGround: { value: null },
        uIsMobile: { value: true },
        uLowStep: { value: 0.5 },
      },
      vertexShader: backGroundVertex,
      fragmentShader: backGroundFragment,
      depthWrite: false, // 深度情報を保存しない（比較対象にならない）
      depthTest: false, // 他の obj との深度値の比較を行わない
    }),
  );

  const [isMounted, setIsMounted] = useState(false);

  const isMobile = useGlobalStore((state) => state.isMobile);

  useEffect(() => {
    setIsMounted(true);
    if (backGroundRef.current) {
      backGroundRef.current.material.uniforms.uTextureSky.value = textureSky;
      backGroundRef.current.material.uniforms.uTextureGround.value = textureGround; // prettier-ignore
      backGroundRef.current.material.uniforms.uIsMobile.value = isMobile;
    }
  }, [textureSky, textureGround]);

  useFrame(() => {
    if (backGroundRef.current) {
      /**
       * Set LowStep
       */
      const Euler = new THREE.Euler().setFromQuaternion(
        state.camera.quaternion,
        "YXZ",
      );
      const angleX = Euler.x;
      const initGap = 0.19739555984989393;
      const initOffset = 0.01;
      const adjustedAngleX = angleX + initGap + initOffset;
      const maxAngle = 0.8257140905678528;
      const adjustedOffset = ((adjustedAngleX * 2.125) / maxAngle) * 0.5; // [0.0 - 0.5]
      const adjustedLowStep = 0.5 - adjustedOffset; // [0.5 - 0.0]

      backGroundRef.current.material.uniforms.uLowStep.value = adjustedLowStep // prettier-ignore

      /**
       * Set Background
       */

      if (state.camera instanceof THREE.PerspectiveCamera) {
        // 三角関数で計算するためにfovを度数からラジアンに変換
        const fovInRadian = (state.camera.fov * Math.PI) / 180;
        // ZoomIn時に距離の余裕がないとカメラの移動に間に合わず衝突する
        const offset = 40;

        // カメラからプレーンまでオフセットしたときの画面高さ・幅を計算
        const planeHeight = 2 * offset * Math.tan(fovInRadian / 2); // (高さ) =(底辺) x tanθ
        const planeWidth = planeHeight * state.camera.aspect;

        // PlaneGeometry(1,1) を基準に、画面サイズに一致するよう調整
        backGroundRef.current.scale.set(planeWidth, planeHeight, 1);

        // Plane をカメラ前方のオフセット後の位置に移動
        backGroundRef.current.position.copy(state.camera.position);
        const normalizedDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
          state.camera.quaternion,
        );
        backGroundRef.current.position.addScaledVector(
          normalizedDirection,
          offset,
        );

        // カメラの向きに合わせて回転を同期
        backGroundRef.current.quaternion.copy(state.camera.quaternion);
      }
    }
  });

  return (
    <>
      {isMounted && (
        <mesh
          ref={backGroundRef}
          geometry={new THREE.PlaneGeometry(1, 1)}
          material={materialRef.current}
          frustumCulled={false}
          // depthWrite と　depthTest が両方 false なので
          // 奥行きという基準がなくなり、完全に配置順によってのみ前後関係が決定され
          // 配置された瞬間に1番手前に描画されるので
          // 背景ば一番最初に配置されるよう順序指定する必要がある
          renderOrder={-1}
        />
      )}
    </>
  );
}

export function Sphere({ sunPosition, playerMoveRatio }: SphereProps) {
  const geometryRef = useRef<any>(new THREE.SphereGeometry(1000, 128, 64));
  const materialRef = useRef<any>(EarthSphereMaterial());
  const geometry = geometryRef.current;
  const material = materialRef.current;

  const mesh = new THREE.Mesh(geometry, material);
  const gui = getGui();

  // const testRatio = 0.5;
  // const rescaledPlayerMoveRatio = testRatio * 0.75 + 0.25;
  const rescaledPlayerMoveRatio = playerMoveRatio * 0.75 + 0.25;

  useEffect(() => {
    /**
     * Setup Material
     */
    material.uniforms.uColorDayCycleLow.value.set("#f0fff9");
    material.uniforms.uColorDayCycleHigh.value.set("#2e89ff");

    material.uniforms.uColorNightLow.value.set("#004794");
    material.uniforms.uColorNightHigh.value.set("#001624");

    material.uniforms.uSunColor.value.set("#ff531a");
    material.side = THREE.BackSide;

    /**
     * lil-gui
     */
    if (gui) {
      const controller1 =
      gui
      .add(material.uniforms.uSunBaseIntensityMultiplier, "value", 0, 1, 0.001)
      .name("uSunBaseIntensityMultiplier"); // prettier-ignore

      const controller2 =
      gui
        .add(material.uniforms.uSunLayerIntensityMultiplier, "value", 0, 1, 0.001)
        .name("uSunLayerIntensityMultiplier"); // prettier-ignore

      const controller3 =
      gui
        .add(material.uniforms.uAtomAngleIntensityMultiplier, "value", 0, 1, 0.001)
        .name("uAtomAngleIntensityMultiplier"); // prettier-ignore

      const controller4 =
      gui
        .add(material.uniforms.uAtomElevationIntensityMultiplier, "value", 0, 1, 0.001) 
        .name("uAtomElevationIntensityMultiplier"); // prettier-ignore

      const controller5 =
      gui
        .add(material.uniforms.uAtomDayCycleIntensityMultiplier, "value", 0, 1, 0.001) 
        .name("uAtomDayCycleIntensityMultiplier"); // prettier-ignore

      const controller6 =
      gui
        .add(material.uniforms.uDayCycleProgress, "value", 0, 1, 0.001)
        .name("uDayCycleProgress"); // prettier-ignore

      return () => {
        controller1.destroy();
        controller2.destroy();
        controller3.destroy();
        controller4.destroy();
        controller5.destroy();
        controller6.destroy();
      };
    }
  }, []);

  useEffect(() => {
    /**
     * Update Material
     */

    material.uniforms.uDayCycleProgress.value = 0.4;
    // material.uniforms.uDayCycleProgress.value = rescaledPlayerMoveRatio;
    material.uniforms.uSunPosition.value.copy(sunPosition);
  }, [sunPosition, rescaledPlayerMoveRatio]);

  return mesh;
}

export function Ground() {
  const meshRef = useRef(
    new THREE.Mesh(
      new THREE.CircleGeometry(4000),
      new THREE.MeshBasicMaterial(),
    ),
  );

  const assets = useGlobalStore((state: any) => state.assets);

  useEffect(() => {
    const groundTexture = assets.texture.ground;

    meshRef.current.material.map = groundTexture;
    meshRef.current.position.set(0, -500, 0);
    meshRef.current.rotation.set(-Math.PI / 2, 0, 0);
  }, []);

  return meshRef.current;
}

export function Stars({ sunPosition }: StartsProps) {
  const starsRef = useRef<any>();
  const starsMaterial = StarsMaterial();
  starsMaterial.uniforms.uSunPosition.value.copy(sunPosition);

  const distanceFromOriginToStars = 1000;
  const counts = 600;
  const positionArray: any = new Float32Array(counts * 3);
  const colorArray: any = new Float32Array(counts * 3);
  const sizeArray: any = new Float32Array(counts);

  useEffect(() => {
    if (starsRef.current) {
      for (let i = 0; i < counts; i++) {
        const iOffset = i * 3;

        /**
         * Set Random Postion
         */
        //　球体表面の上半分にランダムな座標を生成する
        const position = new THREE.Vector3();
        position.setFromSphericalCoords(
          distanceFromOriginToStars, // radius
          Math.acos(Math.random()), // phi
          Math.PI * 2 * Math.random(), // theta
        );

        positionArray[iOffset] = position.x;
        positionArray[iOffset + 1] = position.y;
        positionArray[iOffset + 2] = position.z;

        /**
         * Set Random Color
         */

        const aColor = new THREE.Color();

        aColor.setHSL(Math.random(), 1, 0.5 + Math.random() * 0.5);

        colorArray[iOffset] = aColor.r;
        colorArray[iOffset + 1] = aColor.g;
        colorArray[iOffset + 2] = aColor.b;

        /**
         * Set Random Size
         */
        const aSize = Math.pow(Math.random() * 0.9, 10) + 0.1;

        sizeArray[iOffset] = aSize;
      }

      starsRef.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positionArray, 3),
      );

      starsRef.current.geometry.setAttribute(
        "aColor",
        new THREE.BufferAttribute(colorArray, 3),
      );

      starsRef.current.geometry.setAttribute(
        "aSize",
        new THREE.BufferAttribute(sizeArray, 1),
      );
    }
  }, []);

  return (
    <>
      <points
        ref={starsRef} // prettier-ignore
        geometry={startsGeometry}
        material={starsMaterial}
      />
    </>
  );
}

export function Sun({ sunPosition, playerPosition }: SunPositionProps) {
  const sunRef = useRef<any>();
  const materialRef = useRef<any>(SunMaterial());

  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (sunRef.current && sunPosition) {
      setPosition(sunPosition);
      materialRef.current.uniforms.uSunPosition.value = sunPosition;

      sunRef.current.lookAt(playerPosition);
    }
  }, [sunPosition, playerPosition]);

  return (
    <>
      <mesh
        ref={sunRef}
        geometry={sunGeometry}
        material={materialRef.current}
        position={position}
      />
      ;
    </>
  );
}

export function Earth() {
  const endPosition = new THREE.Vector3(128, 0, 192);
  const gui = getGui();

  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3());
  const [playerMoveRatio, setPlayerMoveRatio] = useState(0.5);

  const [sunPosition, setSunPosition] = useState(new THREE.Vector3());

  const [bgTextureSky, setBgTextureSky] = useState();
  const [bgTextureGround, setBgTextureGround] = useState();

  const isMobile = useGlobalStore((state) => state.isMobile);

  /**
   * Setup Custom Render
   */

  const customRenderSky = useCustomRenderSky({
    sunPosition: sunPosition,
    playerMoveRatio: playerMoveRatio,
  });

  const customRenderGround = useCustomRenderGround();

  useEffect(() => {
    /**
     * Setup Texture
     */

    setBgTextureSky(customRenderSky.texture);
    setBgTextureGround(customRenderGround.texture);

    /*
     * Player Position
     */

    // const unsubscibePlayer = ThreePlayer.subscribe(
    //   (state: any) => state.currentPosition,
    //   (currentPosition) => {
    //     const playerMoveRatio =
    //       (currentPosition.x / endPosition.x -
    //         currentPosition.z / endPosition.z) / 2; // prettier-ignore

    //     setPlayerPosition(currentPosition);
    //     setPlayerMoveRatio(playerMoveRatio);
    //   },
    // );

    return () => {
      // unsubscibePlayer();
    };
  }, []);

  /**
   * Sun Position
   */
  useEffect(() => {
    setSunPosition(getSunPosition({ playerMoveRatio: playerMoveRatio }));
  }, [playerMoveRatio]);

  /**
   * Debug
   */
  useEffect(() => {
    if (gui) {
      const controller = gui
        .add({ playerMoveRatio }, "playerMoveRatio", 0, 1, 0.001)
        .name("Player Move Ratio")
        .onChange((value: number) => {
          setPlayerMoveRatio(value);
        });

      // クリーンアップ時にコントローラーを削除
      return () => {
        controller.destroy();
      };
    }
  }, []);

  return (
    <>
      <Background textureSky={bgTextureSky} textureGround={bgTextureGround} />
      {/* {isMobile || <Stars sunPosition={new THREE.Vector3(1, 1, 1)} />} */}
      <Stars sunPosition={new THREE.Vector3(1, 1, 1)} />
      {/* <Sun sunPosition={sunPosition} playerPosition={playerPosition} /> */}
    </>
  );
}
