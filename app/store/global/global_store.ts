import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

type GlobalStore = {
  isMobile: boolean;
  isLandscape: boolean;
  loadingManager: THREE.LoadingManager | undefined;
  isLoaded: boolean;
  isPreLoaded: boolean;
  loadingProgressRatio: number;
  assets: Record<string, any>;
  isCompiledScene1: boolean;
  isCompiledScene2: boolean;
  isCompiledScene3: boolean;
  isWarmedUpScene2: boolean;
};

export const useGlobalStore = create<GlobalStore>()(
  subscribeWithSelector((set) => {
    return {
      isMobile: false,
      isLandscape: false,
      loadingManager: undefined,
      isLoaded: false,
      isPreLoaded: false,
      loadingProgressRatio: 0,
      assets: {},
      isCompiledScene1: false,
      isCompiledScene2: false,
      isCompiledScene3: false,
      isWarmedUpScene2: false,

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

      setIsPreLoaded: (newState: boolean) => {
        set((state: any) => {
          return { isPreLoaded: newState };
        });
      },

      setLoadingProgressRatio: (newState: number) => {
        set((state: any) => {
          return { loadingProgressRatio: newState };
        });
      },

      setAssets: (newState: Record<string, any>) => {
        set((state: any) => {
          return { assets: newState };
        });
      },

      setIsCompiledScene1: (newState: boolean) => {
        set((state: any) => {
          return { isCompiledScene1: newState };
        });
      },

      setIsCompiledScene2: (newState: boolean) => {
        set((state: any) => {
          return { isCompiledScene2: newState };
        });
      },

      setIsCompiledScene3: (newState: boolean) => {
        set((state: any) => {
          return { isCompiledScene3: newState };
        });
      },

      setIsWarmedUpScene2: (newState: boolean) => {
        set((state: any) => {
          return { isWarmedUpScene2: newState };
        });
      },
    };
  }),
);
