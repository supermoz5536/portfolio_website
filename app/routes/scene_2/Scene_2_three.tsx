import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Experience from "./Experience";

export const ThreeScene2 = () => {
  //   const mountRef: any = useRef(null);

  //   useEffect(() => {
  //     if (!mountRef.current) return;

  //     // シーン、カメラ、レンダラーをセットアップ
  //     const scene = new THREE.Scene();
  //     const camera = new THREE.PerspectiveCamera(
  //       75,
  //       window.innerWidth / window.innerHeight,
  //       0.1,
  //       1000,
  //     );
  //     const renderer = new THREE.WebGLRenderer();
  //     renderer.setSize(window.innerWidth, window.innerHeight);
  //     mountRef.current.appendChild(renderer.domElement);

  //     // Three.jsのオブジェクトやロジックを移植
  //     const geometry = new THREE.BoxGeometry();
  //     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  //     const cube = new THREE.Mesh(geometry, material);
  //     scene.add(cube);

  //     camera.position.z = 5;

  //     const animate = () => {
  //       requestAnimationFrame(animate);
  //       cube.rotation.x += 0.01;
  //       cube.rotation.y += 0.01;
  //       renderer.render(scene, camera);
  //     };
  //     animate();

  //     // コンポーネントがアンマウントされた際のクリーンアップ
  //     return () => {
  //       renderer.dispose();
  //       mountRef.current.removeChild(renderer.domElement);
  //     };
  //   }, []);

  return (
    <>
      {/* <div ref={mountRef} className="h-full w-full" /> */}
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [2.5, 4, 6],
        }}
      >
        <Experience />
      </Canvas>
    </>
  );
};

export default ThreeScene2;
