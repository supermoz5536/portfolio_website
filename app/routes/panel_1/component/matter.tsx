import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

type MatterProps = {
  height: number;
  width: number;
};

const MatterJsContentBlock1 = ({ height, width }: MatterProps) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  useEffect(() => {
    const { Engine, Render, Runner, Bodies, Composite } = Matter;

    // 古いレンダラーやエンジンを完全に破棄
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current); // エンジンをクリア
      engineRef.current = null;
    }
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current); // レンダラーを停止
      renderRef.current.canvas.remove(); // キャンバスを削除
      renderRef.current = null;
    }

    // 新しいエンジンとレンダラーの作成
    const engine = Engine.create();
    engineRef.current = engine;

    const render = Render.create({
      element: canvasRef.current || undefined,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: "black",
      },
    });
    renderRef.current = render;

    // ワールドにオブジェクトを追加
    const boxA = Bodies.rectangle(width / 2 - 50, height / 2, 80, 80);
    const boxB = Bodies.rectangle(width / 2 + 50, height / 2, 80, 80);
    const ground = Bodies.rectangle(width / 2, height - 20, width, 40, {
      isStatic: true,
    });
    Composite.add(engine.world, [boxA, boxB, ground]);

    // エンジンとレンダラーを開始
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // クリーンアップ処理
    return () => {
      Matter.Render.stop(render); // レンダラー停止
      render.canvas.remove(); // キャンバス削除
      Matter.Engine.clear(engine); // エンジンをクリア
      engineRef.current = null;
      renderRef.current = null;
    };
  }, [height, width]); // サイズが変更されるたびに再初期化

  return <div ref={canvasRef}></div>;
};

export default MatterJsContentBlock1;
