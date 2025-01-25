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

type BackGroundProps = {
  texture: any;
};

type SunDataProps = {
  sunPosition?: THREE.Vector3;
  playerMoveRatio?: number;
  playerPosition?: THREE.Vector3;
};

const startsGeometry = new THREE.BufferGeometry();

const sunGeometry = new THREE.CircleGeometry(70);
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  blending: THREE.AdditiveBlending, // 加算ブレンドを適用
});

export function useCustomRender({
  sunPosition,
  playerMoveRatio,
}: SunDataProps) {
  const state = useThree();
  const customRender = useRef<any>({});
  const sphere = Sphere({ sunPosition, playerMoveRatio });

  useEffect(() => {
    /**
     * Setup Custom Render
     */
    customRender.current.scene = new THREE.Scene();
    customRender.current.camera = new THREE.OrthographicCamera(
      -1, // left
      1, // right
      1, // top
      -1, // bottom
      0.1, // near
      4000, // far
    );
    // customRender.current.camera.position.copy(state.camera.position);
    customRender.current.camera.quaternion.copy(state.camera.quaternion);

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
    // レンダーターゲットを解像度を下げた customRender に設定
    state.gl.setRenderTarget(customRender.current.renderTarget);
    // レンダーのセットアップ
    state.gl.render(customRender.current.scene, customRender.current.camera);
    // 通常のレンダーに設定を切り替え（さもないと通常のプレイ画面が描画されない）
    state.gl.setRenderTarget(null);
  });

  return customRender.current;
}

export function getUniformsData({ playerPosition }: SunDataProps) {
  const sunDistance = 3500;
  const endPosition = new THREE.Vector3(128, 0, 192);
  const result: any = {};

  if (playerPosition) {
    result.playerMoveRatio =
      (playerPosition.x / endPosition.x - playerPosition.z / endPosition.z) / 2;
  }

  // phiの角度にplayerMoveRatioとの依存関係を持たせる
  const sunPosition = new THREE.Vector3(0, 0, 0);
  sunPosition.setFromSphericalCoords(
    sunDistance, // prettier-ignore
    -Math.PI / 3,
    0,
  );

  result.sunPosition = sunPosition;

  return result;
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

export function Sphere({ sunPosition, playerMoveRatio }: SunDataProps) {
  const geometryRef = useRef<any>(new THREE.SphereGeometry(4, 128, 64));
  const materialRef = useRef<any>(SkySphereMaterial());
  const geometry = geometryRef.current;
  const material = materialRef.current;

  const mesh = new THREE.Mesh(geometry, material);
  const gui = getGui();

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
    material.uniforms.uDayCycleProgress.value = playerMoveRatio;
    material.uniforms.uSunPosition.value.copy(sunPosition);
  }, [sunPosition, playerMoveRatio]);

  return mesh;
}

export function Stars({ sunPosition }: SunDataProps) {
  const starsRef = useRef<any>();
  const starsMaterial = StarsMaterial();

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

export function Sun({ sunPosition, playerPosition }: SunDataProps) {
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
  /**
   * States
   */

  const [bgTexture, setBgTexture] = useState();

  const [sunData, setSunData] = useState({
    playerMoveRatio: 0,
    sunPosition: new THREE.Vector3(),
  });

  const [playerPosition, setPlayerPosition] = 
    useState(new THREE.Vector3(0, 0, 7)); // prettier-ignore

  /**
   * Setup Custom Render
   */

  const customRender = useCustomRender({
    sunPosition: sunData.sunPosition,
    playerMoveRatio: sunData.playerMoveRatio,
  });

  useEffect(() => {
    setBgTexture(customRender.texture);

    /*
     * Listem Player Position
     */

    const unsubscibePlayer = ThreePlayer.subscribe(
      (state: any) => state.currentPosition,
      (currentPosition) => {
        setPlayerPosition(currentPosition);
      },
    );

    return () => {
      unsubscibePlayer();
    };
  }, []);

  useFrame(() => {
    setSunData(getUniformsData({ playerPosition }));
  });

  /// まずは静的ポジションで太陽に依存関係を持たせる
  // useFrame内で太陽のposition情報を計算し
  // その内容をいかにProsで送る
  // Background → Sphere: 太陽の高さ？でprogressの値を制御して背景色を更新
  // Starts → materialでuSize更新

  /// 太陽のポジションを FloorNumを監視して動的に変更する
  // 関数を作ってSkyのトップレベルで呼び出し

  return (
    <>
      <Background texture={bgTexture} />
      <Stars sunPosition={sunData.sunPosition} />
      <Sun sunPosition={sunData.sunPosition} playerPosition={playerPosition} />
    </>
  );
}
