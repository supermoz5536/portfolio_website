import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export default create(
  subscribeWithSelector((set) => {
    return {
      isContentSelectedMouseDown: false,

      setIsContentSelectedMouseDown: (selected: boolean) => {
        set((state: any) => {
          return { isContentSelectedMouseDown: selected };
        });
      },
    };
  }),
);
