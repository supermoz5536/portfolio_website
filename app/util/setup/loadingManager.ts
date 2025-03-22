import { useGlobalStore } from "~/store/global/global_store";
import * as THREE from "three";
import { useRef } from "react";

export function setupLoadingManager() {
  const loadedCountRef = useRef<number>(0);

  /**
   * Global State
   */

  const setLoadingManager = useGlobalStore((state: any) => 
    state.setLoadingManager); // prettier-ignore

  const setIsLoaded = useGlobalStore((state: any) => 
    state.setIsLoaded); // prettier-ignore

  const setLoadingProgressRatio = useGlobalStore((state: any) => 
    state.setLoadingProgressRatio); // prettier-ignore

  /**
   * LoaderManager
   */
  const loadingManager = new THREE.LoadingManager(
    // onLoad
    () => {
      if (loadedCountRef.current > 40) {
        setIsLoaded(true);
        console.log("loaded");
      }
    },

    // onProgress
    (url, loaded, total) => {
      loadedCountRef.current = loaded;

      const progressRatio = loaded / total;
      setLoadingProgressRatio(progressRatio);

      console.log("total", total);
    },

    // on Error
    () => {
      console.log("LoadingManager: error");
    },
  );

  setLoadingManager(loadingManager);
}
