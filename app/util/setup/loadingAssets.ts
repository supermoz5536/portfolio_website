// assetsLoader.ts
import { useRef } from "react";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useGlobalStore } from "~/store/global/global_store";

export async function loadAllAssets() {
  const totalCount = 7;

  const assetsObj = useRef<any>({ gltf: {}, texture: {} });
  const loadedCount = useRef<any>(0);

  /**
   * Store Setter
   */
  const setAssets = useGlobalStore((state: any) => state.setAssets);

  const setLoadingProgressRatio = useGlobalStore((state: any) => 
    state.setLoadingProgressRatio); // prettier-ignore

  const setIsLoaded = useGlobalStore((state: any) => 
    state.setIsLoaded); // prettier-ignore

  /**
   * Loader
   */

  const textureLoader = new THREE.TextureLoader();

  const gltfLoader: any = new GLTFLoader();
  const dracoLoader: any = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  gltfLoader.setDRACOLoader(dracoLoader);

  /* ------------
     Load Assets
   ------------ */

  if (typeof window !== "undefined") {
    await Promise.all([
      loadGLTF(gltfLoader, "/asset/model/floor.glb", "floor"),
      loadGLTF(gltfLoader, "/asset/model/midPlane.glb", "midPlane"),
      loadGLTF(gltfLoader, "/asset/model/question.glb", "question"),
      loadGLTF(gltfLoader, "/asset/model/stoneTablet.glb", "stoneTablet"),
      loadTexture(textureLoader, "asset/texture/ground.jpg", "ground"),
      loadTexture(textureLoader, "asset/texture/playerShadow.jpg", "playerShadow"), //prettier-ignore
      loadTexture(textureLoader, "asset/texture/stone.png", "stone"),
    ]);

    setIsLoaded(true);
    console.log("loaded");
  }

  /**
   * Methods
   */

  function getProgressRatio() {
    return Math.floor((loadedCount.current / totalCount) * 100);
  }

  function loadGLTF(gltfLoader: GLTFLoader, path: string, assetName: string) {
    return new Promise<void>((resolve) => {
      gltfLoader.load(path, (gltf: any) => {
        assetsObj.current.gltf[assetName] = gltf;
        setAssets(assetsObj.current);

        loadedCount.current++;
        setLoadingProgressRatio(getProgressRatio());

        resolve();
      });
    });
  }

  function loadTexture(
    textureLoader: THREE.TextureLoader,
    path: string,
    assetName: string,
  ) {
    return new Promise<void>((resolve) => {
      textureLoader.load(path, (texture: any) => {
        assetsObj.current.texture[assetName] = texture;
        setAssets(assetsObj.current);

        loadedCount.current++;
        setLoadingProgressRatio(getProgressRatio());

        resolve();
      });
    });
  }
}
