import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export default create(
  subscribeWithSelector((set) => {
    return {
      moveDeltaX: 0,
      moveDeltaY: 0,

      setMoveDelta: (moveDeltaX: number, moveDeltaY: number) => {
        set((state: any) => {
          return { moveDeltaX: moveDeltaX, moveDeltaY: moveDeltaY };
        });
      },
    };
  }),
);
