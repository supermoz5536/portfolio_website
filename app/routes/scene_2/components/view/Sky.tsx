import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import backGroundVertex from "./Materials/shaders/skyBackground/vertex.glsl";
import backGroundFragment from "./Materials/shaders/skyBackground/fragment.glsl";
import { SkySphereMaterial } from "./Materials/SkySphereMaterial";

type BackGroundProps = {
  texture: any;
};

export function useCustomRender() {
  const state = useThree();
  const customRender = useRef<any>({});

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

    customRender.current.scene.add(Sphere());
  }, []);

  useFrame(() => {
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
      vertexShader: backGroundVertex,
      fragmentShader: backGroundFragment,
      uniforms: {
        uTexture: { value: null },
      },
    }),
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (backGroundRef.current) {
      backGroundRef.current.material.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  return (
    <>
      {isMounted && (
        <mesh
          ref={backGroundRef}
          geometry={new THREE.PlaneGeometry(1, 1)}
          material={materialRef.current}
          position={[0, 5, 0]}
          scale={10}
        />
      )}
    </>
  );
}

export function Sphere() {
  const geometry = new THREE.SphereGeometry(100, 128, 64);
  const material = SkySphereMaterial();

  const mesh = new THREE.Mesh(geometry, material);

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
