import React, { useEffect, useRef } from "react";
import Matter, { Constraint } from "matter-js";

type MatterProps = {
  viewFlag: boolean;
  height: number;
  width: number;
};

const MatterJs1 = ({ viewFlag, height, width }: MatterProps) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  useEffect(() => {
    const { Engine, Render, Runner, Bodies, Composite, Constraint } = Matter;

    /**
     * Initial Set up
     */

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
        background: "black",
      },
    });
    renderRef.current = render;

    /**
     * Objects
     */

    const elementArray = [];

    for (let i = 0; i < 10; i++) {
      const boxL = Bodies.rectangle(
        (width * 3) / 4,
        height * -0.1 + i * 15,
        30,
        30,
      );
      const boxR = Bodies.rectangle(
        (width * 3) / 4 + 15,
        height * -0.1 + i * 15,
        30,
        30,
      );
      elementArray.push(boxL, boxR);
    }

    var group = Matter.Body.nextGroup(true);

    const bridge = Matter.Composites.stack(
      (width * 2) / 4,
      height * 0.1,
      14, // 縦列の数
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
            fillStyle: "#888888",
          },
        });
      },
    );

    // 各チェーンの生成
    Matter.Composites.chain(bridge, 0.3, 0, -0.3, 0, {
      render: {
        visible: true,
        strokeStyle: "#000000", // 生成時に赤色に設定
        lineWidth: 2, // 太さを設定
      },
    });

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
      height / 2 + 5,
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

    // ワールドにオブジェクトを追加
    Composite.add(engine.world, [
      ...elementArray,
      bridge,
      floorA,
      floorB,
      groundA,
      Constraint.create({
        pointA: { x: (width * 3) / 4 - 100, y: height / 4 },
        bodyB: bridge.bodies[0],
        pointB: { x: -25, y: 0 },
        length: 2,
        stiffness: 0.5,
      }),
      Constraint.create({
        pointA: { x: (width * 3) / 4 + 300, y: height / 4 },
        bodyB: bridge.bodies[bridge.bodies.length - 1],
        pointB: { x: 25, y: 0 },
        length: 2,
        stiffness: 0.5,
      }),
      groundB,
      groundC,
    ]);

    Render.run(render); // レンダラー（映写機）を起動
    const runner = Runner.create(); //映写機(フレームの描画)のハンドルを作成(create)
    Runner.run(runner, engine); //映写機(フレームの描画)のハンドルを回す(run)

    // クリーンアップ処理
    return () => {
      // remove(): 不要になったDOM要素をブラウザから削除してリソース開放
      // ReactがDOMの状態を管理しているのでコンポーネントが破棄されると、
      // Reactが自動でcanvasRefの値を更新する
      // なので、手動でnullを代入して接続を切断する必要はない。
      render.canvas.remove();
      // Matter.jsの内部オブジェクトでReactの管理外なので
      // 手動で参照への接続を切断する必要がある
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      engineRef.current = null; // 参照の接続を切断
      renderRef.current = null;
    };
  }, [viewFlag, height, width]); // サイズが変更されるたびに再初期化

  return <div ref={canvasRef}></div>;
};

export default MatterJs1;
