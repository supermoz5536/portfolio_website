// import { Button } from "@mui/material";
import { Button } from "@headlessui/react";

import ThreeScene2 from "./Scene_2_three";

export default function Scene2() {
  return (
    <>
      <div className="flex justify-center items-center relative min-h-[100vh] h-[100vh] w-full">
        <div className="flex flex-col justify-center items-center h-[80vh] w-[80vw] z-10">
          <div className="mb-5 z-10 text-2xl text-white whitespace-nowrap">
            <p>Super Hyper World</p>
          </div>
          <div className="mb-5 z-10 text-7xl text-white ">WORLD</div>
          <div className="mb-5 z-10 text-[1.2rem] leading-6 text-white whitespace-nowrap">
            <p>Shinigami eats only an apple.</p>
          </div>
          <Button
            className={
              "z-10 duration-200 inline-flex justify-center items-center gap-2 rounded-md bg-white py-1.5 px-3 text-2xl font-semibold text-black shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-300 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
            }
          >
            <div className="p-5">Get Started!</div>
          </Button>
        </div>

        <div className="absolute top-0 left-0 h-full w-full bg-black opacity-55 z-[5]" />
        <div className="absolute top-0 left-0 min-h-[100vh] h-[100vh] w-full z-0">
          <ThreeScene2 />
        </div>
      </div>
    </>
  );
}

{
}
