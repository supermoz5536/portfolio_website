import { Vector3, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type positionProps = {
  position: THREE.Vector3;
};

/**
 * Sphere
 */
const sphereGeometry = new THREE.SphereGeometry(0.06, 32, 16);
const sphereHalfGeometry = new THREE.SphereGeometry(
  0.06, // 半径
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
arrowTipGeometry.rotateX(Math.PI / 2); // ジオメトリを -Z 軸の代わりに Y 軸方向に設定
const arrowTipMaterial = new THREE.MeshStandardMaterial({ color: "white" });

/**
 * Static Dot
 */
const staticDotGeometry = new THREE.SphereGeometry(0.01, 32, 16);
const staticDotMaterial = new THREE.MeshStandardMaterial({ color: "white" });

export function StaticDot({ position }: positionProps) {
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
  0.03, // 半径
  32, // 水平方向の分割数
  16, // 垂直方向の分割数
  0, // phiStart: 水平方向の開始角度 (ラジアン)
  2 * Math.PI, // phiLength: 水平方向の角度範囲 (ラジアン)
  0, // thetaStart: 垂直方向の開始角度 (ラジアン)
  Math.PI / 2, // thetaLength: 垂直方向の角度範囲 (ラジアン)
);
const dynamicDotMaterial1 = new THREE.MeshStandardMaterial({
  color: "purple",
  side: THREE.DoubleSide,
});

const dynamicDotMaterial2 = new THREE.MeshStandardMaterial({
  color: "red",
  side: THREE.DoubleSide,
});

const dynamicDotMaterial3 = new THREE.MeshStandardMaterial({
  color: "blue",
  side: THREE.DoubleSide,
});

export function ArrowTip() {
  const arrowRef: any = useRef();

  useEffect(() => {
    if (arrowRef.current) {
      // ターゲットの方向を向く
      arrowRef.current.rotation.set(-Math.PI / 2, 0, 0);
      arrowRef.current.lookAt(new THREE.Vector3(0.6, 1.75, -0.6));
    }
  }, []);
  return (
    <>
      <mesh
        ref={arrowRef}
        geometry={arrowTipGeometry}
        material={arrowTipMaterial}
        position={[0.5, 1.685, -0.5]}
      />
    </>
  );
}

export function TurnedDynamicDot({ position }: positionProps) {
  const dotBody: any = useRef();

  useFrame((state, delta) => {
    if (dotBody.current) {
      const currentPosition = dotBody.current.position;

      if (dotBody.current.position.x < 0) {
        dotBody.current.position.set(
          currentPosition.x,
          currentPosition.y,
          currentPosition.z - 0.3 * delta,
        );
      } else {
        dotBody.current.position.set(
          currentPosition.x + 0.3 * delta,
          currentPosition.y,
          currentPosition.z,
        );
      }

      if (dotBody.current.position.x > 0.6) {
        dotBody.current.position.set(0, 1, 0.6);
      }
    }
  });

  return (
    <>
      <mesh
        ref={dotBody}
        geometry={dynamicDotGeometry}
        material={dynamicDotMaterial1}
        position={position}
      />
    </>
  );
}

export function DynamicDotAxisZ({ position }: positionProps) {
  const dotBody: any = useRef();

  useFrame((state, delta) => {
    if (dotBody.current) {
      const currentPosition = dotBody.current.position;

      dotBody.current.position.set(
        currentPosition.x,
        currentPosition.y,
        currentPosition.z - 0.3 * delta,
      );

      if (dotBody.current.position.z < -0.6) {
        dotBody.current.position.set(0, 1, 0.6);
      }
    }
  });

  return (
    <>
      <mesh
        ref={dotBody}
        geometry={dynamicDotGeometry}
        material={dynamicDotMaterial2}
        position={position}
      />
    </>
  );
}

export function DynamicDotAxisXZ({ position }: positionProps) {
  const dotBody: any = useRef();

  useFrame((state, delta) => {
    if (dotBody.current) {
      const currentPosition = dotBody.current.position;

      if (currentPosition.x < -0.1) {
        dotBody.current.position.set(
          currentPosition.x + 0.3 * delta,
          currentPosition.y,
          currentPosition.z - 0.3 * delta,
        );
      } else if (-0.1 < currentPosition.x && currentPosition.x < 0) {
        dotBody.current.position.set(
          currentPosition.x + 0.3 * delta,
          currentPosition.y - 0.2 * delta,
          currentPosition.z - 0.3 * delta,
        );
      } else if (0 < currentPosition.x && currentPosition.x < 0.1) {
        dotBody.current.position.set(
          currentPosition.x + 0.3 * delta,
          currentPosition.y + 0.2 * delta,
          currentPosition.z - 0.3 * delta,
        );
      } else if (currentPosition.x > 0.1) {
        dotBody.current.position.set(
          currentPosition.x + 0.3 * delta,
          currentPosition.y,
          currentPosition.z - 0.3 * delta,
        );
      }

      if (dotBody.current.position.z < -0.6) {
        dotBody.current.position.set(-0.6, 1, 0.6);
      }
    }
  });

  return (
    <>
      <mesh
        ref={dotBody}
        geometry={dynamicDotGeometry}
        material={dynamicDotMaterial3}
        position={position}
      />
    </>
  );
}

export function ContentFloor3({ position }: positionProps) {
  const diagonalStaticDotsAbove = [];
  const diagonalStaticDotsBelow = [];
  const verticallStaticDots = [];
  const turnedDynamicDots = [];
  const dynamicDotsAxisZ = [];
  const dynamicDotsAxisXZ = [];

  for (let i = 0; i < 11; i++) {
    diagonalStaticDotsAbove.push(StaticDot);
  }

  for (let i = 0; i < 13; i++) {
    diagonalStaticDotsBelow.push(StaticDot);
  }

  for (let i = 0; i < 8; i++) {
    verticallStaticDots.push(StaticDot);
  }

  for (let i = 0; i < 8; i++) {
    turnedDynamicDots.push(TurnedDynamicDot);
  }

  for (let i = 0; i < 8; i++) {
    dynamicDotsAxisZ.push(DynamicDotAxisZ);
  }

  for (let i = 0; i < 12; i++) {
    dynamicDotsAxisXZ.push(DynamicDotAxisZ);
  }

  return (
    <>
      <group position={[position.x, position.y + 0.5, position.z]}>
        {/* Filed Layder*/}
        <mesh
          geometry={planeGeometry}
          material={externalFloorMaterial}
          position={[0, 1, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1.5, 1.5, 1]}
        />

        {/* Sphere Top Right */}
        <mesh
          geometry={sphereGeometry}
          material={innerBlueMaterial}
          position={[0.6, 1.75, -0.6]}
        />

        {/* Sphere Bottom Left */}
        <mesh
          geometry={sphereHalfGeometry}
          material={innerBlueMaterial}
          position={[-0.6, 1, 0.6]}
        />

        {/* Arrow Tip */}
        <ArrowTip />

        {/* Diagonal Static Dots Above */}
        {diagonalStaticDotsAbove.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Bottom Left
            -0.6 + 0.1 * index,
            1 + 0.0625 * index,
            0.6 - 0.1 * index,
          );
          return <Dot position={dotPosition} />;
        })}

        {/* Diagonal Static Dots Below */}
        {/* {diagonalStaticDotsBelow.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Bottom Left
            -0.6 + 0.1 * index,
            1,
            0.6 - 0.1 * index,
          );
          return <Dot position={dotPosition} />;
        })} */}

        {/* Vertical Static Dots */}
        {verticallStaticDots.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Top Right
            0.6,
            1.75 - 0.1 * index,
            -0.6,
          );
          return <Dot position={dotPosition} />;
        })}

        {/* Turned Dynamic Dots */}
        {/* {turnedDynamicDots.map((Dot, index) => {
          if (index < 1) {
            let dotPosition;
            if (index < 4) {
              dotPosition = new THREE.Vector3(0, 1, 0.6 - index * 0.15);
            } else {
              dotPosition = new THREE.Vector3(0 + (index - 4) * 0.15, 1, 0);
            }
            return <TurnedDynamicDot position={dotPosition} />;
          }
        })} */}

        {/* Dynamic Dots Axis Z */}
        {dynamicDotsAxisZ.map((Dot, index) => {
          if (index < 1) {
            let dotPosition;

            dotPosition = new THREE.Vector3(0, 1, 0.6 - index * 0.15);

            return <DynamicDotAxisZ position={dotPosition} />;
          }
        })}

        {/* Dynamic Dots Axis XZ */}
        {dynamicDotsAxisXZ.map((Dot, index) => {
          if (index < 1) {
            let dotPosition;

            dotPosition = new THREE.Vector3(
              -0.6 + index * 0.1,
              1,
              0.6 - index * 0.1,
            );

            return <DynamicDotAxisXZ position={dotPosition} />;
          }
        })}
      </group>
    </>
  );
}
