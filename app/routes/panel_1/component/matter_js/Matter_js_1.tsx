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
  const [velocityValue, setVelocityValue] = useState<number>(0);

  const canvasRef = useRef<HTMLDivElement | null>(null); // div 要素

  // Matter.js 参照
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  const { Engine, Render, Runner, Bodies, Composite, Constraint } = Matter;

  /**
   * Initial Set Up
   */
  useEffect(() => {
    console.log("Initial Set Up");

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
    const elementArray = [];

    for (let i = 0; i < 5; i++) {
      const cubeL = Bodies.rectangle(
        (width * 3) / 4,
        height * -0.2 + i * 15,
        30,
        30,
        {
          density: 0.0001,
          frictionAir: 0,
          restitution: 0.2,
        },
      );

      const cubeC = Bodies.rectangle(
        (width * 3) / 4 + 15,
        height * -0.2 + i * 15,
        30,
        30,
        {
          density: 0.0001,
          frictionAir: 0,
          restitution: 0.2,
        },
      );

      const cubeR = Bodies.rectangle(
        (width * 3) / 4 + 30,
        height * -0.2 + i * 15,
        30,
        30,
        {
          density: 0.0001,
          frictionAir: 0,
          restitution: 0.2,
        },
      );

      elementArray.push(cubeL, cubeC, cubeR);
    }

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
    const shaft = Bodies.circle((width * 3) / 4, height / 4, 10, {
      isStatic: false,
      render: {
        fillStyle: "white",
        strokeStyle: "#9B3109",
        lineWidth: 4,
      },
    });

    const pole = Bodies.rectangle(
      shaft.position.x,
      shaft.position.y + 10 + 4 + 70,
      5,
      140,
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
      15,
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
      parts: [shaft, pole, hammer],
      isStatic: false,
      id: 0,
    });

    Matter.Body.setCentre(
      striker,
      { x: shaft.position.x, y: shaft.position.y },
      false,
    );

    Matter.Body.setPosition(striker, {
      x: (width * 3) / 4 + 100,
      y: height / 4 + 25,
    });

    /**
     * Wall
     */
    const wallA = Bodies.rectangle(
      (width * 3) / 4 - 60,
      height * 0.1,
      10,
      300,
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

    const wallB = Bodies.rectangle(
      (width * 3) / 4 + 72,
      height * 0.1,
      10,
      300,
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
     * Floor
     */
    const floorA = Bodies.rectangle(width * 0.1, height * 0.8, 300, 10, {
      angle: Math.PI / 3,
      isStatic: true,
      render: {
        fillStyle: "white",
        strokeStyle: "#cccccc",
        lineWidth: 4,
      },
    });

    const floorB = Bodies.rectangle(width * 0.275, height * 0.625, 200, 10, {
      angle: -Math.PI / 3,
      isStatic: true,
      render: {
        fillStyle: "white",
        strokeStyle: "#cccccc",
        lineWidth: 4,
      },
    });

    /**
     * Ground
     */
    const groundA = Bodies.rectangle(width / 12, height - 20, width / 6, 40, {
      isStatic: true,
      render: {
        fillStyle: "white",
        strokeStyle: "#cccccc",
        lineWidth: 4,
      },
    });

    const groundB = Bodies.rectangle(
      width / 12 + (width / 6) * 2,
      height - 20,
      width / 6,
      40,
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
          fillStyle: "white",
          strokeStyle: "white",
          lineWidth: 4,
        },
      },
    );

    /**
     * Group
     */
    const compositeGroup1 = Composite.create();
    Composite.add(compositeGroup1, [...elementArray, bridge, wallA, wallB]);
    Composite.translate(compositeGroup1, { x: 100, y: -170 });

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
    Matter.Events.on(mouseConstraint, "mousedown", (event) => {
      if (event.source.body) {
        /* strikerの場合 */
        if (event.source.body.id == 0) {
          setIsSwitchOn((prev) => !prev);
          setIsGenerateOn((prev) => !prev);
        }
      }
    });

    /**
     * Add World
     */
    Composite.add(engineRef.current.world, [
      ...elementArray,
      bridge,
      striker,
      wallA,
      wallB,
      floorA,
      floorB,
      groundA,
      groundB,
      groundC,
      mouseConstraint,
      Constraint.create({
        pointA: { x: shaft.position.x, y: shaft.position.y },
        bodyB: striker,
        /* setCenterで設定した Striker の重心が初期座標 */
        pointB: { x: 0, y: 0 },
        length: 0,
        stiffness: 0,
        render: { strokeStyle: "white", lineWidth: 2 },
      }),
      Constraint.create({
        bodyA: wallA,
        pointA: { x: 0, y: wallA.bounds.max.y - wallA.position.y },
        bodyB: bridge.bodies[0],
        pointB: { x: 0, y: 0 },
        length: 40,
        stiffness: 0.05,
        render: { strokeStyle: "#cccccc", lineWidth: 2 },
      }),
      Constraint.create({
        bodyA: wallB,
        pointA: { x: 0, y: wallB.bounds.max.y - wallB.position.y },
        bodyB: bridge.bodies[bridge.bodies.length - 1],
        pointB: { x: 0, y: 0 },
        length: 40,
        stiffness: 0.05,
        render: { strokeStyle: "#cccccc", lineWidth: 2 },
      }),
      Constraint.create({
        pointA: { x: (width * 3) / 4 + 100, y: height * 0.14 },
        bodyB: bridge.bodies[4],
        pointB: { x: 0, y: 0 },
        length: 0,
        stiffness: 0.01,
        render: { strokeStyle: "white", lineWidth: 1 },
      }),
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
    setVelocityValue(isStrikerOn ? -0.15 : 0);
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
          Matter.Body.setAngularVelocity(strikerFetched, velocityValue);
        }
      }
    },
    [isStrikerOn],
  );

  /**
   * Generate Cube Handler
   */
  useEffect(() => {
    if (isGenerateOn) {
      const cubes = Matter.Composites.stack(
        (width * 3) / 4,
        height * -0.2 + 0 * 15,
        10,
        2,
        0,
        0,
        (x: any, y: any) => {
          return Bodies.rectangle(x, y, 30, 30, {
            density: 0.0001,
            frictionAir: 0,
            restitution: 0.2,
          });
        },
      );

      if (engineRef.current) {
        Composite.add(engineRef.current.world, [cubes]);
      }
    }
  }, [isGenerateOn]);

  return <div ref={canvasRef}></div>;
};

export default MatterJs1;
