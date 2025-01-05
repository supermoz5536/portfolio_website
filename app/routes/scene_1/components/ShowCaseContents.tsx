import { Vector3, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PositionProps = {
  position: THREE.Vector3;
};

type DynamicDotProps = {
  position: THREE.Vector3;
  isPassUnder?: boolean;
  isColorRed?: boolean;
};

/**
 * Sphere
 */
const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 16);
const sphereHalfGeometry = new THREE.SphereGeometry(
  0.1, // 半径
  32, // 水平方向の分割数
  16, // 垂直方向の分割数
  0, // phiStart: 水平方向の開始角度 (ラジアン)
  2 * Math.PI, // phiLength: 水平方向の角度範囲 (ラジアン)
  0, // thetaStart: 垂直方向の開始角度 (ラジアン)
  Math.PI / 2, // thetaLength: 垂直方向の角度範囲 (ラジアン)
);

const innerBlueMaterial = new THREE.MeshStandardMaterial({
  color: "blue",
  side: THREE.DoubleSide,
});

const outerRedMaterial = new THREE.MeshStandardMaterial({
  color: "red",
  side: THREE.DoubleSide,
});

/**
 * Field
 */
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const externalFloorMaterial = new THREE.MeshStandardMaterial({
  color: "red",
  transparent: true,
  opacity: 0.4,
  side: THREE.DoubleSide,
  depthWrite: false,
});

/**
 * Arrow
 */
const arrowTipGeometry = new THREE.ConeGeometry(0.0175, 0.08, 16);
arrowTipGeometry.rotateX(-Math.PI / 2); // ジオメトリを -Z 軸の代わりに Y 軸方向に設定
const arrowTipMaterial = new THREE.MeshStandardMaterial({ color: "white" });

/**
 * Static Dot
 */
const staticDotGeometry = new THREE.SphereGeometry(0.01, 32, 16);
const staticDotMaterial = new THREE.MeshStandardMaterial({ color: "white" });

export function StaticDot({ position }: PositionProps) {
  return (
    <>
      <mesh
        geometry={staticDotGeometry}
        material={staticDotMaterial}
        position={position}
      />
    </>
  );
}

/**
 * Dynamic Dot
 */
const dynamicDotGeometry = new THREE.SphereGeometry(
  0.06, // 半径
  32, // 水平方向の分割数
  16, // 垂直方向の分割数
  0, // phiStart: 水平方向の開始角度 (ラジアン)
  2 * Math.PI, // phiLength: 水平方向の角度範囲 (ラジアン)
  0, // thetaStart: 垂直方向の開始角度 (ラジアン)
  Math.PI / 2, // thetaLength: 垂直方向の角度範囲 (ラジアン)
);

const dynamicDotRedMaterial = new THREE.MeshStandardMaterial({
  color: "red",
  side: THREE.DoubleSide,
});

const dynamicDotBlueMaterial = new THREE.MeshStandardMaterial({
  color: "blue",
  side: THREE.DoubleSide,
});

export function ArrowTip() {
  const arrowRef: any = useRef();

  useEffect(() => {
    if (arrowRef.current) {
      // ターゲットの方向を向く
      // arrowRef.current.rotation.set(0, 0, 0); // 回転リセット
      arrowRef.current.lookAt(new THREE.Vector3(1, 4.02, -1));
    }
  }, []);
  return (
    <>
      <mesh
        ref={arrowRef}
        geometry={arrowTipGeometry}
        material={arrowTipMaterial}
        position={[0.9, 2.925, -0.9]}
      />
    </>
  );
}

export function TurnedDynamicDot({ position, isColorRed }: DynamicDotProps) {
  const dotBody: any = useRef();

  useFrame((state, delta) => {
    if (dotBody.current) {
      const currentPosition = dotBody.current.position;

      if (dotBody.current.position.z > 0) {
        dotBody.current.position.set(
          currentPosition.x,
          currentPosition.y,
          currentPosition.z - 0.3 * delta,
        );
      } else if (dotBody.current.position.z < 0) {
        dotBody.current.position.set(
          currentPosition.x + 0.3 * delta,
          currentPosition.y,
          currentPosition.z,
        );
      }

      if (dotBody.current.position.x > 1) {
        dotBody.current.position.set(0, 1.5, 1);
      }
    }
  });

  return (
    <>
      <mesh
        ref={dotBody}
        geometry={dynamicDotGeometry}
        material={isColorRed ? dynamicDotRedMaterial : dynamicDotBlueMaterial}
        position={position}
      />
    </>
  );
}

