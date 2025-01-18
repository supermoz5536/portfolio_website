import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type SystemStore = {
  isActivated: boolean;
  isPlayerFocus: boolean;
  toggleIsActivated: () => void;
};

export const useSystemStore = create<SystemStore>()(
  subscribeWithSelector((set) => {
    return {
      isActivated: false,
      isPlayerFocus: true,

      toggleIsActivated: () => {
        set((state: any) => {
          return { isActivated: !state.isActivated };
        });
      },

      setIsPlayerFocus: (newState: boolean) => {
        set((state: any) => {
          return { isPlayerFocus: newState };
        });
      },
    };
  }),
);
