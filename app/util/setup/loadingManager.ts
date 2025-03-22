import { useGlobalStore } from "~/store/global/global_store";
import * as THREE from "three";

export function setupLoadingManager() {
  const setIsLoaded = useGlobalStore((state: any) => 
    state.setIsLoaded); // prettier-ignore

  const setLoadingManager = useGlobalStore((state: any) => 
    state.setLoadingManager); // prettier-ignore

  const loadingManager = new THREE.LoadingManager(
    // onLoad
    () => {
      setIsLoaded(true);
      console.log("loaded");
    },

    // onProgress
    (url, loaded, total) => {
      const progressRatio = loaded / total;
      console.log("progressRatio", progressRatio);
    },

    // on Error
    () => {
      console.log("LoadingManager: error");
    },
  );

  setLoadingManager(loadingManager);
}
