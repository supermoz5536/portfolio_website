// lil-gui は、ブラウザに依存したコードを含んでいるので
// UIへのパラメーター描画に必要な window や document が必要。
// SSRが完了して、これらのオブジェクトが利用可能になるまでは
// lil-gui のインスタンス化を待機する必要がある。

import { GUI } from "lil-gui";

let gui: GUI;
let isInstantiated: boolean = false;

export const getGui = (): GUI | null => {
  // SSR: null を出力
  if (typeof window == "undefined") return null;

  // Cliant Side: シングルトンでインスタンス化
  if (!isInstantiated) {
    isInstantiated = true;
    // gui = new GUI();
    // gui.hide();
  }

  return gui;
};
