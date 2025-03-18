import { Vector3, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PositionProps = {
  position: THREE.Vector3;
};

type ArrowTipProps = {
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  rotation: THREE.Vector3;
};

type DynamicDotProps = {
  position: THREE.Vector3;
  isPassUnder?: boolean;
  isColorRed?: boolean;
};

// prettier-ignore
type PreventerScaleTypeKeys =|"n0"|"n1"|"n2"|"n3"|"f0"|"f1"|"f2"|"f3";
type PreventerScaleType = {
  [key in PreventerScaleTypeKeys]: number;
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
const redFieldMaterial = new THREE.MeshStandardMaterial({
  color: "red",
  transparent: true,
  opacity: 0.4,
  side: THREE.DoubleSide,
  depthWrite: false,
});
const greenFieldMaterial = new THREE.MeshStandardMaterial({
  color: "green",
  transparent: true,
  opacity: 0.4,
  side: THREE.DoubleSide,
  depthWrite: false,
});

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

/**
 * Preventer
 */
const preventerGeometry = new THREE.PlaneGeometry(0.3, 0.45);
const preventerMaterial = new THREE.MeshStandardMaterial({
  color: "red",
  side: THREE.DoubleSide,
});

/**
 * Arrow
 */
const arrowTipGeometry = new THREE.ConeGeometry(0.0175, 0.08, 16);
arrowTipGeometry.rotateX(-Math.PI / 2); // ジオメトリを -Z 軸の代わりに Y 軸方向に設定
const arrowTipMaterial = new THREE.MeshStandardMaterial({ color: "white" });

export function ArrowTip({
  position,
  targetPosition,
  rotation,
}: ArrowTipProps) {
  const arrowRef: any = useRef();

  useEffect(() => {
    if (arrowRef.current) {
      arrowRef.current.lookAt(targetPosition);
      arrowRef.current.rotation.set(rotation.x, rotation.y, rotation.z);
    }
  }, []);
  return (
    <>
      <mesh
        ref={arrowRef}
        geometry={arrowTipGeometry}
        material={arrowTipMaterial}
        position={[position.x, position.y, position.z]}
      />
    </>
  );
}

export function TurnedDynamicDot({ position, isColorRed }: DynamicDotProps) {
  const dotBody: any = useRef();

  useEffect(() => {
    if (dotBody.current) {
      dotBody.current.position.set(position.x, position.y, position.z);
    }
  }, []);

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
      />
    </>
  );
}

export function DynamicDotAxisZ({ position, isColorRed }: DynamicDotProps) {
  const dotBody: any = useRef();

  useEffect(() => {
    if (dotBody.current) {
      dotBody.current.position.set(position.x, position.y, position.z);
    }
  }, []);

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
      />
    </>
  );
}

export function DynamicDotAxisXZ({
  position,
  isPassUnder: passUnder,
}: DynamicDotProps) {
  const dotBody: any = useRef();

  useEffect(() => {
    if (dotBody.current) {
      dotBody.current.position.set(position.x, position.y, position.z);
    }
  }, []);

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
      />
    </>
  );
}

