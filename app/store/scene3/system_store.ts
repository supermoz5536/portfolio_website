import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type SystemStore = {
  clipRate: number;
  scrollProgressTopAndTop: number; // For TextGroup1-5
  scrollProgressTopAndBottom: number; // For Control Rendering, Resolution and Camera
};

export const useSystemStore = create<SystemStore>()(
  subscribeWithSelector((set) => {
    return {
      clipRate: 100,
      scrollProgressTopAndTop: 0,
      scrollProgressTopAndBottom: 0,

      setClipRate: (newState: number) => {
        set((state: any) => {
          return { clipRate: newState };
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
