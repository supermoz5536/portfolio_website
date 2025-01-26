import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import backGroundVertex from "./Materials/shaders/skyBackground/vertex.glsl";
import backGroundFragment from "./Materials/shaders/skyBackground/fragment.glsl";
import { SkySphereMaterial } from "./Materials/SkySphereMaterial";
import { getGui } from "../../util/lil-gui";
import { vec3 } from "three/webgpu";
import { Point } from "@react-three/drei";
import { StarsMaterial } from "./Materials/StarsMaterial";
import ThreePlayer from "../../../../store/three_player_store";

type CommonProps = {
  sunPosition: THREE.Vector3;
  playerMoveRatio: number;
};

type SphereProps = CommonProps;
type UseCustomRenderProps = CommonProps;

type BackGroundProps = { texture: any };
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

const sunGeometry = new THREE.CircleGeometry(40);
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  blending: THREE.AdditiveBlending, // 加算ブレンドを適用
});

export function useCustomRender({
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

export function getSunPosition({ playerMoveRatio }: GetSunPositionProps) {
  const sunDistance = 3850;

  const sunPosition = new THREE.Vector3(128, 0, 192);
  sunPosition.setFromSphericalCoords(
    sunDistance,
    -((1 - playerMoveRatio) * (5 / 4 - 1 / 4) + 1 / 4) * Math.PI, // [-(-5/4π → 1/4π)] phi
    -((1 - playerMoveRatio) * (-7 / 4 + 1 / 4) + 1 / 10) * Math.PI, // [-(-6/4π → (1/4 + 1/10)π)] theta
  );

  return sunPosition;
}

export function Background({ texture }: BackGroundProps) {
  const backGroundRef = useRef<any>();
  const materialRef = useRef<any>(
    new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
      },
      vertexShader: backGroundVertex,
      fragmentShader: backGroundFragment,
      depthWrite: false, // 深度情報を保存しない（比較対象にならない）
      depthTest: false, // 他の obj との深度値の比較を行わない
    }),
  );

  const [isMounted, setIsMounted] = useState(false);

  const state = useThree();

  useEffect(() => {
    setIsMounted(true);
    if (backGroundRef.current) {
      backGroundRef.current.material.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  useFrame(() => {
    // パースペクティブカメラかどうかチェック
    if (
      state.camera instanceof THREE.PerspectiveCamera &&
      backGroundRef.current
    ) {
      // 三角関数で計算するためにfovを度数からラジアンに変換
      const fovInRadian = (state.camera.fov * Math.PI) / 180;
      const offset = 0.15;

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
  const materialRef = useRef<any>(SkySphereMaterial());
  const geometry = geometryRef.current;
  const material = materialRef.current;

  const mesh = new THREE.Mesh(geometry, material);
  const gui = getGui();

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
      gui
        .add(material.uniforms.uDayCycleProgress, "value", 0, 1, 0.001)
        .name("uDayCycleProgress");
    }
  }, []);

  useEffect(() => {
    /**
     * Update Material
     */
    material.uniforms.uDayCycleProgress.value = rescaledPlayerMoveRatio;
    material.uniforms.uSunPosition.value.copy(sunPosition);
  }, [sunPosition, rescaledPlayerMoveRatio]);

  return mesh;
}

export function Ground() {
  const [texture, setTexture] = useState<any>();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const groundTexture = textureLoader.load("asset/texture/ground.jpg");
    setTexture(groundTexture);
  }, []);

  return (
    <mesh
      geometry={new THREE.CircleGeometry(5000)}
      material={new THREE.MeshBasicMaterial({ map: texture })}
      position={[0, -500, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  );
}

export function Stars({ sunPosition }: StartsProps) {
  const starsRef = useRef<any>();
  const starsMaterial = StarsMaterial();
  starsMaterial.uniforms.uSunPosition.value.copy(sunPosition);

  const distanceFromOriginToStars = 1000;
  const counts = 1000;
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
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    // 後ほどlerp処理に変更
    if (sunRef.current && sunPosition) {
      setPosition(sunPosition);
      sunRef.current.lookAt(playerPosition);
    }
  }, [sunPosition, playerPosition]);

  return (
    <>
      <mesh
        ref={sunRef}
        geometry={sunGeometry}
        material={sunMaterial}
        position={position}
      />
      ;
    </>
  );
}

export function Sky() {
  const endPosition = new THREE.Vector3(128, 0, 192);
  const gui = getGui();

  const [bgTexture, setBgTexture] = useState();
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3());
  const [playerMoveRatio, setPlayerMoveRatio] = useState(0);
  const [sunPosition, setSunPosition] = useState(new THREE.Vector3());

  /**
   * Setup Custom Render
   */

  const customRender = useCustomRender({
    sunPosition: sunPosition,
    playerMoveRatio: playerMoveRatio,
  });

  useEffect(() => {
    /**
     * Texture
     */

    setBgTexture(customRender.texture);

    /*
     * Player Position
     */

    const unsubscibePlayer = ThreePlayer.subscribe(
      (state: any) => state.currentPosition,
      (currentPosition) => {
        const playerMoveRatio =
          (currentPosition.x / endPosition.x -
            currentPosition.z / endPosition.z) /
          2;

        setPlayerPosition(currentPosition);
        // setPlayerMoveRatio(playerMoveRatio);
      },
    );

    return () => {
      unsubscibePlayer();
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
      {/* <Ground /> */}
      <Background texture={bgTexture} />
      <Stars sunPosition={sunPosition} />
      <Sun sunPosition={sunPosition} playerPosition={playerPosition} />
    </>
  );
}
