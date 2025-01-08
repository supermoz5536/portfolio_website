import * as THREE from "three";
import firefliesVertex from "../shaders/firelies/vertex.glsl";
import firefliesFragment from "../shaders/firelies/fragment.glsl";
import { useEffect, useRef, useState } from "react";
import { getGui } from "../util/lil-gui";
import { useFrame } from "@react-three/fiber";

type FirefliesProps = {
  index: number;
};

let isFirstTry = true;

const firefliesGeometry = new THREE.BufferGeometry();

export function Fireflies({ index }: FirefliesProps) {
  const firefliesRef = useRef<any>();

  /**
   * FireLies Value
   */
  const spaceSize = 24;
  const firefriesCount = 10;
  const positionArray = new Float32Array(firefriesCount * 3); // * 3: xyzで1組
  const aScaleArray = new Float32Array(firefriesCount);
  const aRandomArray = new Float32Array(firefriesCount);

  /**
   * Debug
   */
  const gui = getGui();
  const debugObj: any = {};

  if (index == 0) debugObj.uColor = "red";
  if (index == 3) debugObj.uColor = "blue";
  if (index == 6) debugObj.uColor = "pink";
  if (index == 7) debugObj.uColor = "green";
  if (index == 9) debugObj.uColor = "#ffffff";
  if (index == 10) debugObj.uColor = "#cccccc";
  if (index == 11) debugObj.uColor = "#000000";

  useEffect(() => {
    if (firefliesRef.current) {
      /**
       * Debug
       */
      if (isFirstTry && gui) {
        // isFirstTry = false;
        const firefliesFolder = gui.addFolder(`fireflies${index}`);

        firefliesFolder.add(firefliesRef.current.material.uniforms.uPointSize, "value", 0, 2000, 0.0001).name("firelies.uPointSize"); // prettier-ignore
        firefliesFolder.addColor(debugObj, "uColor").onChange((value: any)=>firefliesRef.current.material.uniforms.uColor.value.set(value)).name("firelies.uColor"); // prettier-ignore

        firefliesFolder.close();
      }

      /**
       * @param i: positionArray に対応、xyzで１組なので3倍
       * @param j: aScaleArray に対応、頂点と同数が必要でインクリメント
       * 各頂点のxyz座標にspaceSize内の座標を乱数指定し
       * "position" という名前のAttributeのobjを作成して
       * 座標を格納した配列を設定し、BufferGeometryに追加する。
       */
      for (let i = 0, j = 0, k = 0; i < firefriesCount * 3; i += 3, j++, k++) {
        do {
          positionArray[i] = (Math.random() - 0.5) * spaceSize;
          positionArray[i + 1] = (Math.random() - 0.5) * spaceSize * 0.3;
          positionArray[i + 2] = (Math.random() - 0.5) * spaceSize;

          aScaleArray[j] = Math.min(Math.random() + 0.5, 1.0);
          aRandomArray[k] = Math.random();
        } while (
          (-2 < positionArray[i] && positionArray[i] < 2) && // prettier-ignore
    (0 < positionArray[i + 1] && positionArray[i + 2] < 10.5) && // prettier-ignore
    (2 < positionArray[i + 2] && positionArray[i + 2] > -2) // prettier-ignore
        );
      }

      firefliesRef.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positionArray, 3),
      );

      firefliesRef.current.geometry.setAttribute(
        "aScale",
        new THREE.BufferAttribute(aScaleArray, 1),
      );

      firefliesRef.current.geometry.setAttribute(
        "aRandom",
        new THREE.BufferAttribute(aRandomArray, 1),
      );
    }

    /**
     * Set Listner
     */
    const handleResize = () => {
      firefliesRef.current.material.uniforms.uPixelRatio.value = Math.min(
        window.devicePixelRatio,
        2,
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useFrame((state) => {
    if (firefliesRef.current) {
      const elapseTime = state.clock.getElapsedTime();
      firefliesRef.current.material.uniforms.uTime.value = elapseTime;
    }
  });

  return (
    <>
      <>
        <points
          ref={firefliesRef}
          geometry={firefliesGeometry}
          material={
            new THREE.ShaderMaterial({
              uniforms: {
                uTime: { value: 0 },
                uPointSize: { value: 500.0 },
                uPixelRatio: {
                  value:
                    typeof window != "undefined"
                      ? Math.min(window.devicePixelRatio, 2)
                      : null,
                },
                uColor: { value: new THREE.Color(debugObj.uColor) },
              },
              vertexShader: firefliesVertex,
              fragmentShader: firefliesFragment,
              transparent: true,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            })
          }
          position={[0, 2.5, 0]}
        />
      </>
    </>
  );
}
