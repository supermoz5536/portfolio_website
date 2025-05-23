import * as THREE from "three";
import skySphereVertex from "./shaders/earthSphere/vertex.glsl";
import skySphereFragment from "./shaders/earthSphere/fragment.glsl";

export function EarthSphereMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      // 大気（空）のグラデーションを制御するために使う
      // 「高度（またはエレベーション）のしきい値」です。
      // uv座標（通常は y 座標）に基づいて、地平線近くと
      // 高い部分の輝度・色の変化を計算する際の調整値として使われ、
      // 空の明るさやグラデーションを決定します。
      uAtmosphereElevation: { value: 0.5 },

      // 大気グラデーションの急峻さ（変化の強さ）を表す指数です
      // 地平線からの距離に応じた色の変化（明るさ・濃さ）をべき乗（pow 関数）で調整し、
      // 急激なグラデーション効果を作り出します。
      uAtmospherePower: { value: 10 },

      // 昼間の色
      uColorDayCycleLow: { value: new THREE.Color() },
      uColorDayCycleHigh: { value: new THREE.Color() },

      // 夜間の色
      uColorNightLow: { value: new THREE.Color() },
      uColorNightHigh: { value: new THREE.Color() },

      uSunPosition: { value: new THREE.Vector3() },
      uSunColor: { value: new THREE.Color() },

      uSunBaseIntensityMultiplier: { value: 0.8 },
      uSunLayerIntensityMultiplier: { value: 0.9 },

      uAtomAngleIntensityMultiplier: { value: 0.8 }, // 太陽との距離が近い部分
      uAtomElevationIntensityMultiplier: { value: 0.8 }, // sphere下半分を最大として、上部に行くほど減衰
      uAtomDayCycleIntensityMultiplier: { value: 0.8 }, // sphere中心を最大として、中間部で値が増大する。

      // 昼夜サイクルの進行度を示す値です(0～1)
      // 0.0: 昼間
      // 0.5: 夜間
      // 1.0: 昼間
      uDayCycleProgress: { value: 0.25 },
    },
    vertexShader: skySphereVertex,
    fragmentShader: skySphereFragment,
  });

  return material;
}
