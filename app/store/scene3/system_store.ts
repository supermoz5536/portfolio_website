import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type SystemStore = {
  scrollProgress: number;
};

export const useSystemStore = create<SystemStore>()(
  subscribeWithSelector((set) => {
    return {
      scrollProgress: 0,

      setScrollProgress: (newState: number) => {
        set((state: any) => {
          return { scrollProgress: newState };
        });
      },
    };
  }),
);
