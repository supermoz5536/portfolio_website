import { RigidBody } from "@react-three/rapier";

export function Player() {
  return (
    <>
      {/* Pedestal */}
      <RigidBody type="dynamic" position={[0, 10, 7]}>
        <mesh>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={"mediumpurple"} />
        </mesh>
      </RigidBody>
    </>
  );
}
