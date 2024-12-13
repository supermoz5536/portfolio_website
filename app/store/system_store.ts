import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type SystemStore = {
  isActivated: boolean;
  toggleIsActivated: () => void;
};

export const useSystemStore = create<SystemStore>()(
  subscribeWithSelector((set) => {
    return {
      /**
       * Scene 2
       */
      isActivated: true,

      toggleIsActivated: () => {
        set((state: any) => {
          return { isActivated: !state.isActivated };
        });
      },
    };
  }),
);