export function DynamicDotAxisZ({ position, isColorRed }: DynamicDotProps) {
  const dotBody: any = useRef();

  useFrame((state, delta) => {
    if (dotBody.current) {
      const currentPosition = dotBody.current.position;

      dotBody.current.position.set(
        currentPosition.x,
        currentPosition.y,
        currentPosition.z - 0.3 * delta,
      );

      if (dotBody.current.position.z < -1) {
        dotBody.current.position.set(0, 1.5, 1);
      }
    }
  });

  return (
    <>
      <mesh
        ref={dotBody}
        geometry={dynamicDotGeometry}
        material={dynamicDotRedMaterial}
        position={position}
      />
    </>
  );
}

export function DynamicDotAxisXZ({
  position,
  isPassUnder: passUnder,
}: DynamicDotProps) {
  const dotBody: any = useRef();

  useFrame((state, delta) => {
    if (dotBody.current) {
      const currentPosition = dotBody.current.position;

      if (currentPosition.x < -0.25) {
        dotBody.current.position.set(
          currentPosition.x + 0.3 * delta,
          currentPosition.y,
          currentPosition.z - 0.3 * delta,
        );
      } else if (-1 < currentPosition.x && currentPosition.x < 0) {
        dotBody.current.position.set(
          currentPosition.x + 0.3 * delta,
          passUnder ? currentPosition.y - 0.2 * delta : currentPosition.y,
          currentPosition.z - 0.3 * delta,
        );
      } else if (0 < currentPosition.x && currentPosition.x < 0.25) {
        dotBody.current.position.set(
          currentPosition.x + 0.3 * delta,
          passUnder ? currentPosition.y + 0.2 * delta : currentPosition.y,
          currentPosition.z - 0.3 * delta,
        );
      } else if (currentPosition.x > 0.25) {
        dotBody.current.position.set(
          currentPosition.x + 0.3 * delta,
          currentPosition.y,
          currentPosition.z - 0.3 * delta,
        );
      }

      if (dotBody.current.position.z < -1) {
        dotBody.current.position.set(-1, 1.5, 1);
      }
    }
  });

  return (
    <>
      <mesh
        ref={dotBody}
        geometry={dynamicDotGeometry}
        material={passUnder ? dynamicDotBlueMaterial : dynamicDotRedMaterial}
        position={position}
      />
    </>
  );
}

export function ShowCaseContent0() {
  const diagonalStaticDotsAbove = [];
  const verticallStaticDots = [];

  for (let i = 0; i < 19; i++) {
    diagonalStaticDotsAbove.push(StaticDot);
  }

  for (let i = 0; i < 11; i++) {
    verticallStaticDots.push(StaticDot);
  }

  return (
    <>
      <group position={[0, 0.5, 0]} scale={1.1}>
        {/* Filed Layer */}
        <mesh
          geometry={planeGeometry}
          material={externalFloorMaterial}
          position={[0, 1.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[3, 3, 1]}
        />
        {/* Sphere Top Left */}
        <mesh
          geometry={sphereGeometry}
          material={outerRedMaterial}
          position={[-1, 3, 1]}
        />
        {/* Sphere Bottom Right */}
        <mesh
          geometry={sphereHalfGeometry}
          material={innerBlueMaterial}
          position={[1, 1.5, -1]}
        />
        {/* Arrow Tip */}
        <ArrowTip />
        {/* Diagonal Static Dots Above */}
        {diagonalStaticDotsAbove.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Bottom Left
            -1 + 0.1 * index,
            3 - 0.075 * index,
            1 - 0.1 * index,
          );
          return (
            <Dot
              key={`diagonalStaticDotsAbove${index}`}
              position={dotPosition}
            />
          );
        })}
        {/* Vertical Static Dots */}
        {verticallStaticDots.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Top Right
            -1,
            3 - 0.15 * index,
            1,
          );
          return (
            <Dot key={`verticallStaticDots${index}`} position={dotPosition} />
          );
        })}
        <TurnedDynamicDot
          position={new THREE.Vector3(0, 1.5, 1)}
          isColorRed={false}
        />
        ;
        <DynamicDotAxisXZ
          position={new THREE.Vector3(-1, 1.5, 1)}
          isPassUnder={false}
        />
      </group>
    </>
  );
}

