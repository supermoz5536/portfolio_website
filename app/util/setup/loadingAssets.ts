// assetsLoader.ts
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useGlobalStore } from "~/store/global/global_store";

/**
 * この関数をアプリの起動時やトップレベルコンポーネントで呼び出し、
 * すべてのアセットを一括でロードし、グローバルストアに保存する想定
 */
export async function loadAllAssets(loadingManager?: THREE.LoadingManager) {
  /**
   * Setup Loader
   */

  const gltfLoader: any = new GLTFLoader();
  const dracoLoader: any = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  gltfLoader.setDRACOLoader(dracoLoader);

  /**
   * Load Models
   */

  // floor.glb のロード例
  await new Promise<void>((resolve, reject) => {
    gltfLoader.load(
      "/asset/model/floor.glb",
      (gltf) => {
        setFloorGLTF(gltf); // グローバルストアに保存
        resolve();
      },
      undefined,
      (error) => reject(error),
    );
  });

  // 他にロードしたいモデルやテクスチャがあれば同様のパターンで順次ロード
  // 例）
  // await new Promise<void>((resolve, reject) => {
  //   gltfLoader.load(
  //     "/asset/model/other.glb",
  //     (gltf) => {
  //       setOtherGLTF(gltf);
  //       resolve();
  //     },
  //     undefined,
  //     (error) => reject(error),
  //   );
  // });

  // すべてのロードが完了したら関数を抜ける
}
