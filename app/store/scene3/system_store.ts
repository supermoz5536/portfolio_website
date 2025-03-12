import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type SystemStore = {
  scrollProgress: number;
  scrollProgressTest: number;
};

export const useSystemStore = create<SystemStore>()(
  subscribeWithSelector((set) => {
    return {
      scrollProgress: 0,
      scrollProgressTest: 0,

      setScrollProgress: (newState: number) => {
        set((state: any) => {
          return { scrollProgress: newState };
        });
      },

      setScrollProgressTest: (newState: number) => {
        set((state: any) => {
          return { scrollProgressTest: newState };
        });
      },
    };
  }),
);
