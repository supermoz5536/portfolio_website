import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type SystemStore = {
  scrollProgressTopAndTop: number;
  scrollProgressTopAndBottom: number;
};

export const useSystemStore = create<SystemStore>()(
  subscribeWithSelector((set) => {
    return {
      scrollProgressTopAndTop: 0,
      scrollProgressTopAndBottom: 0,

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
