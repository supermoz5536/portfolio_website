// import { Button } from "@mui/material";
import { Button } from "@headlessui/react";
import EntryPointThree from "./EntryPointThree";
import { useStore } from "zustand";
import { useSystemStore } from "~/store/system_store";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { AnimateInBlock } from "~/components/animate_in_block";
import { AnimateIn } from "~/components/animate_in";

export default function Scene2() {
  const { isActivated, toggleIsActivated } = useSystemStore();
  const [isFirstTry, setIsFirstTry] = useState(true);

  const handleButton = () => {
    toggleIsActivated();
  };

  useEffect(() => {
    if (!isFirstTry) {
      if (isActivated) {
        fixScroll();

        // fixScroll()で scene2 の位置に移動した後に
        // 現在のスクロール位置を取得
        const currentScrollY = window.scrollY;

        // bodyを固定（トップを -scrollY にする）
        document.body.style.position = "fixed";
        document.body.style.top = `-${currentScrollY}px`; // body自体を上にズラしてスクロール再現
        document.body.style.left = "0"; // 水平方向のbodyのスクロール位置を0(tailwind left-0と同じ)
        document.body.style.width = "100vw"; // position: fixed で body のサイズが縮小し不具合の可能性。初期化が必要。
      } else {
        // body固定を解除する
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.width = "";
        fixScroll();
      }
    }

    setIsFirstTry(false);
  }, [isActivated]);

  function fixScroll() {
    // Scene2のコンポーネントをDOMからIDで取得
    const scene2Element: HTMLLIElement | null =
      document.querySelector("#scene2");
    if (!scene2Element) return;

    // offsetのメソッドで上端のスクロール位置を取得
    const scene2OffsetTop = scene2Element.offsetTop;

    // scrollToのtopの値は、
    // ViewPortの上端を示すので
    // そのままoffsetTopの値を渡せばOK
    window.scrollTo({
      top: scene2OffsetTop,
    });
  }

  return (
    <>
      <div
        id="scene2"
        className="relative flex justify-center items-center h-[100vh] w-full"
      >
        {/* Three */}
        <div className="absolute top-0 left-0 h-[100vh] w-full z-0">
          <EntryPointThree />
        </div>

        {isActivated == false ? (
          <>
            <AnimateInBlock>
              {/* 文字とボタンの配置管理するコンテナ */}
              <div className="flex flex-col justify-center items-center h-[80vh] w-[80vw] z-10">
                <div className="mb-5 z-10 text-2xl text-white whitespace-nowrap">
                  <p>Super Hyper World</p>
                </div>
                <span className="mb-5 z-10 text-7xl text-white ">WORLD</span>
                <span className="mb-5 z-10 text-[1.2rem] leading-6 text-white whitespace-nowrap">
                  Shinigami eats only an apple.
                </span>

                <Button
                  id="button"
                  className={
                    "z-10 rounded-full border-2 border-sky-400 bg-white  text-black hover:bg-gray-300 transform duration-200"
                  }
                  onClick={() => handleButton()}
                >
                  <p id="fade-in-bottom" className="p-3">
                    Get Started!
                  </p>
                </Button>
              </div>
            </AnimateInBlock>

            {/* 背景 */}
            <div className="absolute top-0 left-0 h-full w-full bg-black opacity-55 z-[5]" />
          </>
        ) : (
          <div className="fixed top-0 left-0 h-[100vh] w-full outline-none z-[5]">
            {/* クローズボタン */}
            <AnimateIn>
              <Button
                id="svg"
                className="absolute mt-5 mr-5 top-[5%] right-[5%] z-10 rounded-full h-5 w-5"
                onClick={() => handleButton()}
              >
                <IoMdCloseCircleOutline className="absolute top-[50%] left-[50%] h-12 w-12 z-20 translate transform -translate-x-1/2 -translate-y-1/2 hover:cursor-pointer hover:text-gray-300 duration-200" />
              </Button>
            </AnimateIn>
          </div>
        )}
      </div>
    </>
  );
}
