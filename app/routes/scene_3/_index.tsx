import "./css/index.css";
import { AnimateInBlock } from "~/components/animate_in_block";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useSystemStore } from "../../store/scene3/system_store";
import { useEffect, useRef, useState } from "react";
import { CanvasNormal } from "./Components/view/CanvasNormal";
import { CanvasOutline } from "./Components/view/CanvasOutline";
import { AnimateIn } from "~/components/animate_in";
import ContactForm from "./Components/view/ContactForm";

export default function Scene3() {
  const canvasClipRef = useRef<any>(null);

  const scrollProgress = useSystemStore((state) => state.scrollProgress);
  const setScrollProgress = 
    useSystemStore((state: any)=>state.setScrollProgress) // prettier-ignore

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

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
            console.log(progressRate);
          },
        },
      },
    );
  }, []);

  useEffect(() => {
    /**
     * Device Setup
     */

    if (window.matchMedia("(orientation: landscape)").matches) {
      setIsLandscape(true);
    }

    if (/iPhone|Android.+Mobile/.test(navigator.userAgent)) {
      setIsMobile(true);
    }

    /**
     * GSAP スクロール計算のリフレッシュ
     * モバイルの場合は、初回マウント後のスクロール計算結果が
     * 正確ではないケースがあるので、再計算
     */
    ScrollTrigger.refresh();

    /**
     * Resize
     */

    // Callback
    const resizeCallback = () => {
      if (window.matchMedia("(orientation: landscape)").matches) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }

      if (/iPhone|Android.+Mobile/.test(navigator.userAgent)) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Listener
    window.addEventListener("resize", resizeCallback);

    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);

  useEffect(() => {
    // 例えば、scrollProgress が 0〜1 の範囲の場合、50% (0.5) 未満は100%、それ以降は線形補間で更新
    let newClip;
    if (scrollProgress < 0.235) {
      newClip = "100%";
    } else {
      // scrollProgress が 0.5 から 1 に進むと、100% から 0% に変化する例
      newClip = `${(1 - (scrollProgress - 0.235) / 0.235) * 100}%`;
    }

    if (canvasClipRef.current) {
      canvasClipRef.current.style.setProperty("--clip-bottom", newClip);
    }
  }, [scrollProgress]);

  return (
    <>
      <div
        id="scene3"
        className="relative justify-center items-center h-[800vh] w-full"
      >
        {/* 背景レイヤー0
         * ThreeCanvasのクリック阻害用レイヤー
         */}
        {/* <div className="absolute top-0 left-0 h-[87.5%] w-full z-30" /> */}

        {/* 背景レイヤー0.5
         * カメラグィーン部の黒色の透過背景用
         * Viewport単位での管理の方がシンプルかつ正確なので
         * 文字の配置管理用のコンポーネントと別に用意
         */}
        {isMobile || (
          <>
            <div
              className="absolute top-0 left-0 h-[87.5%] w-full z-10"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              }}
            />
          </>
        )}

        {/* Three Outline*/}
        <div
          ref={canvasClipRef}
          className="sticky top-0 left-0 h-[100vh] w-full z-20"
          style={
            isMobile
              ? {}
              : {
                  clipPath:
                    "polygon(0 0, 100% 0, 100% var(--clip-bottom, 100%), 0 var(--clip-bottom, 100%))",
                }
          }
        >
          <CanvasOutline />
        </div>

        {/* Three */}
        {isMobile || (
          <>
            <div className="sticky top-0 left-0 h-[100vh] w-full z-0">
              <CanvasNormal />
            </div>
          </>
        )}

        {/* 輪郭抽出部分のテキスト群のラッパー(デスクトップ) */}

        <div className="absolute top-0 left-0 h-[87.5%] w-full z-40">
          <div className="relative top-0 left-0 flex flex-col justify-start items-center h-full w-full">
            {/* Row1 */}
            <AnimateInBlock rootMarginBottom={-50}>
              <div className="absolute top-[3.5%] left-0 flex flex-col justify-start items-center w-full">
                <div
                  id="scale-in-top"
                  className={
                    "mt-10 flex flex-col justify-start h-[30vh] w-full my-md:pl-0 my-md:flex-row my-md:justify-between my-md:items-center lg-2:justify-around xl-2:justify-center " +
                    (isMobile && isLandscape
                      ? "items-start ml-[7vw]"
                      : "items-center")
                  }
                >
                  {/* Row1-L */}
                  <div className=" ml-0 flex flex-col justify-start items-start h-[30vh] w-[21rem] my-md:ml-20 xl-2:ml-0">
                    <span
                      id="tablet"
                      className="mb-5 z-50 text-6xl text-black my-md:text-7xl my-lg:text-8xl"
                    >
                      {isMobile ? " " : "Curious"}
                    </span>
                  </div>

                  {/* Row1-R */}
                  <div
                    className="pt-4 pl-8 mr-0 flex flex-col justify-start items-start h-[33rem] w-[21rem] my-md:mt-36 my-md:pt-9 my-md:mr-32 xl-2:ml-20"
                    style={{
                      backgroundColor: "rgba(255, 0, 0, 0.5)",
                    }}
                  >
                    <span
                      id="tablet"
                      className="mb-7 z-50 text-4xl text-white whitespace-nowrap"
                    >
                      Find your Joy
                    </span>

                    <div className="ml-6 flex flex-col justify-start items-start">
                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Ideas spark here daily.
                      </span>
                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Creative minds play freely.
                      </span>
                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Imagination thrives openly.
                      </span>
                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Dare to dream boldly.
                      </span>

                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Invent joy daily always.
                      </span>
                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Curiosity rules your mind.
                      </span>
                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Passion meets creation.
                      </span>
                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Art starts right now.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateInBlock>

            {/* Row2 */}
            <AnimateInBlock rootMarginBottom={-20}>
              <div className="absolute top-[15%] left-0 flex flex-col justify-start items-center w-full">
                <div
                  id="scale-in-top"
                  className={
                    "mt-10 flex flex-col justify-start h-[30vh] w-full my-md:pl-0 my-md:flex-row my-md:justify-between my-md:items-center lg-2:justify-around xl-2:justify-center " +
                    (isMobile && isLandscape
                      ? "items-end mr-[7vw]"
                      : "items-center")
                  }
                >
                  {/* Row2-L */}
                  <div className=" ml-0 flex flex-col justify-start items-start h-[30vh] w-[21rem] my-md:ml-20 xl-2:ml-0">
                    <span
                      id="tablet"
                      className="mb-5 z-50 text-6xl text-black my-md:text-7xl my-lg:text-8xl"
                    >
                      {isMobile ? " " : "Discover"}
                    </span>
                  </div>

                  {/* Row2-R */}
                  <div
                    className="pt-4 pl-8 mr-0 flex flex-col justify-start items-start h-[33rem] w-[21rem] my-md:mt-36 my-md:pt-9 my-md:mr-32 xl-2:ml-20"
                    style={{
                      backgroundColor: "rgba(0, 0, 255, 0.5)",
                    }}
                  >
                    <span
                      id="tablet"
                      className="mb-7 z-50 text-4xl text-white whitespace-nowrap"
                    >
                      Explore Ideas
                    </span>

                    <div className="ml-6 flex flex-col justify-start items-start">
                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Joy fuels art daily.
                      </span>
                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Play is truly powerful.
                      </span>
                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Delight in every detail.
                      </span>
                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Create smiles often.
                      </span>
                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Embrace fun daily here.
                      </span>
                      <span className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap">
                        - Steps to playful wonder.
                      </span>
                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Unleash laughter now.
                      </span>
                      <span
                        id="fade-in-left"
                        className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
                      >
                        - Make play serious always.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateInBlock>

            {/* Row3 */}
            {(isMobile && isLandscape) || (
              <>
                <AnimateInBlock rootMarginBottom={-20}>
                  <div className="absolute top-[26.5%] left-0 flex flex-col justify-start items-center w-full">
                    <div
                      id="scale-in-top"
                      className="mt-10 flex flex-col justify-start items-center h-[30vh] w-full my-md:pl-0 my-md:flex-row my-md:justify-between my-md:items-center lg-2:justify-around xl-2:justify-center"
                    >
                      {/* Row3-L */}
                      <div className=" ml-0 flex flex-col justify-start items-start h-[30vh] w-[21rem] my-md:ml-20 xl-2:ml-0">
                        <span
                          id="tablet"
                          className="mb-5 z-50 text-6xl text-black my-md:text-7xl my-lg:text-8xl"
                        >
                          {isMobile ? " " : "Innovate"}
                        </span>
                      </div>

                      {/* Row3-R */}
                      <div
                        className="pt-4 pl-8 mr-0 flex flex-col justify-start items-start h-[33rem] w-[21rem] my-md:mt-36 my-md:pt-9 my-md:mr-32 xl-2:ml-20"
                        style={{
                          backgroundColor: "rgba(0, 255, 0, 0.5)",
                        }}
                      >
                        <span
                          id="tablet"
                          className="mb-7 z-50 text-4xl text-black whitespace-nowrap"
                        >
                          Genuine Fun
                        </span>

                        <div className="ml-6 flex flex-col justify-start items-start">
                          <span
                            id="fade-in-left"
                            className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
                          >
                            - Sparks new paths.
                          </span>
                          <span
                            id="fade-in-left"
                            className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
                          >
                            - Fun with daily inspires.
                          </span>
                          <span
                            id="fade-in-left"
                            className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
                          >
                            - True creativity right here.
                          </span>
                          <span
                            id="fade-in-left"
                            className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
                          >
                            - Authentic joy found now.
                          </span>
                          <span
                            id="fade-in-left"
                            className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
                          >
                            - Deep play fuels creativity.
                          </span>
                          <span
                            id="fade-in-left"
                            className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
                          >
                            - True laughter inspires ideas.
                          </span>
                          <span
                            id="fade-in-left"
                            className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
                          >
                            - Ideas is truly righteous.
                          </span>
                          <span
                            id="fade-in-left"
                            className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
                          >
                            - Play always honestly.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateInBlock>
              </>
            )}

            {/* Right Texts */}
            <AnimateInBlock rootMarginBottom={-30}>
              <div
                id="tablet"
                className="absolute top-[55%] right-[50%] translate-x-[50%] translate-y-[-50%] h-52 w-[20rem] flex flex-col justify-center items-center border-t-2 border-t-gray-300 border-b-2 border-b-gray-300 my-sm:right-[30%] my-lg:w-[26rem]"
                style={{
                  backgroundColor: "rgba(255, 0, 0, 0.35)",
                }}
              >
                <span
                  id="fade-in-bottom"
                  className="mb-3 text-5xl text-white whitespace-nowrap my-lg:text-6xl"
                >
                  Where?
                </span>
                <p
                  id="fade-in-bottom"
                  className="text-center text-2xl text-white my-lg:text-3xl"
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Itaque, odio.
                </p>
              </div>
            </AnimateInBlock>

            {/* Left Texts */}
            <AnimateInBlock rootMarginBottom={-30}>
              <div
                id="tablet"
                className="absolute top-[67%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-52 w-[20rem] flex flex-col justify-center items-center border-t-2 border-t-gray-300 border-b-2 border-b-gray-300 my-sm:left-[30%] my-lg:w-[26rem]"
                style={{
                  backgroundColor: "rgba(0, 0, 255, 0.4)",
                }}
              >
                <span
                  id="fade-in-bottom"
                  className="mb-3 text-5xl text-white whitespace-nowrap my-lg:text-6xl"
                >
                  When?
                </span>
                <p
                  id="fade-in-bottom"
                  className="text-center text-2xl text-white my-lg:text-3xl"
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Itaque, odio.
                </p>
              </div>
            </AnimateInBlock>
          </div>
        </div>

        {/*
         * Contact Form
         */}

        {isMobile && (
          <>
            <AnimateIn rootMarginBottom={-50}>
              <div
                id="scale-in-top"
                className="absolute top-[707.5vh] left-0 h-[92.5vh] w-[100%] z-40"
                style={{ backgroundColor: "rgba(0, 255, 0, 0.4)" }}
              >
                {/* <div className="absolute top-[707.5vh] left-0 flex flex-col justify-start h-[92.5vh] w-full z-50 overflow-auto"> */}
                <ContactForm />
                {/* </div> */}
              </div>
            </AnimateIn>
          </>
        )}

        {isMobile || (
          <>
            <AnimateIn rootMarginBottom={-50}>
              <div
                id="scale-in-top"
                className="absolute top-[720vh] left-[45%] h-[80vh] w-[55%] z-40 border-2"
                style={{ backgroundColor: "rgba(0, 255, 0, 0.4)" }}
              ></div>
            </AnimateIn>
            <div className="absolute top-[720vh] left-[45%] h-[80vh] w-[55%] z-50 overflow-auto">
              <ContactForm />
            </div>
          </>
        )}
      </div>
    </>
  );
}