export function ShowCaseContent3() {
  const diagonalStaticDotsAbove = [];
  const verticallStaticDots = [];

  for (let i = 0; i < 19; i++) {
    diagonalStaticDotsAbove.push(StaticDot);
  }

  for (let i = 0; i < 11; i++) {
    verticallStaticDots.push(StaticDot);
  }

  return (
    <>
      <group position={[0, 0.5, 0]} scale={1.1}>
        {/* Filed Layer */}
        <mesh
          geometry={planeGeometry}
          material={externalFloorMaterial}
          position={[0, 1.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[3, 3, 1]}
        />

        {/* Sphere Top Right */}
        <mesh
          geometry={sphereGeometry}
          material={innerBlueMaterial}
          position={[1, 3, -1]}
        />

        {/* Sphere Bottom Left */}
        <mesh
          geometry={sphereHalfGeometry}
          material={innerBlueMaterial}
          position={[-1, 1.5, 1]}
        />

        {/* Arrow Tip */}
        <ArrowTip />

        {/* Diagonal Static Dots Above */}
        {diagonalStaticDotsAbove.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Bottom Left
            -1 + 0.1 * index,
            1.5 + 0.075 * index,
            1 - 0.1 * index,
          );
          return (
            <Dot
              key={`diagonalStaticDotsAbove${index}`}
              position={dotPosition}
            />
          );
        })}

        {/* Vertical Static Dots */}
        {verticallStaticDots.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Top Right
            1,
            3 - 0.15 * index,
            -1,
          );
          return (
            <Dot key={`verticallStaticDots${index}`} position={dotPosition} />
          );
        })}

        <DynamicDotAxisZ
          position={new THREE.Vector3(0, 1.5, 1)}
          isColorRed={true}
        />

        <DynamicDotAxisXZ
          position={new THREE.Vector3(-1, 1.5, 1)}
          isPassUnder={true}
        />
      </group>
    </>
  );
}

export function ShowCaseContent6() {
  const diagonalStaticDotsAbove = [];
  const verticallStaticDots = [];

  for (let i = 0; i < 19; i++) {
    diagonalStaticDotsAbove.push(StaticDot);
  }

  for (let i = 0; i < 11; i++) {
    verticallStaticDots.push(StaticDot);
  }

  return (
    <>
      <group position={[0, 0.5, 0]} scale={1.1}>
        {/* Filed Layer */}
        <mesh
          geometry={planeGeometry}
          material={externalFloorMaterial}
          position={[0, 1.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[3, 3, 1]}
        />

        {/* Sphere Center */}
        <mesh
          geometry={sphereHalfGeometry}
          material={innerBlueMaterial}
          position={[0, 1.5, 0]}
        />

        {/* Sphere Top Right */}
        <mesh
          geometry={sphereGeometry}
          material={innerBlueMaterial}
          position={[1, 3, -1]}
        />

        {/* Sphere Bottom Left */}
        <mesh
          geometry={sphereHalfGeometry}
          material={innerBlueMaterial}
          position={[-1, 1.5, 1]}
        />

        {/* Arrow Tip */}
        <ArrowTip />

        {/* Diagonal Static Dots Above */}
        {diagonalStaticDotsAbove.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Bottom Left
            -1 + 0.1 * index,
            1.5 + 0.075 * index,
            1 - 0.1 * index,
          );
          return (
            <Dot
              key={`diagonalStaticDotsAbove${index}`}
              position={dotPosition}
            />
          );
        })}

        {/* Vertical Static Dots */}
        {verticallStaticDots.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Top Right
            1,
            3 - 0.15 * index,
            -1,
          );
          return (
            <Dot key={`verticallStaticDots${index}`} position={dotPosition} />
          );
        })}

        <DynamicDotAxisZ
          position={new THREE.Vector3(0, 1.5, 1)}
          isColorRed={true}
        />

        <DynamicDotAxisXZ
          position={new THREE.Vector3(-1, 1.5, 1)}
          isPassUnder={true}
        />
      </group>
    </>
  );
}

export function ShowCaseContent7() {
  return null;
}

export function ShowCaseContent9() {
  return null;
}

export function ShowCaseContent10() {
  return null;
}

export function ShowCaseContent11() {
  return null;
}
