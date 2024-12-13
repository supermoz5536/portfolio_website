// import { Button } from "@mui/material";
import { Button } from "@headlessui/react";
import ThreeScene2 from "./Scene_2_three";
import { useStore } from "zustand";
import { useSystemStore } from "~/store/system_store";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { AnimateInBlock } from "~/components/animate_in_block";

export default function Scene1() {
  const { isActivated, toggleIsActivated } = useSystemStore();
  const [fixedScrollPoint, setFixedScrollPoint] = useState<number>();

  const handleButton = () => {
    toggleIsActivated();
  };

  useEffect(() => {
    if (isActivated) {
      fixScroll();
      addEventListener("scroll", fixScroll);
    }
    return () => {
      removeEventListener("scroll", fixScroll);
    };
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

    setFixedScrollPoint(scene2OffsetTop);
  }

  return (
    <>
      <AnimateInBlock>
        {isActivated == false ? (
          <div className="relative flex justify-center items-center h-[100vh] w-[100vw]">
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

            {/* 背景 */}
            <div className="absolute top-0 left-0 h-full w-full bg-black opacity-55 z-[5]" />

            {/* Three.js */}
            <div className="absolute top-0 left-0 h-[100vh] w-[100vw] z-0">
              <ThreeScene2 />
            </div>
          </div>
        ) : (
          <div id="scene2" className="relative h-[100vh] w-[100vw]">
            <div className="fixed top-0 left-0 h-[100vh] w-[100vw] outline-none z-[5]">
              {/* クローズボタン */}
              <IoMdCloseCircleOutline
                className="absolute mt-5 mr-5 top-[5%] right-[5%] h-12 w-12 z-10 transform translate-x-5 -translate-y-5 hover:cursor-pointer text-white"
                onClick={() => handleButton()}
              />
              {/* Three.js */}
              <ThreeScene2 />
            </div>
          </div>
        )}
      </AnimateInBlock>
    </>
  );
}
