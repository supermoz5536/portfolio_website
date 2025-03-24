// import { useGlobalStore } from "~/store/global/global_store";
// import * as THREE from "three";
// import { useRef } from "react";

// export function setupLoadingManager() {
//   const loadedCountRef = useRef<number>(0);
//   const timeoutRef = useRef<any>();

//   /**
//    * Global State
//    */

//   const setLoadingManager = useGlobalStore((state: any) =>
//     state.setLoadingManager); // prettier-ignore

//   const setIsLoaded = useGlobalStore((state: any) =>
//     state.setIsLoaded); // prettier-ignore

//   const setLoadingProgressRatio = useGlobalStore((state: any) =>
//     state.setLoadingProgressRatio); // prettier-ignore

//   /**
//    * LoaderManager
//    */
//   const loadingManager = new THREE.LoadingManager(
//     // onLoad
//     () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }

//       timeoutRef.current = setTimeout(() => {
//         if (loadedCountRef.current > 36) {
//           setIsLoaded(true);
//           console.log("loaded");
//         }
//       }, 3000);
//     },

//     // onProgress
//     (url, loaded, total) => {
//       loadedCountRef.current = loaded;

//       const progressRatio = Math.floor((loaded / 46) * 100);
//       setLoadingProgressRatio(progressRatio);

//       console.log("ロード済", loaded);
//     },

//     // on Error
//     () => {
//       console.log("LoadingManager: error");
//     },
//   );

//   setLoadingManager(loadingManager);
// }
