// lil-gui は、ブラウザに依存したコードを含んでいるので
// UIへのパラメーター描画に必要な window や document が必要。
// SSRが完了して、これらのオブジェクトが利用可能になるまでは
// lil-gui のインスタンス化を待機する必要がある。

import { GUI } from "lil-gui";

let gui: GUI;

let firefliesFolder: GUI;

let lightsFolder: GUI;
let showcaseLightsFolder: GUI;
let environmentLightsFolder: GUI;

let wavesFolder: GUI;

let isInstantiated: boolean = false;

export const getGui = (): GUI | null => {
  // SSR: null を出力
  if (typeof window == "undefined") return null;

  // Cliant Side: シングルトンでインスタンス化
  if (!isInstantiated) {
    isInstantiated = true;
    gui = new GUI();

    firefliesFolder = gui.addFolder("fireflies");

    lightsFolder = gui.addFolder("lights");
    showcaseLightsFolder = lightsFolder.addFolder("Showcase Lights");
    environmentLightsFolder = lightsFolder.addFolder("Environment Lights");

    wavesFolder = gui.addFolder("waves");
  }

  gui.hide();
  // gui.close();
  return gui;
  // return null;
};

export const getFirefliesFolder = (): GUI | null => {
  if (!firefliesFolder) {
    getGui();
  }

  firefliesFolder.close();
  return firefliesFolder;
  // return null;
};

export const getShowcaseLightsFolder = (): GUI | null => {
  if (!lightsFolder || !showcaseLightsFolder) {
    getGui();
  }

  lightsFolder.close();
  showcaseLightsFolder.close();
  return showcaseLightsFolder;
  // return null;
};

export const getEnvironmentLightsFolder = (): GUI | null => {
  if (!environmentLightsFolder) {
    getGui();
  }

  environmentLightsFolder.close();
  return environmentLightsFolder;
  // return null;
};

export const getWavesFolder = (): GUI | null => {
  if (!wavesFolder) {
    getGui();
  }

  wavesFolder.close();
  return wavesFolder;
  // return null;
};
