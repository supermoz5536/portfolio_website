import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
// const boxMaterial = new THREE.MeshStandardMaterial({
const boxMaterial = new THREE.MeshLambertMaterial({
  color: "ffffff",
  emissive: new THREE.Color(0xffffff),
  emissiveIntensity: 30,
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
