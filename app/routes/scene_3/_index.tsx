import "./css/index.css";
import { AnimateInBlock } from "~/components/animate_in_block";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useSystemStore } from "../../store/scene3/system_store";
import { useEffect, useRef } from "react";
import { CanvasNormal } from "./Components/view/CanvasNormal";
import { CanvasOutline } from "./Components/view/CanvasOutline";

export default function Scene3() {
  const CanvasClipRef = useRef<any>(null);

  const scrollProgress = useSystemStore((state) => state.scrollProgress);
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
    // 例えば、scrollProgress が 0〜1 の範囲の場合、50% (0.5) 未満は100%、それ以降は線形補間で更新
    let newClip;
    if (scrollProgress < 0.2) {
      newClip = "100%";
    } else {
      // scrollProgress が 0.5 から 1 に進むと、100% から 0% に変化する例
      newClip = `${(1 - (scrollProgress - 0.2) / 0.2) * 100}%`;
    }
    if (CanvasClipRef.current) {
      CanvasClipRef.current.style.setProperty("--clip-bottom", newClip);
    }
  }, [scrollProgress]);

  return (
    <>
      <div
        id="scene3"
        className="relative justify-center items-center h-[500vh] w-full"
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
          {/* 文字とボタンの配置管理するコンテナ */}
          <AnimateInBlock>
            <div className="absolute top-[10%] left-0 flex flex-col justify-start items-center h-[80vh] w-[80vw] z-40">
              <div className="mb-5 z-50 text-2xl text-black whitespace-nowrap">
                <p>Journey through Creations</p>
              </div>
              <span className="mb-5 z-50 text-7xl text-black ">Scene3</span>
              <span className="mb-5 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap">
                Steps to an Inner Universe.
              </span>
            </div>
          </AnimateInBlock>

          {/* 背景レイヤー0 */}
          <div
            className="absolute top-0 left-0 h-full w-full bg-black z-30"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0)",
            }}
          />

          {/* 背景レイヤー1 */}
          <div
            className="absolute top-0 left-0 h-full w-full bg-black z-10"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 80%)",
            }}
          />

          {/* 背景レイヤー2 */}
          <div
            className="absolute top-[407.5vh] left-[45vw] h-[92.5vh] w-[55vw] z-10"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.55)",
            }}
          />
        </>
      </div>
    </>
  );
}
