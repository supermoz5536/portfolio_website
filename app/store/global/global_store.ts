import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

type GlobalStore = {
  isMobile: boolean;
  isLandscape: boolean;
  loadingManager: THREE.LoadingManager | undefined;
  isLoaded: boolean;
};

export const useGlobalStore = create<GlobalStore>()(
  subscribeWithSelector((set) => {
    return {
      isMobile: false,
      isLandscape: false,
      loadingManager: undefined,
      isLoaded: false,

      setIsMobile: (newState: boolean) => {
        set((state: any) => {
          return { isMobile: newState };
        });
      },

      setIsLandscape: (newState: boolean) => {
        set((state: any) => {
          return { isLandscape: newState };
        });
      },

      setLoadingManager: (newState: THREE.LoadingManager) => {
        set((state: any) => {
          return { loadingManager: newState };
        });
      },

      setIsLoaded: (newState: boolean) => {
        set((state: any) => {
          return { isLoaded: newState };
        });
      },
    };
  }),
);
