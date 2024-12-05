import React, { useCallback, useEffect, useRef, useState } from "react";
import Matter, { Constraint } from "matter-js";

type MatterProps = {
  viewFlag: boolean;
  height: number;
  width: number;
};

const MatterJs1 = ({ viewFlag, height, width }: MatterProps) => {
  const [isStrikerOn, setIsSwitchOn] = useState<boolean>(true);
  const [isGenerateOn, setIsGenerateOn] = useState<boolean>(false);
  const [strikerVelocityValue, setStrikerVelocityValue] = useState<number>(0);

  const canvasRef = useRef<HTMLDivElement | null>(null); // div 要素

  // Matter.js 参照
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  // width * heightの値の変化を
  // 対数で正規化したキューブの動的サイズ
  const logWidth = Math.log(width); // 幅の対数
  const logHeight = Math.log(height); // 高さの対数
  const logAverage = (logWidth + logHeight) / 2; // 対数の平均
  const deltaScreenSize = Math.exp(logAverage) * 0.03; // 元のスケールに戻してスケール係数をかける

  const { Engine, Render, Runner, Bodies, Composite, Constraint } = Matter;

  /**
   * Initial Set Up
   */
  useEffect(() => {
    var group = Matter.Body.nextGroup(true);

    // heightとwidthの変更をキャッチするたびに
    // 古いレンダラーやエンジンを完全に破棄
    if (engineRef.current) {
      // Matter.js内部で使用されているリソースや状態を
      // 適切にリセットするためのメソッドです。
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null; // 手動でnullにして参照を切断
    }

    if (renderRef.current) {
      // Matter.js内部で使用されているリソースや状態を
      // 適切にリセットするためのメソッドです。
      Matter.Render.stop(renderRef.current);
      renderRef.current.canvas.remove(); // キャンバスを削除
      renderRef.current = null; // 手動でnullにして参照を切断
    }

    if (runnerRef.current) {
      // Matter.js内部で使用されているリソースや状態を
      // 適切にリセットするためのメソッドです。
      Matter.Runner.stop(runnerRef.current);
      runnerRef.current = null; // 手動でnullにして参照を切断
    }

    // 新しいエンジンの作成
    const engine = Engine.create();
    engineRef.current = engine;

    // 新しいレンダラーの作成
    const render = Render.create({
      element: canvasRef.current || undefined, // 描画先のcanvas(スクリーン)要素を指定
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: "white",
      },
    });
    renderRef.current = render;

    // 新しいランナーの作成
    const runner = Runner.create(); //映写機(フレームの描画)のハンドルを作成(create)
    runnerRef.current = runner;

    /**
     * Objects
     */
    const elementArray = Matter.Composites.stack(
      width * 0.7,
      height * -0.2,
      3, // 横方向のキューブの数
      3, // 縦方向のキューブの数
      0, // 横の余白
      0, // 縦の余白
      (x: any, y: any) => {
        return Bodies.rectangle(
          x,
          y,
          deltaScreenSize, // 対数変換後のサイズ
          deltaScreenSize, // 対数変換後のサイズ
          {
            density: 0.00015,
            frictionAir: 0,
            friction: 0.025,
            restitution: 0.2,
          },
        );
      },
    );

    /**
     * Bridge
     */
    const bridge = Matter.Composites.stack(
      (width * 2) / 4,
      height * 0.1,
      8, // 縦列の数
      1, // 横列の数
      10, // 縦列の余白
      0, // 横列の余白
      (x: any, y: any) => {
        return Bodies.rectangle(x, y, 15, 7.5, {
          collisionFilter: {
            group: group,
          },
          density: 0.005,
          frictionAir: 0.05,
          render: {
            fillStyle: "#cccccc",
          },
        });
      },
    );

    Matter.Composites.chain(bridge, 0.3, 0, -0.3, 0, {
      stiffness: 0.5,
      length: 2,
      render: {
        visible: true,
        strokeStyle: "#000000",
        lineWidth: 2, // 太さを設定
      },
    });

    /**
     * Striker
     */
    const strikerShaft = Bodies.circle(
      (width * 3) / 4,
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
        collisionFilter: {
          category: 0x0001, // 固有のカテゴリを割り当てる
          mask: 0x0000, // どのカテゴリとも衝突しないようにする
        },
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
        friction: 0, // 摩擦ゼロ
        frictionStatic: 0, // 静止摩擦ゼロ
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

    // Matter.Body.setPosition(striker, {
    //   x: (width * 3) / 4 + 5,
    //   y: height * 0.1 + 185,
    // });

    /**
     * Tube
     */
    const tubeA = Bodies.rectangle(
      width * 0.7,
      -height * 0.225,
      width * 0.01,
      height * 0.7,
      {
        angle: -Math.PI * 0.01,
        isStatic: true,
        render: {
          fillStyle: "white",
          strokeStyle: "#cccccc",
          lineWidth: 4,
        },
      },
    );

    const tubeB = Bodies.rectangle(
      width * 0.8,
      -height * 0.225,
      width * 0.01,
      height * 0.7,
      {
        angle: Math.PI * 0.01,
        isStatic: true,
        render: {
          fillStyle: "white",
          strokeStyle: "#cccccc",
          lineWidth: 4,
        },
      },
    );

    /**
     * Wall
     */

    const wallL = Bodies.rectangle(-15, height / 2, height, 30, {
      angle: Math.PI / 2,
      isStatic: true,
      restitution: 1,
      render: {
        fillStyle: "transparent",
      },
    });

    const wallM1 = Bodies.rectangle(
      width / 2 - width * 0.09,
      height / 2 - height / 18,
      height / 9,
      width * 0.18,
      {
        angle: Math.PI / 2,
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
      },
    );

    const wallM2 = Bodies.rectangle(
      width / 2 + 5,
      (height * 3) / 4 + 5,
      height / 2,
      10,
      {
        angle: Math.PI / 2,
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
      },
    );

    const wallR = Bodies.rectangle(width + 15, height / 2, height, 30, {
      angle: Math.PI / 2,
      isStatic: true,
      render: {
        fillStyle: "transparent",
      },
    });

    const wallBottom = Bodies.rectangle(
      (width * 4) / 12 + 5,
      height,
      height * 0.6,
      10,
      {
        angle: Math.PI / 2,
        isStatic: true,
        render: {
          fillStyle: "white",
          strokeStyle: "#cccccc",
          lineWidth: 4,
        },
      },
    );

    /**
     * Floor
     */
    const floorA = Bodies.rectangle(
      width * 0.16,
      height * 0.95,
      height * width * deltaScreenSize * 0.00001,
      height * width * 0.00001,
      {
        angle: Math.PI / 3,
        isStatic: true,
        render: {
          fillStyle: "white",
          strokeStyle: "#cccccc",
          lineWidth: 4,
        },
      },
    );
    Matter.Body.setPosition(floorA, {
      x: floorA.position.x - (floorA.bounds.max.x - floorA.position.x),
      y: floorA.position.y - (floorA.bounds.max.y - floorA.position.y),
    });

    const floorB = Bodies.rectangle(
      width * 0.3,
      height * 0.525,
      height * width * 0.00025,
      height * width * 0.00001,
      {
        angle: -Math.PI / 4,
        isStatic: true,
        render: {
          fillStyle: "white",
          strokeStyle: "#cccccc",
          lineWidth: 4,
        },
      },
    );

    /**
     * Ground
     */
    const groundA = Bodies.rectangle(
      width / 12,
      height - (height * 0.075) / 2,
      width / 6,
      height * 0.075,
      {
        isStatic: true,
        render: {
          fillStyle: "white",
          strokeStyle: "#cccccc",
          lineWidth: 4,
        },
      },
    );

    const groundB = Bodies.rectangle(
      width / 12 + (width / 6) * 2,
      height - (height * 0.075) / 2,
      width / 6,
      height * 0.075,
      {
        isStatic: true,
        render: {
          fillStyle: "white",
          strokeStyle: "#cccccc",
          lineWidth: 4,
        },
      },
    );

    const groundC = Bodies.rectangle(
      (width * 3) / 4 - width / 12,
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

    /**
     * Flipper
     */
    const flipperShaft = Bodies.circle(
      groundA.bounds.max.x - width * 0.035,
      groundA.position.y,
      width * height * 0.00001,
      {
        isStatic: false,
        render: {
          fillStyle: "white",
          strokeStyle: "#cccccc",
          lineWidth: 4,
        },
      },
    );

    const flipperPaddle = Matter.Bodies.fromVertices(
      groundA.bounds.max.x - width * 0.01,
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
        render: {
          fillStyle: "white",
          strokeStyle: "#cccccc",
          lineWidth: 4,
        },
      },
    );

    const flipper = Matter.Body.create({
      parts: [flipperPaddle, flipperShaft],
      isStatic: false,
      id: 2,
    });

    Matter.Body.setCentre(
      flipper,
      {
        x: flipperShaft.position.x,
        y: flipperShaft.position.y,
      },
      false,
    );

    Matter.Body.setPosition(flipper, {
      x: groundA.bounds.max.x * 1.075,
      y: groundA.position.y * 0.98,
    });

    Matter.Body.setAngularVelocity(flipper, 0.1);

    const flipperTrigger = Bodies.circle(
      groundA.position.x,
      groundA.position.y,
      deltaScreenSize * 0.45,
      {
        isStatic: true,
        id: 2,
        render: {
          fillStyle: "white",
          strokeStyle: "#9B3109",
          lineWidth: 4,
        },
      },
    );

    /**
     * Mouse
     */
    const mouse = Matter.Mouse.create(renderRef.current.canvas);

    renderRef.current.mouse = mouse;

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    /**
     * Listner
     */

    /* Dispose用のリスナーコールバック参照 */
    const mousedownCallback = (event: any) => {
      if (event.source.body) {
        /* strikerの場合 */
        if (event.source.body.id == 0) {
          setIsSwitchOn((prev) => !prev);
          setIsGenerateOn((prev) => !prev);
        }

        /* flipperTriggerの場合 */
        if (event.source.body.id == 2) {
          Matter.Body.setAngularVelocity(flipper, -0.3);
        }
      }
    };

    Matter.Events.on(mouseConstraint, "mousedown", mousedownCallback);

    const afterUpdateCallback = (event: any) => {
      const minAngle = -Math.PI / 3;
      const maxAngle = Math.PI / 9;

      if (flipper.angle < minAngle) {
        Matter.Body.setAngle(flipper, minAngle);
        Matter.Body.setAngularVelocity(flipper, 0.1);
      }

      if (flipper.angle > maxAngle) {
        Matter.Body.setAngle(flipper, maxAngle);
        Matter.Body.setAngularVelocity(flipper, 0);
      }
    };

    Matter.Events.on(engineRef.current, "afterUpdate", afterUpdateCallback);

    /**
     * Add World
     */
    Composite.add(engineRef.current.world, [
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
        /* setCenterで設定した strikerShaft の重心が初期座標 */
        pointB: { x: 0, y: 0 },
        length: 0,
        stiffness: 0,
        render: { strokeStyle: "white", lineWidth: 2 },
      }),
      Constraint.create({
        pointA: {
          x: flipperShaft.position.x,
          y: flipperShaft.position.y,
        },
        bodyB: flipper,
        /* setCenterで設定した flipperShaft の重心が初期座標 */
        pointB: { x: 0, y: 0 },
        length: 0,
        stiffness: 0.1,
        render: { strokeStyle: "#cccccc", lineWidth: 2, visible: true },
      }),
      Constraint.create({
        bodyA: tubeA,
        pointA: { x: 0, y: tubeA.bounds.max.y - tubeA.position.y },
        bodyB: bridge.bodies[0],
        pointB: { x: 0, y: 0 },
        length: deltaScreenSize * 1.4,
        stiffness: 0.05,
        render: { strokeStyle: "#cccccc", lineWidth: 2 },
      }),
      Constraint.create({
        bodyA: tubeB,
        pointA: { x: 0, y: tubeB.bounds.max.y - tubeB.position.y },
        bodyB: bridge.bodies[bridge.bodies.length - 1],
        pointB: { x: 0, y: 0 },
        length: deltaScreenSize * 1.4,
        stiffness: 0.05,
        render: { strokeStyle: "#cccccc", lineWidth: 2 },
      }),
      // Constraint.create({
      //   pointA: {
      //     x: (width * 3) / 4,
      //     y: height * 0.2,
      //   },
      //   bodyB: bridge.bodies[4],
      //   pointB: { x: 0, y: 0 },
      //   length: 0,
      //   stiffness: 0.01,
      //   render: { strokeStyle: "white", lineWidth: 1, visible: false },
      // }),
    ]);

    /**
     * Boot up
     */
    Render.run(renderRef.current); // レンダラー（映写機）を起動
    Runner.run(runnerRef.current, engineRef.current); //映写機(フレームの描画)のハンドルを回す(run)

    /**
     * Clean up
     */
    return () => {
      Matter.Events.off(mouseConstraint, "mousedown", mousedownCallback);
      Matter.Events.off(engineRef.current, "afterUpdate", afterUpdateCallback);

      // remove(): 不要になったDOM要素をブラウザから削除してリソース開放
      // ReactがDOMの状態を管理しているのでコンポーネントが破棄されると、
      // Reactが自動でcanvasRefの値を更新する
      // なので、手動でnullを代入して接続を切断する必要はない。
      render.canvas.remove();
      // Matter.jsの内部オブジェクトでReactの管理外なので
      // 手動で参照への接続を切断する必要がある
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
      if (renderRef.current) Matter.Render.stop(renderRef.current);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      engineRef.current = null; // 参照の接続を切断
      renderRef.current = null;
      runnerRef.current = null;
    };
  }, [viewFlag, height, width]); // サイズが変更されるたびに再初期化

  /**
   * Striker Trigger Handler
   */
  useEffect(() => {
    /* 一定の回転速度に更新し続けるリスナー */
    setStrikerVelocityValue(isStrikerOn ? -0.15 : 0);
    Matter.Events.on(engineRef.current, "beforeUpdate", callback);

    return () => {
      if (engineRef.current) {
        Matter.Events.off(engineRef.current, "beforeUpdate", callback);
      }
    };
  }, [viewFlag, isStrikerOn]);

  /*  Callback reference for regislation and dispose */
  const callback = useCallback(
    (e: any) => {
      if (engineRef.current && engineRef.current.world.bodies.length > 0) {
        const strikerFetched = engineRef.current.world.bodies.find(
          (body) => body.id === 0,
        );
        if (strikerFetched) {
          console.log("callback triggered");
          Matter.Body.setAngularVelocity(strikerFetched, strikerVelocityValue);
        }
      }
    },
    [isStrikerOn],
  );

  /**
   * Generate Cube Handler
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isGenerateOn) {
        const cubes = Matter.Composites.stack(
          width * 0.7,
          height * -0.2,
          3, // 横方向のキューブの数
          3, // 縦方向のキューブの数
          0, // 横の余白
          0, // 縦の余白
          (x: any, y: any) => {
            return Bodies.rectangle(
              x,
              y,
              deltaScreenSize, // 対数変換後のサイズ
              deltaScreenSize, // 対数変換後のサイズ
              {
                density: 0.00015,
                frictionAir: 0,
                friction: 0.025,
                restitution: 0.2,
              },
            );
          },
        );

        if (engineRef.current) {
          Composite.add(engineRef.current.world, [cubes]);
        }
      }
    }, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, [isGenerateOn, width, height]);

  return <div ref={canvasRef}></div>;
};

export default MatterJs1;
