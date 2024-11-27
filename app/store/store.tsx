import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(
  subscribeWithSelector((set) => {
    return {
      /**
       * Flag
       */
      isOpenPopup: false,

      togglePopup: () => {
        set((state: any) => {
          return { isOpenPopup: !state.isOpenPopup };
        });
      },
    };
  }),
);