export function DynamicDotAxisTransition() {
  const dotBody = useRef<any>();

  // n: near, f: far
  const n0 = useRef<any>();
  const n1 = useRef<any>();
  const n2 = useRef<any>();
  const n3 = useRef<any>();
  const f0 = useRef<any>();
  const f1 = useRef<any>();
  const f2 = useRef<any>();
  const f3 = useRef<any>();

  // 動的にrefを切り替えられるようにするために用意したが
  // 実際にどう活用できるかがまだわからない
  const preventerRefs: any = {
    n0,
    n1,
    n2,
    n3,
    f0,
    f1,
    f2,
    f3,
  };

  // 初期値を設定し、この状態を更新、参照して
  // Ref経由でmeshのscaleを更新
  const [preventerScale, setPreventerScale] = useState<PreventerScaleType>({
    n0: 0,
    n1: 0,
    n2: 0,
    n3: 0,
    f0: 0,
    f1: 0,
    f2: 0,
    f3: 0,
  });

  const [isFirstTry, setIsFirstTry] = useState(true);

  const origin = new THREE.Vector3(0, 1.5, 0);
  const limitDistance = Math.sqrt(2);

  const [currentAxis, setCurrentAxis] = useState<0 | 1 | 2 | 3>(0);
  const [currentAngle, setCurrentAngle] = useState((-Math.PI * 1) / 4);

  // Values for Fallback
  const [stuckFrames, setStuckFrames] = useState(0);
  const [lastPosition, setLastPosition] = useState(
    new THREE.Vector3(0, 1.5, 0),
  );

  // Recovery Method
  const initializeWhenStack = () => {
    setStuckFrames(0);
    setCurrentAxis(0);
    setCurrentAngle((-Math.PI * 1) / 4);
  };

  const scalePreventer = (
    delta: number,
    key: keyof PreventerScaleType,
    isIncreased: boolean = true,
  ) => {
    setPreventerScale((prev: PreventerScaleType) => {
      // 指定したkeyの現在のスケール値
      const selectedPrevScaleValue = prev[key];
      const deltaFrequency = 2.5;
      let newValue = selectedPrevScaleValue;

      if (preventerRefs[key].current) {
        // スケール拡大を適用
        if (isIncreased && selectedPrevScaleValue < 1) {
          preventerRefs[key].current.scale.set(
            selectedPrevScaleValue + deltaFrequency * delta,
            selectedPrevScaleValue + deltaFrequency * delta,
            selectedPrevScaleValue + deltaFrequency * delta,
          );

          newValue = selectedPrevScaleValue + deltaFrequency * delta;

          // スケール縮小を適用
        } else if (!isIncreased && selectedPrevScaleValue > 0) {
          preventerRefs[key].current.scale.set(
            selectedPrevScaleValue - deltaFrequency * delta,
            selectedPrevScaleValue - deltaFrequency * delta,
            selectedPrevScaleValue - deltaFrequency * delta,
          );

          preventerRefs[key].current.scale.needsUpdate = true;

          newValue = selectedPrevScaleValue - deltaFrequency * delta;
        } else if (!isIncreased && selectedPrevScaleValue <= 0) {
          preventerRefs[key].current.scale.set(0, 0, 0);
          newValue = 0;
        }

        // 指定したkeyの値を更新
        prev[key] = newValue;
      }
      return prev;
    });
  };

  useFrame((state, delta) => {
    if (dotBody.current) {
      const currentPosition = dotBody.current.position;
      const currentDistance = currentPosition.distanceTo(origin);
      const distanceMoved = lastPosition.distanceTo(currentPosition);

      /**
       * Stack Check
       */

      // ここの数値(0.0001)は誤差閾値なので、場面によって調整
      if (distanceMoved < 0.0001) {
        setStuckFrames((prev) => prev + 1);
      } else {
        setStuckFrames(0);
      }

      // 前フレームの位置を更新
      // THREE.Vector3 型は、参照渡しで管理されるため
      // そのままだと lastPosition と currentPosition は
      // 同じオブジェクトを指してしまうため
      // clone() で Vector3 のインスタンスを別途生成する
      setLastPosition(currentPosition.clone());

      // もし一定フレーム数(例:60)以上「ほぼ動いてない」ならスタックとみなす
      if (stuckFrames >= 30) {
        console.log("Dot is stuck. Resetting...");
        initializeWhenStack();
      }

      /**
       *  Motion Controls
       */

      // 0
      if (currentAxis == 0) {
        // First Axis
        if (currentDistance < limitDistance / 3) {
          dotBody.current.position.set(
            currentPosition.x + 0.3 * delta,
            currentPosition.y,
            currentPosition.z - 0.3 * delta,
          );
          if (!isFirstTry) scalePreventer(delta, "n0");
        } else if (
          currentDistance >= limitDistance / 3 &&
          currentAngle > (-Math.PI * 2) / 4
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance) / 3,
            currentPosition.y - 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance) / 3,
          );
        } else if (
          currentDistance >= limitDistance / 3 &&
          currentAngle > (-Math.PI * 3) / 4
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance) / 3,
            currentPosition.y + 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance) / 3,
          );

          if (!isFirstTry) scalePreventer(delta, "n0", false);

          // Second Axis
        } else if (
          currentDistance >= limitDistance / 3 &&
          currentDistance < (limitDistance * 2) / 3 &&
          currentAngle <= (-Math.PI * 3) / 4
        ) {
          dotBody.current.position.set(
            currentPosition.x - 0.3 * delta,
            currentPosition.y,
            currentPosition.z - 0.3 * delta,
          );

          scalePreventer(delta, "f3");
        } else if (
          currentDistance >= (limitDistance * 2) / 3 &&
          currentAngle > -Math.PI
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance * 2) / 3,
            currentPosition.y - 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance * 2) / 3,
          );
        } else if (
          currentDistance >= (limitDistance * 2) / 3 &&
          currentAngle > (-Math.PI * 5) / 4
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance * 2) / 3,
            currentPosition.y + 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance * 2) / 3,
          );

          scalePreventer(delta, "f3", false);

          // Third Axis
        } else if (
          currentDistance >= (limitDistance * 2) / 3 &&
          currentAngle <= (-Math.PI * 5) / 4
        ) {
          dotBody.current.position.set(
            currentPosition.x - 0.3 * delta,
            currentPosition.y,
            currentPosition.z + 0.3 * delta,
          );
        }

        // Reset Axis
        if (currentDistance > limitDistance) {
          setCurrentAxis(1);
          setCurrentAngle((-Math.PI * 7) / 4);
          dotBody.current.position.set(0, 1.5, 0);
        }
      }

      // 1
      if (currentAxis == 1) {
        if (isFirstTry) setIsFirstTry(false);

        // First Axis
        if (currentDistance < limitDistance / 3) {
          dotBody.current.position.set(
            currentPosition.x + 0.3 * delta,
            currentPosition.y,
            currentPosition.z + 0.3 * delta,
          );

          scalePreventer(delta, "n1");
        } else if (
          currentDistance >= limitDistance / 3 &&
          currentAngle > (-Math.PI * 8) / 4
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance) / 3,
            currentPosition.y - 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance) / 3,
          );
        } else if (
          currentDistance >= limitDistance / 3 &&
          currentAngle > (-Math.PI * 9) / 4
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance) / 3,
            currentPosition.y + 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance) / 3,
          );

          scalePreventer(delta, "n1", false);

          // Second Axis
        } else if (
          currentDistance >= limitDistance / 3 &&
          currentDistance < (limitDistance * 2) / 3 &&
          currentAngle >= (-Math.PI * 11) / 4
        ) {
          dotBody.current.position.set(
            currentPosition.x + 0.3 * delta,
            currentPosition.y,
            currentPosition.z - 0.3 * delta,
          );

          scalePreventer(delta, "f0");
        } else if (
          currentDistance >= (limitDistance * 2) / 3 &&
          currentAngle >= (-Math.PI * 10) / 4
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance * 2) / 3,
            currentPosition.y - 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance * 2) / 3,
          );
        } else if (
          currentDistance >= (limitDistance * 2) / 3 &&
          currentAngle > (-Math.PI * 11) / 4
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance * 2) / 3,
            currentPosition.y + 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance * 2) / 3,
          );

          scalePreventer(delta, "f0", false);

          // Third Axis
        } else if (
          currentDistance >= (limitDistance * 2) / 3 &&
          currentAngle <= (-Math.PI * 11) / 4
        ) {
          dotBody.current.position.set(
            currentPosition.x - 0.3 * delta,
            currentPosition.y,
            currentPosition.z - 0.3 * delta,
          );
        }

        // Reset Axis
        if (currentDistance > limitDistance) {
          setCurrentAxis(2);
          setCurrentAngle((-Math.PI * 5) / 4);
          dotBody.current.position.set(0, 1.5, 0);
        }
      }

      // 2
      if (currentAxis == 2) {
        // First Axis
        if (currentDistance < limitDistance / 3) {
          dotBody.current.position.set(
            currentPosition.x - 0.3 * delta,
            currentPosition.y,
            currentPosition.z + 0.3 * delta,
          );

          scalePreventer(delta, "n2");
        } else if (
          currentDistance >= limitDistance / 3 &&
          currentAngle > (-Math.PI * 6) / 4
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance) / 3,
            currentPosition.y - 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance) / 3,
          );
        } else if (
          currentDistance >= limitDistance / 3 &&
          currentAngle > (-Math.PI * 7) / 4
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance) / 3,
            currentPosition.y + 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance) / 3,
          );

          scalePreventer(delta, "n2", false);
          // Second Axis
        } else if (
          currentDistance >= limitDistance / 3 &&
          currentDistance < (limitDistance * 2) / 3 &&
          currentAngle >= (-Math.PI * 9) / 4
        ) {
          dotBody.current.position.set(
            currentPosition.x + 0.3 * delta,
            currentPosition.y,
            currentPosition.z + 0.3 * delta,
          );

          scalePreventer(delta, "f1");
        } else if (
          currentDistance >= (limitDistance * 2) / 3 &&
          currentAngle >= (-Math.PI * 8) / 4
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance * 2) / 3,
            currentPosition.y - 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance * 2) / 3,
          );
        } else if (
          currentDistance >= (limitDistance * 2) / 3 &&
          currentAngle > (-Math.PI * 9) / 4
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance * 2) / 3,
            currentPosition.y + 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance * 2) / 3,
          );

          scalePreventer(delta, "f1", false);

          // Third Axis
        } else if (
          currentDistance >= (limitDistance * 2) / 3 &&
          currentAngle <= (-Math.PI * 9) / 4
        ) {
          dotBody.current.position.set(
            currentPosition.x + 0.3 * delta,
            currentPosition.y,
            currentPosition.z - 0.3 * delta,
          );
        }

        // Reset Axis
        if (currentDistance > limitDistance) {
          setCurrentAxis(3);
          setCurrentAngle((-Math.PI * 3) / 4);
          dotBody.current.position.set(0, 1.5, 0);
        }
      }

      // 3
      if (currentAxis == 3) {
        // First Axis
        if (currentDistance < limitDistance / 3) {
          dotBody.current.position.set(
            currentPosition.x - 0.3 * delta,
            currentPosition.y,
            currentPosition.z - 0.3 * delta,
          );

          scalePreventer(delta, "n3");
        } else if (
          currentDistance >= limitDistance / 3 &&
          currentAngle > -Math.PI
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance) / 3,
            currentPosition.y - 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance) / 3,
          );
        } else if (
          currentDistance >= limitDistance / 3 &&
          currentAngle > (-Math.PI * 5) / 4
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance) / 3,
            currentPosition.y + 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance) / 3,
          );

          scalePreventer(delta, "n3", false);
          // Second Axis
        } else if (
          currentDistance >= limitDistance / 3 &&
          currentDistance < (limitDistance * 2) / 3 &&
          currentAngle >= (-Math.PI * 7) / 4
        ) {
          dotBody.current.position.set(
            currentPosition.x - 0.3 * delta,
            currentPosition.y,
            currentPosition.z + 0.3 * delta,
          );

          scalePreventer(delta, "f2");
        } else if (
          currentDistance >= (limitDistance * 2) / 3 &&
          currentAngle >= (-Math.PI * 6) / 4
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance * 2) / 3,
            currentPosition.y - 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance * 2) / 3,
          );
        } else if (
          currentDistance >= (limitDistance * 2) / 3 &&
          currentAngle > (-Math.PI * 7) / 4
        ) {
          setCurrentAngle((prev) => prev - 0.3 * Math.PI * delta);
          dotBody.current.position.set(
            (Math.cos(currentAngle) * limitDistance * 2) / 3,
            currentPosition.y + 0.3 * delta,
            (Math.sin(currentAngle) * limitDistance * 2) / 3,
          );

          scalePreventer(delta, "f2", false);

          // Third Axis
        } else if (
          currentDistance >= (limitDistance * 2) / 3 &&
          currentAngle <= (-Math.PI * 7) / 4
        ) {
          dotBody.current.position.set(
            currentPosition.x + 0.3 * delta,
            currentPosition.y,
            currentPosition.z + 0.3 * delta,
          );
        }

        // Reset Axis
        if (currentDistance > limitDistance) {
          setCurrentAxis(0);
          setCurrentAngle((-Math.PI * 1) / 4);
          dotBody.current.position.set(0, 1.5, 0);
        }
      }
    }
  });

  return (
    <>
      <mesh
        ref={dotBody}
        geometry={dynamicDotGeometry}
        material={dynamicDotBlueMaterial}
        position={[0, 1.5, 0]}
      />

      <mesh
        ref={n0}
        geometry={preventerGeometry}
        material={preventerMaterial}
        position={[1 / 3 + 0.1, 1.5, -1 / 3 - 0.1]}
        rotation={[0, -Math.PI / 4, 0]}
        scale={[0, 0, 0]}
      />

      <mesh
        ref={n1}
        geometry={preventerGeometry}
        material={preventerMaterial}
        position={[1 / 3 + 0.1, 1.5, 1 / 3 + 0.1]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[0, 0, 0]}
      />

      <mesh
        ref={n2}
        geometry={preventerGeometry}
        material={preventerMaterial}
        position={[-1 / 3 - 0.1, 1.5, 1 / 3 + 0.1]}
        rotation={[0, -Math.PI / 4, 0]}
        scale={[0, 0, 0]}
      />

      <mesh
        ref={n3}
        geometry={preventerGeometry}
        material={preventerMaterial}
        position={[-1 / 3 - 0.1, 1.5, -1 / 3 - 0.1]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[0, 0, 0]}
      />

      <mesh
        ref={f0}
        geometry={preventerGeometry}
        material={preventerMaterial}
        position={[2 / 3 + 0.1, 1.5, -2 / 3 - 0.1]}
        rotation={[0, -Math.PI / 4, 0]}
        scale={[0, 0, 0]}
      />

      <mesh
        ref={f1}
        geometry={preventerGeometry}
        material={preventerMaterial}
        position={[2 / 3 + 0.1, 1.5, 2 / 3 + 0.1]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[0, 0, 0]}
      />

      <mesh
        ref={f2}
        geometry={preventerGeometry}
        material={preventerMaterial}
        position={[-2 / 3 - 0.1, 1.5, 2 / 3 + 0.1]}
        rotation={[0, -Math.PI / 4, 0]}
        scale={[0, 0, 0]}
      />

      <mesh
        ref={f3}
        geometry={preventerGeometry}
        material={preventerMaterial}
        position={[-2 / 3 - 0.1, 1.5, -2 / 3 - 0.1]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[0, 0, 0]}
      />
    </>
  );
}

