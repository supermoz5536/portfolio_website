import { advance, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useGlobalStore } from "~/store/global/global_store";
import * as THREE from "three";

type PreCompileProps = {
  sceneNumber: 1 | 2 | 3;
};

export function PreCompile({ sceneNumber }: PreCompileProps) {
  const animationFrameIdRef = useRef<any>();
  const countRef = useRef(0);

  const setIsCompiledScene1 = useGlobalStore(
    (state: any) => state.setIsCompiledScene1,
  );

  const setIsCompiledScene2 = useGlobalStore(
    (state: any) => state.setIsCompiledScene2,
  );

  const setIsCompiledScene3 = useGlobalStore(
    (state: any) => state.setIsCompiledScene3,
  );

  const { gl, scene, camera } = useThree();

  useEffect(() => {
    (async () => {
      await runCompile();
      await runManualRender();
      switch (sceneNumber) {
        case 1:
          setIsCompiledScene1(true);
          break;

        case 2:
          setIsCompiledScene2(true);
          break;

        case 3:
          setIsCompiledScene3(true);
          break;
      }
    })();
  }, [gl, scene, camera]);

  async function runCompile() {
    if (gl.compileAsync) {
      await gl.compileAsync(scene, camera);
    } else {
      gl.compile(scene, camera);
    }
  }

  async function runManualRender() {
    const maxWaiting = new Promise<void>((resolve) =>
      setTimeout(() => resolve(), 5000),
    );

    const manualRender = new Promise<void>((resolve) => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      const loop = (t: number) => {
        const waitFrame = sceneNumber == 2 ? 200 : 60;
        if (countRef.current < waitFrame) {
          countRef.current++;
          advance(t / 1000);
          animationFrameIdRef.current = requestAnimationFrame(loop);
          if (sceneNumber == 2) console.log('"runManualRender triggered');
        } else {
          resolve();
        }
      };

      animationFrameIdRef.current = requestAnimationFrame(loop);
    });

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 15000)); // Experience のマウント直後の安定化を待機
    return Promise.race([maxWaiting, manualRender]);
  }

  return null;
}

// await runTextureWarmup();
// await runGeometryWarmup();
// await runOffScreenWarmup();

//   async function runTextureWarmup() {
//     scene.traverse((obj: any) => {
//       if (obj.isMesh && obj.material) {
//         const materials = Array.isArray(obj.material) // 配列ではない場合 => 配列へ変換
//           ? obj.material
//           : [obj.material];
//         materials.forEach((mat: any) => {
//           if (mat.map) gl.initTexture(mat.map);
//           if (mat.normalMap) gl.initTexture(mat.normalMap);
//           if (mat.roughnessMap) gl.initTexture(mat.roughnessMap);
//         });
//       }
//     });
//   }

//   async function runGeometryWarmup() {
//     // シーン内のすべてのメッシュのジオメトリについて、バウンディングボックス/球の計算を実施するなどして
//     // GPU側へのアップロードがトリガーされるようにする（内部的には gl.bufferData() の呼び出しが発生するはず）
//     scene.traverse((obj: any) => {
//       if (obj.isMesh && obj.geometry) {
//         if (!obj.geometry.boundingBox) {
//           obj.geometry.computeBoundingBox();
//         }
//         if (!obj.geometry.boundingSphere) {
//           obj.geometry.computeBoundingSphere();
//         }
//         // 必要に応じて属性の更新フラグを立てる
//         Object.values(obj.geometry.attributes).forEach((attr: any) => {
//           attr.needsUpdate = true;
//         });
//       }
//     });
//     // さらに１回描画することで、バッファ転送が確実に走るようにする
//     gl.render(scene, camera);
//   }

//   async function runOffScreenWarmup() {
//     const originalTarget = gl.getRenderTarget();
//     const dummytarget = new THREE.WebGLRenderTarget(
//       window.innerWidth,
//       window.innerHeight,
//     );

//     gl.initRenderTarget(dummytarget);
//     gl.setRenderTarget(dummytarget);
//     for (let i = 0; i < 100; i++) {gl.render(scene, camera)} // prettier-ignore
//     gl.setRenderTarget(originalTarget);
//     gl.getContext().finish();

//     dummytarget.dispose();
//   }
