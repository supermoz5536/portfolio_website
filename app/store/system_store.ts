import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type SystemStore = {
  isActivated: boolean;
  isPlayerFocused: boolean;
  isOrbitControlMobile: boolean;
  setIsActivated: (newState: boolean) => void;
  setIsPlayerFocus: (newState: boolean) => void;
  toggleIsOrbitControlMobile: (newState: boolean) => void;
};

export const useSystemStore = create<SystemStore>()(
  subscribeWithSelector((set) => {
    return {
      isActivated: false,
      isPlayerFocused: true,
      isOrbitControlMobile: false,

      setIsActivated: (newState: boolean) => {
        set((state: any) => {
          return { isActivated: newState };
        });
      },

      setIsPlayerFocus: (newState: boolean) => {
        set((state: any) => {
          return { isPlayerFocused: newState };
        });
      },

      toggleIsOrbitControlMobile: (newState: boolean) => {
        set((state: any) => {
          return { isOrbitControlMobile: !state.isOrbitControlMobile };
        });
      },
    };
  }),
);
