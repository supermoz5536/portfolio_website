import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type SystemStore = {
  isIntroEnd: boolean;
  scrollProgressTopAndTop: number; // For TextGroup1-5
  scrollProgressTopAndBottom: number; // For Control Rendering, Resolution and Camera
};

export const useSystemStore = create<SystemStore>()(
  subscribeWithSelector((set) => {
    return {
      isIntroEnd: false,
      scrollProgressTopAndTop: 0,
      scrollProgressTopAndBottom: 0,

      setIsIntroEnd: (newState: boolean) => {
        set((state: any) => {
          return { isIntroEnd: newState };
        });
      },

      setScrollProgressTopAndTop: (newState: number) => {
        set((state: any) => {
          return { scrollProgressTopAndTop: newState };
        });
      },

      setScrollProgressTopAndBottom: (newState: number) => {
        set((state: any) => {
          return { scrollProgressTopAndBottom: newState };
        });
      },
    };
  }),
);