export function ShowCaseContent0() {
  const diagonalStaticDotsAbove = [];
  const verticallStaticDots = [];

  for (let i = 0; i < 18; i++) {
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
          material={redFieldMaterial}
          position={[0, 1.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[3, 3, 1]}
        />
        {/* Sphere Backward Left Top */}
        <mesh
          geometry={sphereGeometry}
          material={outerRedMaterial}
          position={[-1, 3, 1]}
        />
        {/* Sphere forward Right Below */}
        <mesh
          geometry={sphereHalfGeometry}
          material={innerBlueMaterial}
          position={[1, 1.5, -1]}
        />
        {/* Arrow Tip */}
        <ArrowTip
          position={new THREE.Vector3(0.9 - 0.075, 1.5 + 0.125, -0.9 + 0.075)}
          targetPosition={new THREE.Vector3(1, 1.5, -1)}
          rotation={new THREE.Vector3(Math.PI * 1.75, -Math.PI / 5, 0)}
        />
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

  for (let i = 0; i < 18; i++) {
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
          material={redFieldMaterial}
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
        <ArrowTip
          position={new THREE.Vector3(0.9 - 0.075, 3 - 0.125, -0.9 + 0.075)}
          targetPosition={new THREE.Vector3(1, 1.5, -1)}
          rotation={new THREE.Vector3(Math.PI * 2.25, -Math.PI / 5, 0)}
        />

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

  for (let i = 0; i < 9; i++) {
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
          material={redFieldMaterial}
          position={[0, 1.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[3, 3, 1]}
        />
        {/* Sphere Center Below*/}
        <mesh
          geometry={sphereHalfGeometry}
          material={innerBlueMaterial}
          position={[0, 1.5, 0]}
        />
        {/* Sphere Forward Left Above */}
        <mesh
          geometry={sphereGeometry}
          material={innerBlueMaterial}
          position={[-1, 3, -1]}
        />
        {/* Sphere Forward Right Above */}
        <mesh
          geometry={sphereGeometry}
          material={innerBlueMaterial}
          position={[1, 3, -1]}
        />
        {/* Sphere Backward Left Above */}
        <mesh
          geometry={sphereGeometry}
          material={innerBlueMaterial}
          position={[-1, 3, 1]}
        />
        {/* Sphere Backward Right Above */}
        <mesh
          geometry={sphereGeometry}
          material={innerBlueMaterial}
          position={[1, 3, 1]}
        />
        {/*
         * ArrowTip
         */}
        {/* Forward Left */}
        <ArrowTip
          position={new THREE.Vector3(-0.9, 2.84, -0.9)}
          targetPosition={new THREE.Vector3(-1, 3, -1)}
          rotation={new THREE.Vector3(Math.PI * 2.325, Math.PI * 0.15, 0)}
        />
        {/* Forward Right */}
        <ArrowTip
          position={new THREE.Vector3(0.9, 2.84, -0.9)}
          targetPosition={new THREE.Vector3(-1, 3, -1)}
          rotation={new THREE.Vector3(Math.PI * 2.325, -Math.PI * 0.15, 0)}
        />
        {/* Backward Left */}
        <ArrowTip
          position={new THREE.Vector3(-0.9, 2.84, 0.9)}
          targetPosition={new THREE.Vector3(-1, 3, -1)}
          rotation={
            new THREE.Vector3(
              Math.PI * 2.325 + Math.PI * 0.33,
              Math.PI * 0.155,
              0,
            )
          }
        />
        {/* Backward Right */}
        <ArrowTip
          position={new THREE.Vector3(0.9, 2.84, 0.9)}
          targetPosition={new THREE.Vector3(1, 3, -1)}
          rotation={
            new THREE.Vector3(
              Math.PI * 2.325 + Math.PI * 0.33,
              -Math.PI * 0.155,
              0,
            )
          }
        />
        {/*
         * diagonalStaticDotsAbove
         */}
        {/* Forward Left */}
        {diagonalStaticDotsAbove.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Bottom Left
            0 - 0.1 * index,
            1.5 + 0.15 * index,
            0 - 0.1 * index,
          );
          return (
            <Dot
              key={`diagonalStaticDotsAbove${index}`}
              position={dotPosition}
            />
          );
        })}
        {/* Forward Right */}
        {diagonalStaticDotsAbove.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Bottom Left
            0 + 0.1 * index,
            1.5 + 0.15 * index,
            0 - 0.1 * index,
          );
          return (
            <Dot
              key={`diagonalStaticDotsAbove${index}`}
              position={dotPosition}
            />
          );
        })}
        {/* Backward Left */}
        {diagonalStaticDotsAbove.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Bottom Left
            0 - 0.1 * index,
            1.5 + 0.15 * index,
            0 + 0.1 * index,
          );
          return (
            <Dot
              key={`diagonalStaticDotsAbove${index}`}
              position={dotPosition}
            />
          );
        })}
        {/* Backward Right */}
        {diagonalStaticDotsAbove.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Bottom Left
            0 + 0.1 * index,
            1.5 + 0.15 * index,
            0 + 0.1 * index,
          );
          return (
            <Dot
              key={`diagonalStaticDotsAbove${index}`}
              position={dotPosition}
            />
          );
        })}
        {/*
         * verticallStaticDots
         */}
        {/* Forward Left */}
        {verticallStaticDots.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Top Right
            -1,
            3 - 0.15 * index,
            -1,
          );
          return (
            <Dot key={`verticallStaticDots${index}`} position={dotPosition} />
          );
        })}
        {/* Forward Right */}
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
        {/* Backward Left */}
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
        {/* Backward Right */}
        {verticallStaticDots.map((Dot, index) => {
          if (index == 0) return;
          const dotPosition = new THREE.Vector3(
            // Calculate from Sphere Top Right
            1,
            3 - 0.15 * index,
            1,
          );
          return (
            <Dot key={`verticallStaticDots${index}`} position={dotPosition} />
          );
        })}
        <DynamicDotAxisTransition />
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
  return (
    <group position={[0, 0.5, 0]} scale={1.1}>
      {/* Filed Layer */}
      <mesh
        geometry={planeGeometry}
        material={greenFieldMaterial}
        position={[0, 1.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[3, 3, 1]}
      />
    </group>
  );
}

export function ShowCaseContent11() {
  return null;
}
