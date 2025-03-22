import { useGlobalStore } from "~/store/global/global_store";
import * as THREE from "three";
import { useRef } from "react";

export function setupLoadingManager() {
  const loadedCountRef = useRef<number>(0);

  /**
   * Global State
   */
  const setIsLoaded = useGlobalStore((state: any) => 
    state.setIsLoaded); // prettier-ignore

  const setLoadingManager = useGlobalStore((state: any) => 
    state.setLoadingManager); // prettier-ignore

  /**
   * LoaderManager
   */
  const loadingManager = new THREE.LoadingManager(
    // onLoad
    () => {
      if (loadedCountRef.current > 10) {
        setIsLoaded(true);
        console.log("loaded");
      }
    },

    // onProgress
    (url, loaded, total) => {
      const progressRatio = loaded / total;
      console.log("loaded", progressRatio);
      console.log("total", total);

      loadedCountRef.current = total;
    },

    // on Error
    () => {
      console.log("LoadingManager: error");
    },
  );

  setLoadingManager(loadingManager);
}
