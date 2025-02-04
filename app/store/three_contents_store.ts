import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export default create(
  subscribeWithSelector((set) => {
    return {
      isContentSelectedMouseDown: false,
      isNoneSelectedMouseDown: false,
      isStoneTabletSelected: false,
      selectedStoneTabletIndex: 0,

      setIsContentSelectedMouseDown: (newState: boolean) => {
        set((state: any) => {
          return { isContentSelectedMouseDown: newState };
        });
      },

      setIsNoneSelectedMouseDown: (newState: boolean) => {
        set((state: any) => {
          return { isNoneSelectedMouseDown: newState };
        });
      },

      setStoneTabletStore: (isSelected: boolean, newIndex: number) => {
        set((state: any) => {
          return {
            isStoneTabletSelected: isSelected,
            selectedStoneTabletIndex: newIndex,
          };
        });
      },
    };
  }),
);
