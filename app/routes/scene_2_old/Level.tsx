import { MeshStandardMaterial } from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text, useGLTF } from "@react-three/drei";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenYellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({
  color: "orangered",
});
const wallMaterial = new THREE.MeshStandardMaterial({
  color: "slategrey",
});

export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={new THREE.Vector3(position[0], position[1], position[2])}>
      <Float floatIntensity={1} rotationIntensity={1}>
        <Text
          font="/bebas-neue-v9-latin-regular.woff"
          scale={0.5}
          maxWidth={3.25}
          lineHeight={0.75}
          textAlign="right"
          position={[0.75, 0.65, 0]}
          rotation-y={-0.25}
          color="white"
        >
          <meshBasicMaterial toneMapped={false} />
          Marble Race
        </Text>
      </Float>
      {/* Floor*/}
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>
    </group>
  );
}

export function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacle: any = useRef();
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1),
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacle.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={new THREE.Vector3(position[0], position[1], position[2])}>
      {/* Floor*/}
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>

      {/* RigidBody: 物理法則が適用（重力など） */}
      {/* kinematicPosition: 重力や他objからの物理演算を無効化して
      開発者の指定した運動のみで動作 */}
      {/* restitution: 反発係数 */}
      {/* friction: 摩擦係数 */}
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        ></mesh>
      </RigidBody>
    </group>
  );
}

export function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacle: any = useRef();
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time + timeOffset) + 1.15;
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });

  return (
    <group position={new THREE.Vector3(position[0], position[1], position[2])}>
      {/* Floor*/}
      {/* <primitive object={new THREE.AxesHelper(2.5)}></primitive> */}
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>

      {/* RigidBody: 物理法則が適用（重力など） */}
      {/* kinematicPosition: 重力や他objからの物理演算を無効化して
      開発者の指定した運動のみで動作 */}
      {/* restitution: 反発係数 */}
      {/* friction: 摩擦係数 */}
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        ></mesh>
      </RigidBody>
    </group>
  );
}

export function BlockAxe({ position = [0, 0, 0] }) {
  const obstacle: any = useRef();
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const x = Math.sin(time + timeOffset) * 1.25;
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });

  return (
    <group position={new THREE.Vector3(position[0], position[1], position[2])}>
      {/* Floor*/}
      {/* <primitive object={new THREE.AxesHelper(2.5)}></primitive> */}
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>

      {/* RigidBody: 物理法則が適用（重力など） */}
      {/* kinematicPosition: 重力や他objからの物理演算を無効化して
      開発者の指定した運動のみで動作 */}
      {/* restitution: 反発係数 */}
      {/* friction: 摩擦係数 */}
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        ></mesh>
      </RigidBody>
    </group>
  );
}

function BlockEnd({ position = [0, 0, 0] }) {
  const hamburger = useGLTF("./hamburger.glb");

  hamburger.scene.children.forEach((child) => {
    child.castShadow = true;
  });

  return (
    <group position={new THREE.Vector3(position[0], position[1], position[2])}>
      <Text
        font="/bebas-neue-v9-latin-regular.woff"
        scale={1}
        position={[0, 2.25, 2]}
      >
        FINISH
        <meshBasicMaterial toneMapped={false} />
      </Text>

      {/* Floor*/}
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, 0, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>

      {/* Hamburger */}
      <RigidBody
        type="fixed"
        colliders="hull"
        position={[0, 0.25, 0]}
        restitution={0.2}
        friction={0}
      >
        <primitive object={hamburger.scene} scale={0.2} />
      </RigidBody>
    </group>
  );
}

function Bounds({ length = 1 }) {
  return (
    <>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh
          position={[2.15, 0.75, -((length * 4) / 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
          castShadow
        ></mesh>
        <mesh
          position={[-2.15, 0.75, -((length * 4) / 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
          castShadow
          receiveShadow
        ></mesh>
        <mesh
          position={[0, 0.75, 2 - length * 4]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[4, 1.5, 0.3]}
          castShadow
        ></mesh>
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, 2 - (length * 4) / 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  );
}

export default function Level({
  count = 5,
  types = [BlockSpinner, BlockAxe, BlockLimbo],
  seed = 0,
}) {
  const blocks = useMemo(() => {
    const blocks = [];

    // countの数だけループ処理
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }

    return blocks;
  }, [count, types, seed]);

  return (
    <>
      {/* <BlockStart position={[0, 0, 0]} /> */}

      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, (index + 1) * -4]} />
      ))}

      {/* <BlockEnd position={[0, 0, (count + 1) * -4]} /> */}
      <Bounds length={count + 2} />
    </>
  );
}
