import * as THREE from "three";
import { useEffect, useState } from "react";
import { useSystemStore } from "~/store/scene2/system_store";
import ThreePlayerStore from "../../../../store/scene2/three_player_store";
import ThreeContentsStore from "../../../../store/scene2/three_contents_store";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import ThreeInterfaceStore from "../../../../store/scene2/three_interface_store";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Object3D } from "three";

type StoneTabletProps = {
  position: THREE.Vector3;
  index: number;
};

/**
 * Loader
 */

const gltfLoader: any = new GLTFLoader();
const dracoLoader: any = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader);

export function StoneTablet({ position, index }: StoneTabletProps) {
  const [scene, setScene] = useState<Object3D>();

  useEffect(() => {
    /**
     * Importing Model
     */

    gltfLoader.load("/asset/model/stoneTablet.glb", (gltf: any) => {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      setScene(gltf.scene);
    });
  }, []);

  return (
    <>
      {scene && (
        <primitive
          object={scene}
          scale={1.75}
          position={[8.75, 1.75, -8.75]}
          rotation={[0, -Math.PI / 1.5, 0]}
        />
      )}
    </>
  );
}
