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

type BackGroundProps = {
  texture: any;
};

const startsGeometry = new THREE.BufferGeometry();

export function useCustomRender() {
  const state = useThree();
  const customRender = useRef<any>({});
  const sphere = Sphere();

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

export function Sphere() {
  const geometry = new THREE.SphereGeometry(4, 128, 64);

  const material = SkySphereMaterial();
  material.uniforms.uColorDayCycleLow.value.set("#f0fff9");
  material.uniforms.uColorDayCycleHigh.value.set("#2e89ff");
  material.uniforms.uColorNightLow.value.set("#004794");
  material.uniforms.uColorNightHigh.value.set("#001624");
  material.uniforms.uDayCycleProgress.value = 0.533;
  material.side = THREE.BackSide;

  const mesh = new THREE.Mesh(geometry, material);

  const gui = getGui();

  useEffect(() => {
    /**
     * lil-gui
     */
    if (gui) {
      gui
        .add(material.uniforms.uDayCycleProgress, "value", 0, 1, 0.001)
        .name("uDayCycleProgress");
    }
  }, []);

  return mesh;
}

export function Stars() {
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

export function Sky() {
  const [bgTexture, setBgTexture] = useState();
  const customRender = useCustomRender();

  useEffect(() => {
    setBgTexture(customRender.texture);
  }, []);

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
      <Stars />
    </>
  );
}
