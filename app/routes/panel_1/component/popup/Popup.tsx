import "./popup.css";
import React, { memo, useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useLoaderData } from "@remix-run/react";
import { PopupLayer1 } from "../popup_layer/Popup_layer_1";
import { PopupLayer2 } from "../popup_layer/Popup_layer_2";
import { PopupLayer3 } from "../popup_layer/Popup_layer_3";
import { PopupLayer4 } from "../popup_layer/Popup_layer_4";
import MatterJs1 from "../matter_js/Matter_js_1";

type PopUpComponentProps = {
  viewFlag: boolean;
  setViewFlag: React.Dispatch<React.SetStateAction<boolean>>;
  number: number;
};

// memo を使う理由は「不要な再レンダリング」を防ぐこと
// propsの変更がない限り、再レンダリングは行われない仕様になります。
export const PopUpComponent = memo((props: PopUpComponentProps) => {
  const { viewFlag, setViewFlag, number } = props;

  let initWidth = 0;

  // ウィンドウサイズを追跡する状態
  const [aspects, setAspects] = useState({
    height: typeof window !== "undefined" ? (window.innerHeight * 5) / 6 : 0,
    width: typeof window !== "undefined" ? (initWidth * 5) / 6 : 0,
  });

  /// Matter.js に渡す画面幅の「初期値」を取得
  useEffect(() => {
    setAspects({
      height: (window.innerHeight * 5) / 6,
      width: (window.innerWidth * 5) / 6,
    });
  }, []);

  /// Matter.js に渡す画面幅の「最新値」を取得
  useEffect(() => {
    const handleResize = () => {
      setAspects({
        height: (window.innerHeight * 5) / 6,
        width: (window.innerWidth * 5) / 6,
      });
    };

    // ウィンドウサイズの変更を監視
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ポップアップ表示中に
  // 背景画面がスクロールされないように制御
  useEffect(() => {
    // document: 現在のHTMLドキュメント（ページ内容）を表します。
    // ページ内のDOMツリー全体を管理し、特定の要素にアクセス、操作するために利用
    // 例：DOM要素（ボタン、コンポーネントのサイズ等）の取得
    // =================================================================
    // window: ブラウザの全体的なウィンドウを表します。
    // ブラウザの表示領域（ビューポート）や全体の状態を管理するために利用
    // 例：ウィンドウサイズなど

    // スクロールを無効化する関数
    const registerBackgroundFixed = () => {
      const body = document.body;
      const scrollWidth = window.innerWidth - body.clientWidth;
      body.style.marginRight = `${scrollWidth}px`;
      // 縦スクロールを操作できないようにバーを非表示
      body.style.overflowY = "hidden";
    };

    // スクロールを有効化する関数
    const unRegisterBackgroundFixed = () => {
      const body = document.body;
      // "initial"で初期化すると
      // アプリで指定した外部リソース（css等）ではなく
      // ブラウザのデフォルトに初期化されるので
      // 今回は "" で初期化
      body.style.overflowY = "";
      body.style.marginRight = "";
    };

    // フラグの変更がTrueの場合にスクロールを無効化
    if (viewFlag) registerBackgroundFixed();

    return () => {
      // 2回目の以降のフラグの変更では無効状態で初期化。
      unRegisterBackgroundFixed();
    };
  }, [viewFlag]);

  /// ポップアップを閉じた際に
  /// 動画再生を停止するコールバック
  useEffect(() => {
    if (typeof document !== "undefined") {
      const videoElements = document.querySelectorAll("video");
      if (videoElements && viewFlag == false) {
        for (const videoElement of videoElements) videoElement.pause();
      }
    }
  }, [viewFlag]);

  // 枠外クリック用関数
  const onClickBackground = () => {
    setViewFlag(false);
  };

  // 枠内クリック
  // 親コンポーネントのclose関数へのイベント伝搬を防ぐ
  // stopPropagation(): 親要素へのイベントの伝搬を停止するJSの標準メソッド
  const onClickCard = (event: any) => {
    event.stopPropagation();
  };

  return (
    <>
      <div
        className={
          /**
           * overflow-hidden: 非表示のサイズ0(h-0 w-0)の時に内容を表示させない
           */
          "flex fixed z-10 items-center justify-center overflow-hidden bg-gray-500/50 transition-all duration-300" +
          (viewFlag
            ? // 画面全体にアニメーションが広がる
              " top-0 left-0 h-screen w-screen "
            : // 画面中央に収束してアニメーションが閉じる
              " top-1/2 left-1/2 h-0 w-0 ")
        }
        // ポップアップ終了のトリガー（背景をクリック）
        onClick={onClickBackground}
      >
        {/* ポップアップウインドウ */}
        <div className="relative h-5/6 w-5/6">
          {/* ウインドウのボディ */}
          <div
            className="flex justify-center items-center h-full w-full bg-white shadow-2xl"
            onClick={(event) => onClickCard(event)}
          >
            <div className="absolute z-20">
              {/* 下層の Matter.js */}
              <MatterJs1
                viewFlag={viewFlag}
                height={typeof window != "undefined" ? aspects.height : 100}
                width={typeof window != "undefined" ? aspects.width : 100}
              />
            </div>

            {/* 上層の4つのコンテナー */}
            {number == 1 && <PopupLayer1 viewFlag={viewFlag} number={number} />}
            {number == 2 && <PopupLayer2 viewFlag={viewFlag} number={number} />}
            {number == 3 && <PopupLayer3 viewFlag={viewFlag} number={number} />}
            {number == 4 && <PopupLayer4 viewFlag={viewFlag} number={number} />}
          </div>

          {/* クローズボタン */}
          <div
            className="absolute -right-10 -top-10 h-10 w-10 hover:cursor-pointer"
            onClick={() => setViewFlag(false)}
          >
            <IoMdCloseCircleOutline className="h-full w-full text-white" />
          </div>
        </div>
      </div>
    </>
  );
});
