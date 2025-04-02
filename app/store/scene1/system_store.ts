import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type SystemStore = {
  isSkiped: boolean;
  isIntroEnd: boolean;
  isAnimationEnd: boolean;
  scrollProgressTopAndTop: number; // For TextGroup1-5
  scrollProgressTopAndBottom: number; // For Control Rendering, Resolution and Camera
};

export const useSystemStore = create<SystemStore>()(
  subscribeWithSelector((set) => {
    return {
      isSkiped: false,
      isIntroEnd: false,
      isAnimationEnd: false,
      scrollProgressTopAndTop: 0,
      scrollProgressTopAndBottom: 0,

      setIsSkiped: (newState: boolean) => {
        set((state: any) => {
          return { isSkiped: newState };
        });
      },

      setIsIntroEnd: (newState: boolean) => {
        set((state: any) => {
          return { isIntroEnd: newState };
        });
      },

      setIsAnimationEnd: (newState: boolean) => {
        set((state: any) => {
          return { isAnimationEnd: newState };
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
