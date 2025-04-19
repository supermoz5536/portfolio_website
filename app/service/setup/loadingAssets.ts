// Workflow:
//  - isPreLoaded => Check isCompoled => isLoaded (in Lisnter Callback)

import { useRef } from "react";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useGlobalStore } from "~/store/global/global_store";

export async function loadAllAssets() {
  const totalCount = 19;

  const isFirstTryRef1 = useRef(true);
  const isFirstTryRef2 = useRef(true);
  const isFirstTryRef3 = useRef(true);
  const isFirstTryRef4 = useRef(true);
  const isFirstTryRef5 = useRef(true);
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
      isWarmedUpPlayer: state.isWarmedUpPlayer,
    }),

    (newState, prevState) => {
      const {
        isCompiledScene1,
        isCompiledScene2,
        isCompiledScene3,
        isWarmedUpPlayer,
      } = newState;

      if (isCompiledScene1 && isFirstTryRef1.current) {
        isFirstTryRef1.current = false;
        loadedCount.current++;
        setLoadingProgressRatio(getProgressRatio());
      }

      if (isCompiledScene2 && isFirstTryRef2.current) {
        isFirstTryRef2.current = false;
        loadedCount.current++;
        setLoadingProgressRatio(getProgressRatio());
      }

      if (isCompiledScene3 && isFirstTryRef3.current) {
        isFirstTryRef3.current = false;
        loadedCount.current++;
        setLoadingProgressRatio(getProgressRatio());
      }

      if (isWarmedUpPlayer && isFirstTryRef4.current) {
        isFirstTryRef4.current = false;
        loadedCount.current++;
        setLoadingProgressRatio(getProgressRatio());
      }

      if (
        isFirstTryRef5.current &&
        isCompiledScene1 &&
        isCompiledScene2 &&
        isCompiledScene3 &&
        isWarmedUpPlayer
      ) {
        isFirstTryRef5.current = false;
        loadedCount.current++;
        setLoadingProgressRatio(getProgressRatio());

        const timeout = setTimeout(() => {
          loadedCount.current++;
          setLoadingProgressRatio(getProgressRatio());
          setIsLoaded(true);

          clearTimeout(timeout);
          unsubscribe();
        }, 500);
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
      setIsPreLoaded(true);

      // Dummy counts for the stack period in Loading progress.
      for (let i = 0; i < 7; i++) {
        const time = i * 2000 + 500;
        setTimeout(() => {
          loadedCount.current++;
          setLoadingProgressRatio(getProgressRatio());
        }, time);
      }

      clearTimeout(timeout);
    }, 1500);
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
