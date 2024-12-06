// import { Button } from "@mui/material";
import { Button } from "@headlessui/react";

import ThreeScene2 from "./Scene_2_three";

export default function Scene2() {
  return (
    <>
      <div className="relative min-h-[100vh] h-[100vh] w-full">
        <Button className="absolute top-[50%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 duration-200 h-[10vh] w-[20vh] z-20  inline-flex justify-center items-center gap-2 rounded-md bg-white py-1.5 px-3 text-xl font-semibold text-black shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-300 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
          Save changes
        </Button>
        <div className="absolute top-[45%] left-[70%] z-20 transform -translate-x-1/2 -translate-y-1/2 text-5xl text-white ">
          Super Hyper World!
        </div>
        <div className="absolute top-[55%] left-[70%] z-20 transform -translate-x-1/2 -translate-y-1/2 text-5xl text-white ">
          Let's Get Started!
        </div>

        <div className="absolute top-0 left-0 h-full w-full bg-black opacity-55 z-10" />
        <div className="absolute top-0 left-0 min-h-[100vh] h-[100vh] w-full z-0">
          <ThreeScene2 />
        </div>
      </div>
    </>
  );
}

{
}
