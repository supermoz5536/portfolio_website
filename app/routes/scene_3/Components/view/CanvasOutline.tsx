import { Canvas } from "@react-three/fiber";
import Experience from "../../Experience";
import { EffectComposer, Bloom, Outline } from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";

export function CanvasOutline() {
  const experienceRef = useRef();

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (experienceRef.current) {
      setSelected([experienceRef.current]);
      // console.log(experienceRef.current);
    }
  }, [experienceRef.current]);

  return (
    <>
      <Canvas
        style={{
          minHeight: "100vh",
          height: "100%",
          width: "100%",
          zIndex: 0,
        }}
        shadows
        gl={{ localClippingEnabled: true, alpha: true }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 4000,
          position: [0, 0, 100],
        }}
      >
        <Experience outlineRef={experienceRef} />
        <EffectComposer>
          {/* <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
          /> */}
          <Outline
            selection={selected} // ここに輪郭抽出したいオブジェクトを指定します
            selectionLayer={10} // オブジェクトと同じレイヤー番号
            visibleEdgeColor={0xffffff} // white → 0xffffff
            hiddenEdgeColor={0xff0000} // red → 0xff0000
            edgeStrength={100}
          />
        </EffectComposer>
      </Canvas>
    </>
  );
}
