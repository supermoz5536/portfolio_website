import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import backGroundVertex from "./Materials/shaders/skyBackground/vertex.glsl";
import backGroundFragment from "./Materials/shaders/skyBackground/fragment.glsl";
import { SkySphereMaterial } from "./Materials/SkySphereMaterial";
import { getGui } from "../../util/lil-gui";

type BackGroundProps = {
  texture: any;
};

export function useCustomRender() {
  const state = useThree();
  const customRender = useRef<any>({});
  const sphere = Sphere();

  useEffect(() => {
    /**
     * Setup Custom Render
     */
    customRender.current.scene = new THREE.Scene();
    customRender.current.camera = state.camera.clone();
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

export function BackGround({ texture }: BackGroundProps) {
  const backGroundRef = useRef<any>();
  const materialRef = useRef<any>(
    new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
      },
      vertexShader: backGroundVertex,
      fragmentShader: backGroundFragment,
      depthTest: false,
      depthWrite: false,
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
    // Set Angle
    backGroundRef.current.quaternion.copy(state.camera.quaternion);

    // Set Position
    const cameraDirection = state.camera.getWorldDirection(new THREE.Vector3());
    const cameraNewPosition = state.camera.position.clone();
    cameraNewPosition.add(cameraDirection.multiplyScalar(0.15)); // prettier-ignore

    backGroundRef.current.position.copy(cameraNewPosition);
  });

  return (
    <>
      {isMounted && (
        <mesh
          ref={backGroundRef}
          geometry={new THREE.PlaneGeometry(1.0, 1.0)}
          material={materialRef.current}
          frustumCulled={false}
        />
      )}
    </>
  );
}

export function Sphere() {
  const geometry = new THREE.SphereGeometry(100, 128, 64);

  const material = SkySphereMaterial();
  material.uniforms.uColorDayCycleLow.value.set("#f0fff9");
  material.uniforms.uColorDayCycleHigh.value.set("#2e89ff");
  material.uniforms.uColorNightLow.value.set("#004794");
  material.uniforms.uColorNightHigh.value.set("#001624");
  material.uniforms.uDayCycleProgress.value = 1.0;
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

export function Sky() {
  const [bgTexture, setBgTexture] = useState();
  const customRender = useCustomRender();

  useEffect(() => {
    setBgTexture(customRender.texture);
  }, []);

  return (
    <>
      <BackGround texture={bgTexture} />
    </>
  );
}
