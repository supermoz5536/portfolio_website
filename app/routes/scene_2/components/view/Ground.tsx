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

type BackGroundProps = { texture: any };

/**
 * Geometry / Material
 */

export function useCustomRender() {
  const state = useThree();
  const customRender = useRef<any>({});
  const ground = Ground();

  useEffect(() => {
    /**
     * Setup Custom Render
     */
    customRender.current.scene = new THREE.Scene();
    customRender.current.scene.background = null;

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
      {
        generateMipmaps: false,
      },
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

export function Background({ texture }: BackGroundProps) {
  const backGroundRef = useRef<any>();
  const materialRef = useRef<any>(
    new THREE.MeshBasicMaterial({
      transparent: true,
      map: texture,
      depthWrite: false, // 深度情報を保存しない（比較対象にならない）
      depthTest: false, // 他の obj との深度値の比較を行わない
    }),
  );

  const [isMounted, setIsMounted] = useState(false);

  const state = useThree();

  useEffect(() => {
    setIsMounted(true);
    materialRef.current.map = texture;
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
          renderOrder={-Infinity}
        />
      )}
    </>
  );
}

export function Ground() {
  const textureLoader = new THREE.TextureLoader();
  const groundTexture = textureLoader.load("asset/texture/ground.jpg");

  const mesh = new THREE.Mesh(
    new THREE.CircleGeometry(5000),
    new THREE.MeshBasicMaterial({
      map: groundTexture,
      side: THREE.DoubleSide,
    }),
  );

  mesh.position.set(0, -500, 0);
  mesh.rotation.set(-Math.PI / 2, 0, 0);

  return mesh;
}

export function SetGround() {
  const [bgTexture, setBgTexture] = useState();

  // Setup Custom Render
  const customRender = useCustomRender();

  useEffect(() => {
    setBgTexture(customRender.texture);
  }, [customRender]);

  return <Background texture={bgTexture} />;
}
