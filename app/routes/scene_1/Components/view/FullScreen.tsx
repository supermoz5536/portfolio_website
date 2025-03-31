import { useEffect, useState } from "react";
import { useSystemStore } from "~/store/scene1/system_store";
import * as THREE from "three";

export function FullScreen() {
  const [whiteSizeRatio, setWiteSizeRatio] = useState(0);

  const scrollProgressTopAndBottom = useSystemStore((state) => state.scrollProgressTopAndBottom); // prettier-ignore

  useEffect(() => {
    setWiteSizeRatio(Math.max(0, 2 - scrollProgressTopAndBottom * 2.5));
  }, [scrollProgressTopAndBottom]);

  return (
    <>
      <mesh
        renderOrder={-5}
        frustumCulled={false}
        geometry={new THREE.PlaneGeometry(whiteSizeRatio, whiteSizeRatio, 1, 1)}
        // geometry={new THREE.PlaneGeometry(2, 2, 1, 1)}
        material={
          new THREE.ShaderMaterial({
            vertexShader: `
          void main()
          {
              gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `,
            fragmentShader: `
          void main()
          {
              gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
          }
        `,
            // transparent: true,
            depthTest: false,
          })
        }
      />
    </>
  );
}
