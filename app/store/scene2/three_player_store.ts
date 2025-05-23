import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export default create(
  subscribeWithSelector((set) => {
    return {
      isPlayerFirstMoved: false,
      currentPosition: new THREE.Vector3(0, 0, 0),
      currentFloorNum: 0,

      setIsPlayerFirstMoved: (moved: boolean) => {
        set((state: any) => {
          if (state.isPlayerFirstMoved == false) {
            return { isPlayerFirstMoved: true };
          }
          return {};
        });
      },

      setPosition: (position: THREE.Vector3) => {
        set((state: any) => {
          let currentFloorNum = state.currentFloorNum;

          if (-204 < position.z && position.z < -180) {
            if (116 < position.x && position.x < 130) {
              currentFloorNum = 11;
            } else if (52 < position.x && position.x < 76) {
              currentFloorNum = 10;
            } else if (-12 < position.x && position.x < 12) {
              currentFloorNum = 9;
            }
          } else if (-140 < position.z && position.z < -116) {
            if (116 < position.x && position.x < 130) {
              currentFloorNum = 8;
            } else if (52 < position.x && position.x < 76) {
              currentFloorNum = 7;
            } else if (-12 < position.x && position.x < 12) {
              currentFloorNum = 6;
            }
          } else if (-76 < position.z && position.z < -52) {
            if (116 < position.x && position.x < 130) {
              currentFloorNum = 5;
            } else if (52 < position.x && position.x < 76) {
              currentFloorNum = 4;
            } else if (-12 < position.x && position.x < 12) {
              currentFloorNum = 3;
            }
          } else if (-12 < position.z && position.z < 12) {
            if (116 < position.x && position.x < 130) {
              currentFloorNum = 2;
            } else if (52 < position.x && position.x < 76) {
              currentFloorNum = 1;
            } else if (-12 < position.x && position.x < 12) {
              currentFloorNum = 0;
            }
          }

          return {
            currentPosition: position,
            currentFloorNum: currentFloorNum,
          };
        });
      },
    };
  }),
);
