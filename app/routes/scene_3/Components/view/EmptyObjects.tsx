import { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Object3D } from "three";
import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  color: "ffffff",
  emissive: new THREE.Color(0xffffff),
  emissiveIntensity: 75,
});

export function EmptyObject9() {
  return (
    <>
      <mesh
        geometry={boxGeometry}
        material={boxMaterial}
        position={[0, 3, 0]}
      />
    </>
  );
}
