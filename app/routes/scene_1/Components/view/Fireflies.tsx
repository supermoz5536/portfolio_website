import * as THREE from "three";
import firefliesVertex from "./Materials/shaders/firelies/vertex.glsl";
import firefliesFragment from "./Materials/shaders/firelies/fragment.glsl";
import { useEffect, useRef } from "react";
import { getFirefliesFolder, getGui } from "../../util/lil-gui";
import { useFrame } from "@react-three/fiber";

type FirefliesProps = {
  index: number;
};

const firefliesGeometry = new THREE.BufferGeometry();

export function Fireflies({ index }: FirefliesProps) {
  const firefliesRef = useRef<any>();

  /**
   * FireLies Value
   */
  const spaceSize = 24 * 5;
  const firefriesCount = 50;
  const positionArray = new Float32Array(firefriesCount * 3); // * 3: xyzで1組
  const aScaleArray = new Float32Array(firefriesCount);
  const aRandomArray = new Float32Array(firefriesCount);

  /**
   * Debug
   */
  const debugObj: any = {};

  if (index == 3) debugObj.uColor = "#ffa6a6";
  if (index == 3) debugObj.uColor = "#ffb8fd";
  if (index == 6) debugObj.uColor = "#2c8dff";
  if (index == 7) debugObj.uColor = "#b0b1ff";
  if (index == 10) debugObj.uColor = "#87f3ff";
  if (index == 3) debugObj.uColor = "#a1ffad";
  if (index == 0) debugObj.uColor = "#fffee4";

  useEffect(() => {
    if (firefliesRef.current) {
      /**
       * Debug
       */

      const firefliesFolder = getFirefliesFolder();

      if (firefliesFolder) {
        firefliesFolder.add(firefliesRef.current.material.uniforms.uPointSize, "value", 0, 2000, 0.0001).name("firelies.uPointSize"); // prettier-ignore
        firefliesFolder.addColor(debugObj, "uColor").onChange((value: any)=>firefliesRef.current.material.uniforms.uColor.value.set(value)).name("firelies.uColor"); // prettier-ignore
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
          positionArray[i + 1] = (Math.random() - 0.5) * spaceSize * 0.6;
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
     * ReCalculate Bounding Sphere
     *
     * デフォルトの boundingSphere は
     * VertexShaderで拡大されるFireliesの可視サイズは反映しないので
     * 半径を２倍にしてShader適用後のオブジェクトを確実に包摂し
     * カメラ内で写っているFireliesの消失を避ける
     */

    firefliesRef.current.geometry.computeBoundingSphere();
    firefliesRef.current.geometry.boundingSphere.radius *= 2; //

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
      <points
        renderOrder={-10}
        ref={firefliesRef}
        geometry={firefliesGeometry}
        material={
          new THREE.ShaderMaterial({
            uniforms: {
              uTime: { value: 0 },
              uPointSize: { value: 2000.0 },
              uPixelRatio: {
                value:
                  typeof window != "undefined"
                    ? Math.min(window.devicePixelRatio, 2.0)
                    : null,
              },
              uColor: { value: new THREE.Color(debugObj.uColor) },
            },
            vertexShader: firefliesVertex,
            fragmentShader: firefliesFragment,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        }
        position={[0, 2, 0]}
      />
    </>
  );
}
