import "./css/index.css";
import EntryPointThree from "./EntryPointThree";
import { AnimateInBlock } from "~/components/animate_in_block";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function Scene1() {
  // console.log(ScrollTrigger);
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    gsap.fromTo(
      "#scene1",

      {}, // fromVars: null

      {
        // toVars: null
        // Option
        scrollTrigger: {
          trigger: "#scene1",
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
          pin: false,
          onUpdate: (value) => {
            const progressRate = value.progress;
            console.log("progressRate", progressRate);
          },
          // onEnter: () => {},
          // onLeave: () => {},
          // onEnterBack: () => {},
          // onLeaveBack: () => {},
        },
      },
    );
  }, []);

  return (
    <>
      <div
        id="scene1"
        className="relative justify-center items-center h-[300vh] w-full"
      >
        {/* Three */}
        <div className="sticky top-0 left-0 h-[100vh] w-full z-0">
          <EntryPointThree />
        </div>

        <>
          <AnimateInBlock>
            {/* 文字とボタンの配置管理するコンテナ */}
            <div className="flex flex-col justify-center items-center h-[80vh] w-[80vw] z-10">
              <div className="mb-5 z-10 text-2xl text-white whitespace-nowrap">
                <p>Journey through Creations</p>
              </div>
              <span className="mb-5 z-10 text-7xl text-white ">Scene1</span>
              <span className="mb-5 z-10 text-[1.2rem] leading-6 text-white whitespace-nowrap">
                Steps to an Inner Universe.
              </span>
            </div>
          </AnimateInBlock>

          {/* 背景 */}
          <div className="absolute top-0 left-0 h-full w-full bg-black opacity-35 z-[5]" />
        </>
      </div>
    </>
  );
}
