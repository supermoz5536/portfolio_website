import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type SystemStore = {
  scrollProgressTopAndBottom: number;
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
      scrollProgressTopAndBottom: 0,
      isActivated: false,
      isPlayerFocused: true,
      isOrbitControlMobile: false,

      setScrollProgressTopAndBottom: (newState: number) => {
        set((state: any) => {
          return { scrollProgressTopAndBottom: newState };
        });
      },

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
