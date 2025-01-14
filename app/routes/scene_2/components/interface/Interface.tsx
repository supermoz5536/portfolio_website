/// regionData の position.top が panel1 が含まれると
/// 0.5pxだけズレるが、一旦このまま開発を進める。

import "./interface.css";
import { useEffect, useRef, useState } from "react";
import ThreeInterface from "../../../../store/three_interface_store";

export function MovementPad() {
  const padRef = useRef<any>();
  const regionRef = useRef<any>();
  const handleRef = useRef<any>();

  const [updateRepeatTimeout, setUpdateRepeatTimeout] = useState<any>();
  const [isTouched, setIsTouched] = useState<boolean>(false);

  let regionData: any = {};
  let handleData: any = {};

  const setMoveDelta = ThreeInterface((state: any) => state.setMoveDelta);

  useEffect(() => {
    /**
     * Setup values
     */
    alignAndConfigPad();

    /**
     * Setup Listeners
     */

    document.addEventListener("resize", (event) => alignAndConfigPad());

    /**
     * Touch Pad
     */

    document.addEventListener("touchstart", (event) => {
      setIsTouched(true);

      /* Re Position Pad */
      const scene2Element = document.getElementById("scene2");
      padRef.current.style.top =
        event.touches[0].pageY - scene2Element!.offsetLeft + "px";
      padRef.current.style.left = event.touches[0].pageX + "px";

      /* Re Calculate RegionData and HandleData */
      alignAndConfigPad();

      handleRef.current.style.opacity = 1;
      padRef.current.style.opacity = 1;

      update(event.touches[0].pageX, event.touches[0].pageY);
    });

    document.addEventListener("touchmove", (event) => {
      // stale closure の問題を避けるため
      // useStateの更新関数引数を用いるテクニックを採用
      // setState の prev は、
      // リスナーのセット時のクロージャによる古い値ではなく
      // 常に最新の値を参照する
      setIsTouched((prev) => {
        if (prev) {
          update(event.touches[0].pageX, event.touches[0].pageY);
        }
        return prev;
      });
    });

    document.addEventListener("touchend", () => {
      handleRef.current.style.opacity = 0;
      padRef.current.style.opacity = 0;
      setIsTouched(false);
      resetHandlePosition();
    });

    document.addEventListener("touchcancel", () => {
      handleRef.current.style.opacity = 0;
      padRef.current.style.opacity = 0;
      setIsTouched(false);
      resetHandlePosition();
    });

    /**
     * Mouse
     */

    document.addEventListener("mousedown", (event) => {
      setIsTouched(true);

      /* Re Position Pad */

      handleRef.current.style.opacity = 1;
      padRef.current.style.opacity = 1;
      padRef.current.style.transform = "translate(-50%, -50%) scale(1.0)";

      const scene2Element = document.getElementById("scene2");
      padRef.current.style.top = event.pageY - scene2Element!.offsetLeft + "px";
      padRef.current.style.left = event.pageX + "px";

      /* Re Calculate RegionData and HandleData */
      alignAndConfigPad();

      update(event.pageX, event.pageY);
    });

    document.addEventListener("mousemove", (event) => {
      setIsTouched((prev) => {
        if (prev) {
          update(event.pageX, event.pageY);
        }
        return prev;
      });
    });

    document.addEventListener("mouseup", () => {
      handleRef.current.style.opacity = 0;
      padRef.current.style.opacity = 0;
      padRef.current.style.transform = "translate(-50%, -50%) scale(0.0)";
      setIsTouched(false);
      resetHandlePosition();
    });
  }, []);

  function alignAndConfigPad() {
    if (regionRef.current && handleRef.current) {
      /**
       * Calculate regionData
       */

      const scene2Element = document.getElementById("scene2");

      // ViewPort 左上(0, 0)が基準
      const regionRect = regionRef.current.getBoundingClientRect();

      // グローバル 左上(0, 0)が基準
      const regionBodyOffsetTop =
        regionRef.current.getBoundingClientRect().top + window.scrollY;
      const regionBodyOffsetLeft =
        regionRef.current.getBoundingClientRect().left;

      regionData = {
        width: regionRect.width, // .cssで指定した横幅(px)
        height: regionRect.height,
        globalOffset: {
          top: regionBodyOffsetTop, // body(0, 0)との距離
          left: regionBodyOffsetLeft,
        },
        localOffset: {
          top: regionBodyOffsetTop - scene2Element!.offsetTop, // #scene2(0, 0)との距離
          left: regionBodyOffsetLeft,
        },
        radius: regionRect.width / 2,
        centerX: regionRect.width / 2,
        centerY: regionRect.height / 2,
      };

      /**
       * Calculate handleData
       */
      const handleRect = handleRef.current.getBoundingClientRect();
      handleData = {
        widht: handleRect.width,
        height: handleRect.height,
        radius: handleRect.width / 2,
      };

      // Adjust region radius for wrapping a whole handle.
      regionData.radius -= handleData.radius;
    }
  }

  function update(pageX: number, pageY: number) {
    // PageX(Y)は、グローバル座標基準の(0, 0)
    // region の左上部分(0, 0)を基準としたローカル座標に変換する
    // その場合グローバル座標からローカルの基準座標をマイナスすれば良い
    let newTop = pageY - regionData.localOffset.top;
    let newLeft = pageX - regionData.localOffset.left;

    // Math.pow() を使って、ハンドルの移動先 (newLeft, newTop) から
    // ジョイスティックの中心 (centerX, centerY) までの 距離の二乗 の値を
    // ピタゴラスの定理を使用して算取得
    let distance2Pow =
      Math.pow(regionData.centerX - newLeft, 2) +
      Math.pow(regionData.centerY - newTop, 2);

    // distance² が radius² より大きい場合、
    // ハンドルが円の外に出ていると判断
    if (distance2Pow > Math.pow(regionData.radius, 2)) {
      // ハンドルの位置を円周上に制限
      // Math.cos / Math.sin を使って、角度に基づいてハンドルの位置を計算しています。
      // 半径の長さ (radius) に基づいて、円の外周上にハンドルを配置しています。
      let angle = Math.atan2(
        newTop - regionData.centerY,
        newLeft - regionData.centerX,
      );
      newLeft = Math.cos(angle) * regionData.radius + regionData.centerX;
      newTop = Math.sin(angle) * regionData.radius + regionData.centerY;
    }

    // 数値が細かいと動きがチラつくため
    // 小数第1位で丸める際の定型の記述
    newTop = Math.round(newTop * 10) / 10;
    newLeft = Math.round(newLeft * 10) / 10;

    // インラインスタイルで直接 CSS を変更
    // region の中心と handle の中心との距離を delta　で扱いたいので
    // region の左上の座標と handle の中心座標を一致させる
    handleRef.current.style.top = newTop - handleData.radius + "px";
    handleRef.current.style.left = newLeft - handleData.radius + "px";

    // parseInt で string を intに変換(第二引数なしの場合は数字以外の文字が現れた時点で 解釈を停止 )
    let deltaX = newLeft - regionData.centerX;
    // Y軸は下に行くほど(+)なので、符号が反対になる
    let deltaY = -(newTop - regionData.centerY);
    // 線形補完の公式を用いて
    // -(半径) ~ +(半径) の範囲を
    // -2 ~ +2 に正規化している
    deltaX =
      -2 +
      ((2 + 2) * (deltaX - -regionData.radius)) /
        (regionData.radius - -regionData.radius);

    deltaY =
      -2 +
      ((2 + 2) * (deltaY - -regionData.radius)) /
        (regionData.radius - -regionData.radius);

    // 小数点第１位で丸める
    deltaX = Math.round(deltaX * 10) / 10;
    deltaY = Math.round(deltaY * 10) / 10;

    // deltaX: -2 ~ 2
    // deltaY: -2 ~ 2
    setMoveDelta(deltaX, deltaY);
  }

  function resetHandlePosition() {
    if (updateRepeatTimeout) clearTimeout(updateRepeatTimeout);

    /* Reset UI */
    handleRef.current.opacity = 1.1;

    // -2: region の border: 2px の分だけ中心からズレるので offset
    handleRef.current.style.top =
      regionData.centerY - handleData.radius - 2 + "px";
    handleRef.current.style.left =
      regionData.centerX - handleData.radius - 2 + "px";

    /* Reset Store */
    setMoveDelta(0, 0);
  }

  return (
    <>
      <div
        ref={padRef}
        className="movement-pad"
        style={{
          position: "absolute", // 親の親コンポーネントの scene_2　のトップの div　の　relative　に従属
          zIndex: 5,
          width: "150px",
          height: "150px",
          top: "0px",
          left: "0px",
          transform: "translate(-50%, -50%)",
          opacity: 0,
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <div ref={regionRef} className="region">
          <div
            ref={handleRef}
            className="handle"
            style={{
              position: "absolute",
              zIndex: 10,
              height: "30px",
              width: "30px",
              top: "0px",
              left: "0px",
              background:
                "radial-gradient(rgba(215, 225, 255, 0.7) 0%, rgba(255, 255, 255, 1.0) 100%)",
              borderRadius: "50%",
              boxShadow: "0px 0px 7px rgba(195, 205, 245, 0.9)",
              textAlign: "center",
              font: '24px/44px "Courier New", Courier, monospace',
              userSelect: "none",
              opacity: 0,
            }}
          ></div>
        </div>
      </div>
    </>
  );
}
