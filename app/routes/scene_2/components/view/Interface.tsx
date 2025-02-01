/// regionData の position.top が panel1 が含まれると
/// 0.5pxだけズレるが、一旦このまま開発を進める。

import { useEffect, useRef, useState } from "react";
import ThreeInterfaceStore from "../../../../store/three_interface_store";
import { useSystemStore } from "../../../../store/system_store";
import ThreePlayerStore from "../../../../store/three_player_store";
import ThreeContentsStore from "../../../../store/three_contents_store";

let isFirstTry = true;

export function MovementPad() {
  const padRef = useRef<any>();
  const regionRef = useRef<any>();
  const handleRef = useRef<any>();

  const isContentSelectedMouseDownRef = useRef<any>(false);
  const isPlayerFocusedRef = useRef<any>(true);
  const isNoneSelectedRef = useRef<any>(false);
  const isActicatedRef = useRef<any>(false);
  const isTouchedRef = useRef<any>(false);

  const [updateRepeatTimeout, setUpdateRepeatTimeout] = useState<any>();

  const setIsPlayerFocus = useSystemStore((state: any) => state.setIsPlayerFocus); // prettier-ignore
  const setMoveDelta = ThreeInterfaceStore((state: any) => state.setMoveDelta);
  const setIsPlayerMoved = ThreePlayerStore((state: any) => state.setIsPlayerMoved); // prettier-ignore
  const setIsContentSelectedMouseDown = ThreeContentsStore((state: any) => state.setIsContentSelectedMouseDown); // prettier-ignore
  const setIsNoneSelected = ThreeContentsStore((state: any) => state.setIsNoneSelected); // prettier-ignore

  let regionData: any = {};

  useEffect(() => {
    /**
     * Setup values
     */

    alignAndConfigPad();

    /**
     * Functions of Listeners for Touch Pad
     */

    const handleTouchStart = (event: TouchEvent) => {
      if (isActicatedRef.current) {
        // For closing Guide Window
        if (isFirstTry) {
          isFirstTry = false;
          setIsPlayerMoved(true);
          return;
        }

        isTouchedRef.current = true;

        // Re Position Pad
        regionRef.current.style.opacity = 1;
        regionRef.current.style.transform = "scale(1.0)";

        const scene2Element = document.getElementById("scene2");
        padRef.current.style.top =
          event.touches[0].pageY - scene2Element!.offsetLeft + "px";
        padRef.current.style.left = event.touches[0].pageX + "px";

        // Re Calculate RegionData and HandleData
        alignAndConfigPad();

        update(event.touches[0].pageX, event.touches[0].pageY);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      // scene2 の Three のシーン操作以外の
      // 入力を除外するための分岐
      if (isActicatedRef.current) {
        if (isTouchedRef.current) {
          // Close Guide Window for the first time.
          if (isFirstTry) {
            isFirstTry = false;
            setIsPlayerMoved(true);
            return;
          }
          update(event.touches[0].pageX, event.touches[0].pageY);
        }
      }
    };

    const handleTouchEndAndCancel = () => {
      isTouchedRef.current = false;
      resetHandlePosition();
    };

    /**
     * Functions of Listeners for Mouse
     */

    const handleMouseDown = (event: MouseEvent) => {
      if (isActicatedRef.current && !isContentSelectedMouseDownRef.current) {
        isPlayerFocusedRef.current = false;
        isNoneSelectedRef.current = true;
        setIsPlayerFocus(false);
        setIsNoneSelected(true);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {};

    const handleMouseUp = (event: MouseEvent) => {
      // Contents に mouseDown した際に
      // mouseUp の箇所が Contents 上か否かで
      // playerFocus の更新種別を分岐

      // mouseDown: Contents上
      // mouseUp: Content外
      if (isContentSelectedMouseDownRef.current) {
        isPlayerFocusedRef.current = true;
        setIsPlayerFocus(true);

        // mouseDown: Contents上
        // mouseUp: Content上
      } else if (
        !isContentSelectedMouseDownRef.current &&
        isPlayerFocusedRef.current == true
      ) {
        isPlayerFocusedRef.current = false;
        setIsPlayerFocus(false);

        // mouseDown: Contents外
        // mouseUp: Content外
      } else if (
        !isContentSelectedMouseDownRef.current &&
        isPlayerFocusedRef.current == false
      ) {
        isPlayerFocusedRef.current = true;
        isNoneSelectedRef.current = false;
        setIsPlayerFocus(true);
        setIsNoneSelected(false);
      }

      setIsContentSelectedMouseDown(false);
    };

    /**
     * Add Interface Listemers
     */
    document.addEventListener("resize", alignAndConfigPad);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEndAndCancel);
    document.addEventListener("touchcancel", handleTouchEndAndCancel);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    /**
     * Add Store Listeners
     */

    const unsubscribeSystemStore = useSystemStore.subscribe(
      (state: any) => ({
        isActivated: state.isActivated,
        isPlayerFocused: state.isPlayerFocused,
      }),
      (value) => {
        isActicatedRef.current = value.isActivated;
      },
    );

    const unsubscribeContentsStore = ThreeContentsStore.subscribe(
      (state: any) => state.isContentSelectedMouseDown,
      (value) => {
        isContentSelectedMouseDownRef.current = value;
      },
    );

    return () => {
      document.removeEventListener("resize", alignAndConfigPad);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEndAndCancel);
      document.removeEventListener("touchcancel", handleTouchEndAndCancel);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      unsubscribeSystemStore();
      unsubscribeContentsStore();
    };
  }, []);

  function alignAndConfigPad() {
    if (padRef.current && handleRef.current) {
      /**
       * Calculate regionData
       */

      // region の cssで設定した border幅 を取得
      const computedStyle = window.getComputedStyle(regionRef.current);
      const borderWidth = parseFloat(computedStyle.borderLeftWidth);

      const scene2Element = document.getElementById("scene2");

      // ViewPort 左上(0, 0)が基準
      const regionRect = padRef.current.getBoundingClientRect();

      // グローバル 左上(0, 0)が基準
      const regionBodyOffsetTop =
        padRef.current.getBoundingClientRect().top + window.scrollY;
      const regionBodyOffsetLeft = padRef.current.getBoundingClientRect().left;

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
        borderLength: borderWidth,
      };
    }
  }

  function update(pageX: number, pageY: number) {
    // PageX(Y)は、グローバル座標基準の(0, 0)
    // region の左上部分(0, 0)を基準としたローカル座標に変換する
    // その場合グローバル座標からローカルの基準座標をマイナスすれば良い
    let newTop = pageY - regionData.globalOffset.top;
    let newLeft = pageX - regionData.localOffset.left;

    console.log("pageX", pageX);
    console.log("pageY", pageY);

    console.log("regionData.localOffset.top", regionData.localOffset.top);
    console.log("regionData.localOffset.Left", regionData.localOffset.left);

    console.log("newTop", newTop);
    console.log("newLeft", newLeft);

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
    // handleRef.current.style.top = newTop - handleData.radius + "px";
    // handleRef.current.style.left = newLeft - handleData.radius + "px";

    handleRef.current.style.top = newTop - regionData.borderLength + "px";
    handleRef.current.style.left = newLeft - regionData.borderLength + "px";

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
    regionRef.current.style.opacity = 0;
    regionRef.current.style.transform = "scale(0.0)";

    // -2: region の border: 2px の分だけ中心からズレるので offset
    handleRef.current.style.top =
      regionData.centerY - regionData.borderLength + "px";

    handleRef.current.style.left =
      regionData.centerX - regionData.borderLength + "px";

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
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          ref={regionRef}
          className="region"
          style={{
            position: "absolute",
            width: "150px",
            height: "150px",
            background:
              "radial-gradient(rgba(255, 255, 255, 1.0) 0%, rgba(255, 255, 255, 1.0) 4%, rgba(218, 225, 230, 0.25) 5%, rgba(218, 225, 230, 0.5) 95%)",
            border: "2px solid rgba(218, 225, 230, 0.25)",
            borderRadius: "50%",
            boxShadow: "0px 0px 5px rgba(194, 200, 204, 0.55)",
            userSelect: "none",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            opacity: 0,
          }}
        >
          <div
            ref={handleRef}
            className="handle"
            style={{
              position: "absolute",
              zIndex: 10,
              height: "60px",
              width: "60px",
              background:
                "radial-gradient(rgba(215, 225, 255, 0.7) 0%, rgba(255, 255, 255, 1.0) 100%)",
              borderRadius: "50%",
              boxShadow: "0px 0px 7px rgba(195, 205, 245, 0.9)",
              textAlign: "center",
              font: '24px/44px "Courier New", Courier, monospace',
              userSelect: "none",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        </div>
      </div>
    </>
  );
}
