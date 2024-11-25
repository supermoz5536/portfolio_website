import React, { memo, useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import MatterJsContentBlock1 from "./matter";

type Props = {
  viewFlag: boolean;
  setViewFlag: React.Dispatch<React.SetStateAction<boolean>>;
};

// memo を使う理由は「不要な再レンダリング」を防ぐこと
// propsの変更がない限り、再レンダリングは行われない仕様になります。
export const PopUpComponent = memo((props: Props) => {
  const { viewFlag, setViewFlag } = props;

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

  // 枠外クリック用関数
  const onClickBackground = () => {
    setViewFlag(false);
  };

  // 枠内クリック
  // 親コンポーネントのclose関数へのイベント伝搬を防ぐ
  // stopPropagation(): 親要素へのイベントの伝搬を停止するJSの標準メソッド
  const onClickCard = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
              <MatterJsContentBlock1
                height={typeof window != "undefined" ? aspects.height : 100}
                width={typeof window != "undefined" ? aspects.width : 100}
              />
            </div>
            {/* 上層の4つのコンテナー */}
            <div className="absolute z-30 flex flex-row h-full w-full">
              {/* 1列目 */}
              <div className="flex flex-col h-ful w-1/2 ">
                {/* ConentBlock1 (左上) */}
                <div className="h-1/2 w-full bg-white"></div>

                {/* ConentBlock2 (左下) */}
                <div className="h-1/2 w-full bg-transparent"></div>
              </div>
              {/* 2列目 */}
              <div className="flex flex-col h-ful w-1/2">
                {/* ConentBlock3 (右上) */}
                <div className="h-1/2 w-full bg-transparent"></div>

                {/* ConentBlock4 (右下) */}
                <div className="h-1/2 w-full bg-white"></div>
              </div>
            </div>
          </div>
          {/* クローズボタン */}
          <div className="absolute -right-10 -top-10 h-10 w-10 hover:cursor-pointer">
            <IoMdCloseCircleOutline className="h-full w-full text-white" />
          </div>
        </div>
      </div>
    </>
  );
});
