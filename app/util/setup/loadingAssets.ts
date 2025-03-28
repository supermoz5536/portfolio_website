// Workflow:
//  - isPreLoaded => Check isCompoled => isLoaded (in Lisnter Callback)

import { useRef } from "react";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useGlobalStore } from "~/store/global/global_store";

export async function loadAllAssets() {
  const totalCount = 8;

  const isFirstTryRef = useRef(true);
  const assetsObj = useRef<any>({ gltf: {}, texture: {} });
  const loadedCount = useRef<any>(0);

  /**
   * Store State
   */

  const setAssets = useGlobalStore((state: any) => state.setAssets);

  /**
   * Store Setter
   */

  const setIsPreLoaded = useGlobalStore((state: any) => state.setIsPreLoaded);

  const setLoadingProgressRatio = useGlobalStore((state: any) => 
    state.setLoadingProgressRatio); // prettier-ignore

  const setIsLoaded = useGlobalStore((state: any) => 
    state.setIsLoaded); // prettier-ignore

  /**
   * Store Lisnter
   */

  // isLoaded will be triggered after the three scenes compiled
  const unsubscribe = useGlobalStore.subscribe(
    (state) => ({
      isCompiledScene1: state.isCompiledScene1,
      isCompiledScene2: state.isCompiledScene2,
      isCompiledScene3: state.isCompiledScene3,
    }),

    (newState, prevState) => {
      const { isCompiledScene1, isCompiledScene2, isCompiledScene3 } = newState;

      if (
        isFirstTryRef.current &&
        isCompiledScene1 &&
        isCompiledScene2 &&
        isCompiledScene3
      ) {
        isFirstTryRef.current = false;
        loadedCount.current++;
        setLoadingProgressRatio(getProgressRatio());

        const timeout = setTimeout(() => {
          loadedCount.current++;
          setLoadingProgressRatio(getProgressRatio());
          setIsLoaded(true);

          console.log("Loaded", loadedCount.current);
          clearTimeout(timeout);
          unsubscribe();
        }, 2000);
      }
    },
  );

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
      loadTexture(textureLoader, "asset/texture/stone.png", "stone"),
    ]);

    const timeout = setTimeout(() => {
      console.log("Pre-Loaded");
      setIsPreLoaded(true);

      clearTimeout(timeout);
    }, 2000);
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
