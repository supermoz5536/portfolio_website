// import { Button } from "@mui/material";
import { Button } from "@headlessui/react";
import ThreeScene2 from "./Scene_2_three";
import { useStore } from "zustand";
import { useSystemStore } from "~/store/system_store";
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function Scene2() {
  const { isActivated, toggleIsActivated } = useSystemStore();

  const handleButton = () => {
    toggleIsActivated();
  };

  return (
    <>
      {isActivated == false ? (
        <div className="relative flex justify-center items-center h-[100vh] w-[100vw]">
          {/* 文字を配置を管理するコンテナ */}
          <div className="flex flex-col justify-center items-center h-[80vh] w-[80vw] z-10">
            <div className="mb-5 z-10 text-2xl text-white whitespace-nowrap">
              <p>Super Hyper World</p>
            </div>
            <div className="mb-5 z-10 text-7xl text-white ">WORLD</div>
            <div className="mb-5 z-10 text-[1.2rem] leading-6 text-white whitespace-nowrap">
              <p>Shinigami eats only an apple.</p>
            </div>

            <Button
              onClick={() => handleButton()}
              className={
                "z-10 duration-200 inline-flex justify-center items-center gap-2 rounded-md bg-white py-1.5 px-3 text-2xl font-semibold text-black shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-300 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
              }
            >
              <p className="p-5">Get Started!</p>
            </Button>
          </div>

          <div className="absolute top-0 left-0 h-full w-full bg-black opacity-55 z-[5]" />
          <div className="absolute top-0 left-0 h-[100vh] w-[100vw] z-0">
            <ThreeScene2 />
          </div>
        </div>
      ) : (
        <div className="relative h-[100vh] w-[100vw]">
          {/* クローズボタン */}
          <IoMdCloseCircleOutline
            className="absolute top-[3%] right-[3%] h-12 w-12 z-10 transform translate-x-5 -translate-y-5 hover:cursor-pointer text-white"
            onClick={() => handleButton()}
          />
          <ThreeScene2 />
        </div>
      )}
    </>
  );
}

{
}
