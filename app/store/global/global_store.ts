import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type SystemStore = {
  isMobile: boolean;
  isLandscape: boolean;
};

export const useGlobalStore = create<SystemStore>()(
  subscribeWithSelector((set) => {
    return {
      isMobile: false,
      isLandscape: false,

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
    };
  }),
);
