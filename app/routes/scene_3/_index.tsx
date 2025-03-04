import "./css/index.css";
import { AnimateInBlock } from "~/components/animate_in_block";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useSystemStore } from "../../store/scene3/system_store";
import { useEffect, useRef, useState } from "react";
import { CanvasNormal } from "./Components/view/CanvasNormal";
import { CanvasOutline } from "./Components/view/CanvasOutline";

export default function Scene3() {
  const CanvasClipRef = useRef<any>(null);

  const scrollProgress = useSystemStore((state) => state.scrollProgress);
  const setScrollProgress = 
    useSystemStore((state: any)=>state.setScrollProgress) // prettier-ignore

  const [isMobile, setIsMobile] = useState<boolean>();

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
          end: "bottom bottom",
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

  useEffect(() => {
    /**
     * Device Setup
     */

    if (typeof window !== "undefined") {
      if (window.innerWidth < 500) setIsMobile(true);
      if (window.innerWidth >= 500) setIsMobile(false);
    }

    // 例えば、scrollProgress が 0〜1 の範囲の場合、50% (0.5) 未満は100%、それ以降は線形補間で更新
    let newClip;
    if (scrollProgress < 0.235) {
      newClip = "100%";
    } else {
      // scrollProgress が 0.5 から 1 に進むと、100% から 0% に変化する例
      newClip = `${(1 - (scrollProgress - 0.235) / 0.235) * 100}%`;
    }
    if (CanvasClipRef.current) {
      CanvasClipRef.current.style.setProperty("--clip-bottom", newClip);
    }
  }, [scrollProgress]);

  return (
    <>
      <div
        id="scene3"
        className="relative justify-center items-center h-[800vh] w-full"
      >
        {/* Three */}
        <div
          ref={CanvasClipRef}
          className="sticky top-0 left-0 h-[100vh] w-full z-20"
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% var(--clip-bottom, 100%), 0 var(--clip-bottom, 100%))",
          }}
        >
          <CanvasOutline />
        </div>

        {/* Three */}
        <div className="sticky top-0 left-0 h-[100vh] w-full z-0">
          <CanvasNormal />
        </div>

        <>
          <div className="absolute top-0 left-0 h-[37%] w-full z-40">
            <div className="relative top-0 left-0 flex flex-col justify-start items-center h-full w-full">
              {/* Row1 */}
              <AnimateInBlock rootMarginBottom={-40}>
                <div className="absolute top-[10%] left-0 flex flex-col justify-start items-center h-full w-full">
                  <div className="mt-10 pl-7 flex flex-col justify-start items-start h-[30vh] w-full my-md:pl-0 my-md:flex-row my-md:justify-between my-md:items-center lg-2:justify-around xl-2:justify-center">
                    {/* Row1-L */}
                    <div className="ml-0 flex flex-col justify-start items-start h-[30vh] w-[30vw] my-md:ml-44 xl-2:ml-[25%]">
                      <span className="mb-5 z-50 text-7xl text-black ">
                        Scene3
                      </span>
                    </div>

                    {/* Row1-R */}
                    <div className="pt-0 pl-8 mr-0 flex flex-col justify-start items-start h-[30vh] w-[30vw] my-md:pt-9 my-md:mr-44 xl-2:mr-[25%]">
                      <span className="mb-5 z-50 text-4xl text-black ">
                        Scene3
                      </span>

                      <div className="ml-6 flex flex-col justify-start items-start">
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateInBlock>

              {/* Row2 */}
              <AnimateInBlock rootMarginBottom={-40}>
                <div className="absolute top-[37%] left-0 flex flex-col justify-start items-center h-full w-full">
                  <div className="mt-10 pl-7 flex flex-col justify-start items-start h-[30vh] w-full my-md:pl-0 my-md:flex-row my-md:justify-between my-md:items-center lg-2:justify-around xl-2:justify-center">
                    {/* Row1-L */}
                    <div className="ml-0 flex flex-col justify-start items-start h-[30vh] w-[30vw] my-md:ml-44 xl-2:ml-[25%]">
                      <span className="mb-5 z-50 text-7xl text-black ">
                        Scene3
                      </span>
                    </div>

                    {/* Row1-R */}
                    <div className="pt-0 pl-8 mr-0 flex flex-col justify-start items-start h-[30vh] w-[30vw] my-md:pt-9 my-md:mr-44 xl-2:mr-[25%]">
                      <span className="mb-5 z-50 text-4xl text-black ">
                        Scene3
                      </span>

                      <div className="ml-6 flex flex-col justify-start items-start">
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateInBlock>

              {/* Row3 */}
              <AnimateInBlock rootMarginBottom={-40}>
                <div className="absolute top-[64%] left-0 flex flex-col justify-start items-center h-full w-full">
                  <div className="mt-10 pl-7 flex flex-col justify-start items-start h-[30vh] w-full my-md:pl-0 my-md:flex-row my-md:justify-between my-md:items-center lg-2:justify-around xl-2:justify-center">
                    {/* Row1-L */}
                    <div className="ml-0 flex flex-col justify-start items-start h-[30vh] w-[30vw] my-md:ml-44 xl-2:ml-[25%]">
                      <span className="mb-5 z-50 text-7xl text-black ">
                        Scene3
                      </span>
                    </div>

                    {/* Row1-R */}
                    <div className="pt-0 pl-8 mr-0 flex flex-col justify-start items-start h-[30vh] w-[30vw] my-md:pt-9 my-md:mr-44 xl-2:mr-[25%]">
                      <span className="mb-5 z-50 text-4xl text-black ">
                        Scene3
                      </span>

                      <div className="ml-6 flex flex-col justify-start items-start">
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                        <span className="mb-5 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap">
                          - Steps to an Inner Universe.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateInBlock>
            </div>
          </div>

          {/* 背景レイヤー0
           * ThreeCanvasのクリック阻害用レイヤー
           */}
          <div
            className="absolute top-0 left-0 h-full w-full bg-black z-30"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0)",
            }}
          />

          {/* 背景レイヤー1
           * 画面上部
           */}
          <div
            className="absolute top-0 left-0 h-full w-full bg-black z-10"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              clipPath: "polygon(0 0, 100% 0, 100% 87.5%, 0 87.5%)",
            }}
          />

          {/* 背景レイヤー2
           * 画面下部
           */}
          {isMobile && (
            <div
              className="absolute top-[707.5vh] left-0 h-[92.5vh] w-full z-10"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.55)",
              }}
            />
          )}
          {/* 背景レイヤー2 */}
          {isMobile || (
            <div
              className="absolute top-[707.5vh] left-[45vw] h-[92.5vh] w-[55vw] z-10"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.55)",
              }}
            />
          )}
        </>
      </div>
    </>
  );
}
