import "./css/index.css";
import EntryPointThree from "./EntryPointThree";
import { AnimateInBlock } from "~/components/animate_in_block";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useSystemStore } from "../../store/scene3/system_store";

export default function Scene3() {
  const setScrollProgress = 
    useSystemStore((state: any)=>state.setScrollProgress) // prettier-ignore

  /**
   * Scroll Progress
   */

  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    gsap.fromTo(
      "#scene3",

      {}, // fromVars: null

      {
        // toVars: null
        // Option
        scrollTrigger: {
          trigger: "#scene3",
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
          pin: false,
          onUpdate: (value) => {
            const progressRate = value.progress;
            setScrollProgress(progressRate);
          },
        },
      },
    );
  }, []);

  return (
    <>
      <div
        id="scene3"
        className="relative justify-center items-center h-[300vh] w-full"
      >
        {/* Three */}
        <div className="sticky top-0 left-0 h-[100vh] w-full z-0">
          <EntryPointThree />
        </div>

        <>
          {/* 文字とボタンの配置管理するコンテナ */}
          <AnimateInBlock>
            <div className="flex flex-col justify-center items-center h-[80vh] w-[80vw] z-10">
              <div className="mb-5 z-10 text-2xl text-white whitespace-nowrap">
                <p>Journey through Creations</p>
              </div>
              <span className="mb-5 z-10 text-7xl text-white ">Scene3</span>
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
