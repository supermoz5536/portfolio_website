import React, { useCallback, useEffect, useRef, useState } from "react";
import Matter, { Constraint } from "matter-js";

/**
 * 画面中央を軸に左右反転したレイアウト版。
 * シミュレーション内容・挙動はそのままに、x 座標と制約位置を width/2 を基準に鏡映ししています。
 * 変更点が追いやすいように、x 座標を与えて反転値を返すユーティリティ mx() を用意し、
 * 元コードの式を mx(...) で包むだけでミラーリングを実現しています。
 */

type MatterProps = {
  viewFlag: boolean;
  height: number;
  width: number;
};

const MatterJs2 = ({ viewFlag, height, width }: MatterProps) => {
  /** 画面中央を軸に左右反転するユーティリティ */
  const mx = (x: number) => width - x;

  const [isStrikerOn, setIsSwitchOn] = useState<boolean>(true);
  const [isGenerateOn, setIsGenerateOn] = useState<boolean>(false);
  const [strikerVelocityValue, setStrikerVelocityValue] = useState<number>(0);

  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Matter.js 参照
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  // 幅 * 高さ の変化を対数で正規化した動的サイズ
  const logWidth = Math.log(width);
  const logHeight = Math.log(height);
  const logAverage = (logWidth + logHeight) / 2;
  const deltaScreenSize = Math.exp(logAverage) * 0.03;

  const { Engine, Render, Runner, Bodies, Composite, Constraint } = Matter;

  /** Initial Set Up */
  useEffect(() => {
    const group = Matter.Body.nextGroup(true);

    // ────────────────────────────── 既存エンジン・レンダラー破棄
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null;
    }
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current);
      renderRef.current.canvas.remove();
      renderRef.current = null;
    }
    if (runnerRef.current) {
      Matter.Runner.stop(runnerRef.current);
      runnerRef.current = null;
    }

    // ────────────────────────────── 新規エンジン・レンダラー生成
    const engine = Engine.create();
    engineRef.current = engine;

    const render = Render.create({
      element: canvasRef.current || undefined,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "white",
      },
    });
    renderRef.current = render;

    const runner = Runner.create();
    runnerRef.current = runner;

    // ────────────────────────────── Objects

    /** Falling Cubes */
    const elementArray = Matter.Composites.stack(
      width * 0.2,
      height * -0.2,
      3,
      3,
      0,
      0,
      (x: any, y: any) =>
        Bodies.rectangle(x, y, deltaScreenSize, deltaScreenSize, {
          density: 0.00015,
          frictionAir: 0,
          friction: 0.025,
          restitution: 0.2,
        }),
    );

    /** Bridge */
    const bridge = Matter.Composites.stack(
      width / 2, // 中央にあるため反転不要
      height * 0.1,
      8,
      1,
      10,
      0,
      (x: any, y: any) =>
        Bodies.rectangle(x, y, 15, 7.5, {
          collisionFilter: { group },
          density: 0.005,
          frictionAir: 0.05,
          render: { fillStyle: "#cccccc" },
        }),
    );
    Matter.Composites.chain(bridge, 0.3, 0, -0.3, 0, {
      stiffness: 0.5,
      length: 2,
      render: { visible: true, strokeStyle: "#000000", lineWidth: 2 },
    });

    /** Striker */
    const strikerShaft = Bodies.circle(
      mx((width * 3) / 4),
      height * 0.3,
      deltaScreenSize * 0.45,
      {
        isStatic: false,
        render: {
          fillStyle: "white",
          strokeStyle: "#9B3109",
          lineWidth: 4,
        },
      },
    );

    const pole = Bodies.rectangle(
      strikerShaft.position.x,
      height * 0.39,
      5,
      height * 0.155,
      {
        isStatic: false,
        collisionFilter: { category: 0x0001, mask: 0x0000 },
        render: {
          fillStyle: "white",
          strokeStyle: "#cccccc",
          lineWidth: 4,
          visible: false,
        },
      },
    );

    const hammer = Bodies.circle(
      pole.position.x,
      pole.position.y + (pole.bounds.max.y - pole.position.y),
      deltaScreenSize * 0.45,
      {
        restitution: 0,
        isStatic: false,
        inertia: Infinity,
        frictionAir: 0,
        friction: 0,
        frictionStatic: 0,
        render: {
          fillStyle: "white",
          strokeStyle: "#cccccc",
          lineWidth: 4,
        },
      },
    );

    const striker = Matter.Body.create({
      parts: [strikerShaft, pole, hammer],
      isStatic: false,
      id: 0,
    });
    Matter.Body.setCentre(
      striker,
      { x: strikerShaft.position.x, y: strikerShaft.position.y },
      false,
    );

    /** Tubes */
    const tubeA = Bodies.rectangle(
      mx(width * 0.7),
      -height * 0.225,
      width * 0.01,
      height * 0.7,
      {
        angle: Math.PI * 0.01, // 角度も左右反転 (符号反転)
        isStatic: true,
        render: { fillStyle: "white", strokeStyle: "#cccccc", lineWidth: 4 },
      },
    );

    const tubeB = Bodies.rectangle(
      mx(width * 0.8),
      -height * 0.225,
      width * 0.01,
      height * 0.7,
      {
        angle: -Math.PI * 0.01,
        isStatic: true,
        render: { fillStyle: "white", strokeStyle: "#cccccc", lineWidth: 4 },
      },
    );

    /** Walls */
    const wallL = Bodies.rectangle(-15, height / 2, height, 30, {
      angle: Math.PI / 2,
      isStatic: true,
      restitution: 1,
      render: { fillStyle: "transparent" },
    });
    const wallR = Bodies.rectangle(width + 15, height / 2, height, 30, {
      angle: Math.PI / 2,
      isStatic: true,
      render: { fillStyle: "transparent" },
    });

    const wallM1 = Bodies.rectangle(
      mx(width / 2 - width * 0.09),
      height / 2 - height / 18,
      height / 9,
      width * 0.18,
      {
        angle: Math.PI / 2,
        isStatic: true,
        render: { fillStyle: "transparent" },
      },
    );
    const wallM2 = Bodies.rectangle(
      mx(width / 2 + 5),
      (height * 3) / 4 + 5,
      height / 2,
      10,
      {
        angle: Math.PI / 2,
        isStatic: true,
        render: { fillStyle: "transparent" },
      },
    );

    const wallBottom = Bodies.rectangle(
      mx((width * 4) / 12 + 5),
      height,
      height * 0.6,
      10,
      {
        angle: Math.PI / 2,
        isStatic: true,
        render: { fillStyle: "white", strokeStyle: "#cccccc", lineWidth: 4 },
      },
    );

    /** Floors */
    const floorA = Bodies.rectangle(
      mx(width * 0.16),
      height * 0.95,
      height * width * deltaScreenSize * 0.00001,
      height * width * 0.00001,
      {
        angle: -Math.PI / 3, // 角度反転
        isStatic: true,
        render: { fillStyle: "white", strokeStyle: "#cccccc", lineWidth: 4 },
      },
    );
    Matter.Body.setPosition(floorA, {
      x: floorA.position.x + (floorA.bounds.max.x - floorA.position.x),
      y: floorA.position.y - (floorA.bounds.max.y - floorA.position.y),
    });

    const floorB = Bodies.rectangle(
      mx(width * 0.3),
      height * 0.525,
      height * width * 0.00025,
      height * width * 0.00001,
      {
        angle: Math.PI / 4, // 角度反転
        isStatic: true,
        render: { fillStyle: "white", strokeStyle: "#cccccc", lineWidth: 4 },
      },
    );

    /** Grounds */
    const groundA = Bodies.rectangle(
      mx(width / 12),
      height - (height * 0.075) / 2,
      width / 6,
      height * 0.075,
      {
        isStatic: true,
        render: { fillStyle: "white", strokeStyle: "#cccccc", lineWidth: 4 },
      },
    );
    const groundB = Bodies.rectangle(
      mx((width * 5) / 12),
      height - (height * 0.075) / 2,
      width / 6,
      height * 0.075,
      {
        isStatic: true,
        render: { fillStyle: "white", strokeStyle: "#cccccc", lineWidth: 4 },
      },
    );
    const groundC = Bodies.rectangle(
      mx((width * 2) / 3),
      height / 2 + 7,
      width / 2 + width / 6,
      10,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
          strokeStyle: "transparent",
          lineWidth: 4,
        },
      },
    );

    /** Flipper */
    const flipperShaft = Bodies.circle(
      groundA.bounds.min.x + width * 0.035,
      groundA.position.y,
      width * height * 0.00001,
      {
        isStatic: false,
        render: { fillStyle: "white", strokeStyle: "#cccccc", lineWidth: 4 },
      },
    );

    const flipperPaddle = Matter.Bodies.fromVertices(
      groundA.bounds.min.x + width * 0.06,
      groundA.position.y,
      [
        [
          { x: 0, y: 0 },
          { x: -0.08 * width, y: 0.00001 * width * height },
          { x: -0.08 * width, y: -0.00001 * width * height },
        ],
      ],
      {
        isStatic: false,
        friction: 0,
        frictionStatic: 0,
        restitution: 1000000000000000,
        render: { fillStyle: "white", strokeStyle: "#cccccc", lineWidth: 4 },
      },
    );

    const flipper = Matter.Body.create({
      parts: [flipperPaddle, flipperShaft],
      isStatic: false,
      id: 2,
    });
    Matter.Body.setCentre(
      flipper,
      { x: flipperShaft.position.x, y: flipperShaft.position.y },
      false,
    );
    Matter.Body.setPosition(flipper, {
      x: groundA.bounds.min.x * 0.985,
      y: groundA.position.y * 0.98,
    });

    Matter.Body.setAngularVelocity(flipper, -0.1); // 方向反転

    const flipperTrigger = Bodies.circle(
      groundA.position.x,
      groundA.position.y,
      deltaScreenSize * 0.45,
      {
        isStatic: true,
        id: 2,
        render: { fillStyle: "white", strokeStyle: "#9B3109", lineWidth: 4 },
      },
    );

    /** Mouse */
    const mouse = Matter.Mouse.create(renderRef.current!.canvas);
    renderRef.current!.mouse = mouse;
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    /** Listener */
    const mousedownCallback = (event: any) => {
      if (event.source.body) {
        if (event.source.body.id == 0) {
          setIsSwitchOn((prev) => !prev);
          setIsGenerateOn((prev) => !prev);
        }
        if (event.source.body.id == 2) {
          Matter.Body.setAngularVelocity(flipper, 0.3); // 反転したので正方向へ
        }
      }
    };
    Matter.Events.on(mouseConstraint, "mousedown", mousedownCallback);

    const afterUpdateCallback = () => {
      const minAngle = Math.PI - Math.PI / 9;
      const maxAngle = Math.PI + Math.PI / 3;

      if (flipper.angle < minAngle) {
        Matter.Body.setAngle(flipper, minAngle);
        Matter.Body.setAngularVelocity(flipper, 0);
      }
      if (flipper.angle > maxAngle) {
        Matter.Body.setAngle(flipper, maxAngle);
        Matter.Body.setAngularVelocity(flipper, -0.1);
      }
    };
    Matter.Events.on(engineRef.current!, "afterUpdate", afterUpdateCallback);

    /** Constraints */
    Composite.add(engineRef.current!.world, [
      elementArray,
      bridge,
      striker,
      tubeA,
      tubeB,
      wallL,
      wallM1,
      wallM2,
      wallR,
      wallBottom,
      floorA,
      floorB,
      groundA,
      groundB,
      groundC,
      flipper,
      flipperTrigger,
      mouseConstraint,
      Constraint.create({
        pointA: { x: strikerShaft.position.x, y: strikerShaft.position.y },
        bodyB: striker,
        pointB: { x: 0, y: 0 },
        length: 0,
        stiffness: 0,
        render: { strokeStyle: "white", lineWidth: 2 },
      }),
      Constraint.create({
        pointA: { x: flipperShaft.position.x, y: flipperShaft.position.y },
        bodyB: flipper,
        pointB: { x: 0, y: 0 },
        length: 0,
        stiffness: 0.1,
        render: { strokeStyle: "#cccccc", lineWidth: 2, visible: true },
      }),
      Constraint.create({
        bodyA: tubeB,
        pointA: { x: 0, y: tubeB.bounds.max.y - tubeB.position.y },
        bodyB: bridge.bodies[0],
        length: deltaScreenSize * 1.4,
        stiffness: 0.05,
        render: { strokeStyle: "#cccccc", lineWidth: 2 },
      }),
      Constraint.create({
        bodyA: tubeA,
        pointA: { x: 0, y: tubeA.bounds.max.y - tubeA.position.y },
        bodyB: bridge.bodies[bridge.bodies.length - 1],
        length: deltaScreenSize * 1.4,
        stiffness: 0.05,
        render: { strokeStyle: "#cccccc", lineWidth: 2 },
      }),
    ]);

    /** Boot up */
    Render.run(renderRef.current!);
    Runner.run(runnerRef.current!, engineRef.current!);

    /** Clean up */
    return () => {
      Matter.Events.off(mouseConstraint, "mousedown", mousedownCallback);
      Matter.Events.off(engineRef.current!, "afterUpdate", afterUpdateCallback);

      render.canvas.remove();
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
      if (renderRef.current) Matter.Render.stop(renderRef.current);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);

      engineRef.current = null;
      renderRef.current = null;
      runnerRef.current = null;
    };
  }, [viewFlag, height, width]);

  /** Striker Trigger Handler */
  useEffect(() => {
    setStrikerVelocityValue(isStrikerOn ? 0.15 : 0);
    Matter.Events.on(engineRef.current!, "beforeUpdate", callback);
    return () => {
      if (engineRef.current) {
        Matter.Events.off(engineRef.current, "beforeUpdate", callback);
      }
    };
  }, [viewFlag, isStrikerOn]);

  /** Callback reference for regulation and dispose */
  const callback = useCallback(() => {
    if (engineRef.current && engineRef.current.world.bodies.length > 0) {
      const strikerFetched = engineRef.current.world.bodies.find(
        (body) => body.id === 0,
      );
      if (strikerFetched) {
        Matter.Body.setAngularVelocity(strikerFetched, strikerVelocityValue);
      }
    }
  }, [isStrikerOn]);

  /** Generate Cube Handler */
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isGenerateOn) {
        const cubes = Matter.Composites.stack(
          width * 0.2,
          height * -0.2,
          3,
          3,
          0,
          0,
          (x: any, y: any) =>
            Bodies.rectangle(x, y, deltaScreenSize, deltaScreenSize, {
              density: 0.00015,
              frictionAir: 0,
              friction: 0.025,
              restitution: 0.2,
            }),
        );
        if (engineRef.current) {
          Composite.add(engineRef.current.world, [cubes]);
        }
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, [isGenerateOn, width, height]);

  return <div ref={canvasRef} />;
};

export default MatterJs2;
