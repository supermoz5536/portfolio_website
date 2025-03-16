import { Canvas } from "@react-three/fiber";
import Experience from "../../Experience";
import {
  EffectComposer,
  // Bloom,
  // Outline,
  // HueSaturation,
  // ToneMapping,
  // Vignette,
  // Glitch,
  // Noise,
  // DepthOfField,
} from "@react-three/postprocessing";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ToneMappingMode, BlendFunction, GlitchMode } from "postprocessing";
import { Resizer, KernelSize } from "postprocessing";
import * as THREE from "three";
import { OutLineCustom } from "./PostProcessing/Outline/Outline";
import { useSystemStore } from "~/store/scene3/system_store";
import { useGlobalStore } from "~/store/global/global_store";

export function CanvasOutline() {
  const isMobile = useGlobalStore((state) => state.isMobile);
  return (
    <>
      <Canvas
        frameloop="never"
        style={{
          minHeight: "100vh",
          height: "100%",
          width: "100%",
          zIndex: 0,
        }}
        shadows
        gl={{
          localClippingEnabled: true,
          alpha: true,
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 4000,
          position: [0, 0, 100],
        }}
        dpr={isMobile ? 0.5 : 1.7}
      >
        <Experience flag="outline" />
        <EffectComposer>
          <OutLineCustom />
        </EffectComposer>
      </Canvas>
    </>
  );
}

// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import Experience from "../../Experience";
// // import { EffectComposer } from "@react-three/postprocessing";
// import { useEffect, useMemo, useRef, useState } from "react";
// import {
//   MaskPass,
//   ClearMaskPass,
//   EffectPass,
//   RenderPass,
// } from "postprocessing";
// import * as THREE from "three";
// import { OutLineCustom } from "./PostProcessing/Outline/Outline";
// import { useSystemStore } from "~/store/scene3/system_store";
// import { useGlobalStore } from "~/store/global/global_store";
// import { OutLineEffect } from "../view/PostProcessing/Outline/OutlineEffect";
// import { SavePass } from "three/examples/jsm/postprocessing/SavePass.js";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

// function MergeComposer() {
//   const { gl, scene, camera, size } = useThree();

//   const renderTarget = new THREE.WebGLRenderTarget(
//     window.innerWidth * 1.0,
//     window.innerHeight * 1.0,
//     // Options
//     //    generateMipmaps: 遠くのオブジェクトがぼやけるように自動で解像度を落とす
//     //    パフォーマンス最適化のために無効化
//     { generateMipmaps: false },
//   );

//   const [composerA] = useState<any>(() => new EffectComposer(gl, renderTarget));

//   useEffect(() => {
//     composerA.renderToScreen = false;
//     composerA.setSize(size.width, size.height); // サイズ設定
//     composerA.addPass(new RenderPass(scene, camera)); // レンダーパスを追加

//     // カスタムパスを追加
//     const outlinePass = new EffectPass(camera, OutLineCustom());
//     outlinePass.renderToScreen = true;

//     composerA.addPass(outlinePass);
//   }, [composerA, scene, camera, size]);

//   useFrame((delta) => {
//     console.log("fadfsafds");
//     composerA.render(delta);
//   }, 1);

//   return <primitive object={composerA} />;
// }

// export function CanvasOutline() {
//   const isMobile = useGlobalStore((state) => state.isMobile);

//   return (
//     <>
//       <Canvas
//         frameloop="never"
//         style={{
//           minHeight: "100vh",
//           height: "100%",
//           width: "100%",
//           zIndex: 0,
//         }}
//         shadows
//         gl={{
//           localClippingEnabled: true,
//           alpha: true,
//           autoClear: false,
//         }}
//         camera={{
//           fov: 45,
//           near: 0.1,
//           far: 4000,
//           position: [0, 0, 100],
//         }}
//         dpr={isMobile ? 0.5 : 1.7}
//       >
//         <Experience flag="outline" />
//         <MergeComposer />
//       </Canvas>
//     </>
//   );
// }
