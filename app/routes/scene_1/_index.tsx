import "./css/index.css";
import "./css/loading.scss";
import { gsap } from "gsap/dist/gsap";
import { useSystemStore } from "../../store/scene1/system_store";
import { useGlobalStore } from "../../store/global/global_store";
import { useEffect, useRef, useState } from "react";
import { CanvasScene1 } from "./Components/view/CanvasScene1";
import { Subtitle } from "./intro/Subtitle";
import { SkipButton } from "./intro/SkipButton";
import { AnimateIn } from "~/components/animate_in";

/**
 * Debug
 *
 * Applied
 *  - fixed
 *  - html layer
 *  - intro
 *  - loading
 */

const visibleDebug = false;

export default function Scene1() {
  const [isAllVisible, setIsAllVisible] = useState(true);
  const [isText1, setIsText1] = useState(false);
  const [isText2, setIsText2] = useState(false);
  const [isText3, setIsText3] = useState(false);
  const [isLoadingLayer, setIsLoadingLayer] = useState(true);

  const isMobileRef = useRef<any>();
  const currentWindowWidthRef = useRef<any>();
  const scrollTriggerRef = useRef<any>(false);

  /**
   * Store State
   */

  const isMobile = useGlobalStore((state) => state.isMobile);
  const isLoaded = useGlobalStore((state: any) => state.isLoaded);
  const loadingProgressRatio = useGlobalStore((state: any) => state.loadingProgressRatio); // prettier-ignore
  const isIntroEnded = useSystemStore((state: any) => state.isIntroEnd);
  const isAnimationEnd = useSystemStore((state) => state.isAnimationEnd);

  /**
   * Store Setter
   */

  const setIsSkiped = 
      useSystemStore((state: any)=>state.setIsSkiped) // prettier-ignore

  const setIsIntroEnd = 
      useSystemStore((state: any)=>state.setIsIntroEnd) // prettier-ignore

  const setScrollProgressTopAndBottom = 
      useSystemStore((state: any)=>state.setScrollProgressTopAndBottom) // prettier-ignore

  useEffect(() => {
    currentWindowWidthRef.current = window.innerWidth;

    /**
     * Control Scroll
     */

    import("gsap/dist/ScrollTrigger").then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.refresh(); //  Recalculate Scroll Volume For mobile
      scrollTriggerRef.current = ScrollTrigger;

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
              setScrollProgressTopAndBottom(progressRate);
              console.log(progressRate);
            },
          },
        },
      );
    });

    /**
     * Resize
     */

    // Callback
    const resizeCallback = () => {
      // モバイルの場合のメニューバー表示非表示の
      // リサイズを除外するため、横幅のみでリサイズを判断
      if (isMobileRef.current) {
        if (
          currentWindowWidthRef.current &&
          currentWindowWidthRef.current != window.innerWidth
        ) {
          if (scrollTriggerRef.current) scrollTriggerRef.current.refresh();
          currentWindowWidthRef.current = window.innerWidth;
        }
      } else {
        if (scrollTriggerRef.current) scrollTriggerRef.current.refresh();
        currentWindowWidthRef.current = window.innerWidth;
      }
    };

    // Listener
    window.addEventListener("resize", resizeCallback);

    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  useEffect(() => {
    /**
     * Subtitle
     */

    if (isLoaded) {
      const timeout0 = setTimeout(() => setIsLoadingLayer(false), 1000);
      const timeout1 = setTimeout(() => setIsText1(true), 4000);
      const timeout2 = setTimeout(() => setIsText2(true), 9000);
      const timeout3 = setTimeout(() => setIsText3(true), 14750);
      const timeout4 = setTimeout(() => setIsSkiped(true), 19500);
      const timeout5 = setTimeout(() => setIsIntroEnd(true), 20500);

      return () => {
        clearTimeout(timeout0);
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        clearTimeout(timeout4);
        clearTimeout(timeout5);
      };
    }
  }, [isLoaded]);

  useEffect(() => {
    // if (visibleDebug) {
    if (isAnimationEnd) {
      document.body.style.position = "";
    } else {
      document.body.style.position = "fixed";
    }
    // }
  }, [isAnimationEnd]);

  function onSkip() {
    setIsAllVisible(false);
    setIsSkiped(true);
    setTimeout(() => {
      setIsIntroEnd(true);
    }, 1000);
  }

  return (
    <div
      id="scene1"
      className="relative flex justify-center items-center h-[400vh] w-full bg-white"
    >
      {/* --------
          Scene1
        -------- */}
      <div
        className={
          "relative h-full " +
          // Fix width until animation is end
          (isAnimationEnd ? "w-full" : "w-[100vw]")
        }
      >
        <div className="sticky top-0 left-0 h-[100vh] w-full z-0">
          <div className="absolute top-0 left-0 h-full w-full z-0">
            <CanvasScene1 />
          </div>
        </div>
      </div>

      {/* ---------------------
          Scene HTML Layder
        ---------------------- */}
      {/* {visibleDebug && isIntroEnded && ( */}
      {isAnimationEnd && !isMobile && (
        <div className="absolute top-0 left-0 h-[100vh] w-full z-10">
          <div className="relative flex flex-col justify-center items-end h-[100vh] w-full z-10">
            <div className="flex flex-col justify-start items-center h-[80%] w-auto bg-purple-0">
              {/* Block 1 */}
              <div className="flex flex-col justify-top items-end h-auto w-full pt-12 pr-6 ">
                <span className="text-black text-sm font-light">
                  A Portfolio website for fun.
                </span>
              </div>

              {/* Block 1 */}
              <div className="flex flex-col justify-top items-center h-full w-full px-5 pt-20 ">
                <h1 className="text-black text-6xl">Paradoxical Harmony</h1>
                <h2 className="text-black text-3xl font-light mt-4 ml-32">
                  Mature mind, primitive spirit.
                </h2>
              </div>

              {/* Block 2 */}
              <div className="flex flex-col justify-top items-center h-full w-full pt-36 pr-3 space-y-4 bg-green-0">
                <div className="flex flex-col justify-center items-center ml-28">
                  <h3 className="text-black text-3xl">
                    What's the factor of mature mind?
                  </h3>
                  <div className="text-black text-base font-light mt-6 space-y-2">
                    <p>Self-Other Distinction (Basis of Social Order)?</p>
                    <p>Duality (Balanced Cognition)?</p>
                    <p>Other-Oriented Consciousness?</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[20%] w-full bg-green-200"> </div>

            <AnimateIn rootMarginBottom={0}>
              <button
                id="tablet"
                className={
                  "absolute -translate-x-1/2 -translate-y-1/2 h-10 w-14 text-gray-600 outline outline-gray-600 transition-opacity duration-1000 " +
                  (isMobile ? "top-[75%] left-[50%] " : "top-[90%] left-[50%]")
                }
              >
                ↓
              </button>
            </AnimateIn>
          </div>
        </div>
      )}

      {/* {visibleDebug && isIntroEnded && ( */}
      {isAnimationEnd && isMobile && (
        <div className="absolute top-0 left-0 h-[100vh] w-full z-10">
          <div className="flex flex-col justify-start items-center h-[80%] w-auto bg-pink-0">
            {/* Block 1 */}
            <div className="flex flex-col justify-top items-end h-auto w-full pt-2 pr-2 ">
              <span className="text-black text-sm font-light">
                A Portfolio website for fun.
              </span>
            </div>

            {/* Block 1 */}
            <div className="flex flex-col justify-top items-start h-auto w-full px-5 pt-16 bg-purple-0">
              <h1 className="text-black text-5xl">Paradoxical Harmony</h1>
              <h2 className="text-black text-2xl font-light mt-4 ml-1 whitespace-nowrap">
                Mature mind, primitive spirit.
              </h2>
            </div>

            {/* Block 2 */}
            <div className="flex flex-col justify-top items-start h-auto w-full pt-12 pr-3 space-y-4 bg-green-0">
              <div className="flex flex-col justify-center items-start px-5">
                <h3 className="text-black text-[1.6rem] whitespace-nowrap">
                  The factor of mature mind?
                </h3>
                <div className="text-black text-base font-light mt-4 ml-4 space-y-2 whitespace-nowrap">
                  <p>- Self-Other Distinction (Social Order Basis)?</p>
                  <p>- Duality (Balanced Cognition)?</p>
                  <p>- Other-Oriented Consciousness?</p>
                </div>
              </div>
            </div>

            {/* Block 3 */}
            <div className="flex flex-row justify-center items-center h-full w-full bg-green-0">
              <span className="text-black text-base font-light whitespace-nowrap">
                ...Then, what about the primitive spirit?
              </span>

              {/* Scroll Icon */}
              <AnimateIn rootMarginBottom={0}>
                <button
                  id="tablet"
                  className={
                    "h-10 w-14 ml-4 text-gray-600 outline outline-gray-600 transition-opacity duration-1000 " +
                    (isMobile
                      ? "top-[75%] left-[50%] "
                      : "top-[90%] left-[50%]")
                  }
                >
                  ↓
                </button>
              </AnimateIn>
            </div>
          </div>
        </div>
      )}

      {/* -------
          Intro
        -------- */}
      {/* {!isIntroEnded && ( */}
      {visibleDebug && !isIntroEnded && (
        <div className="absolute top-0 left-0 h-[100vh] w-full z-10">
          <div className="relative flex flex-col justify-center items-center h-full w-full z-10">
            <div
              className={
                "flex flex-col justify-start items-start w-[70vw] " +
                (isMobile ? "h-[40vh]" : "h-[20vh]")
              }
            >
              {isText1 && (
                <Subtitle
                  inputText={text1}
                  startTime={new Date().getTime()}
                  parentVisiblity={isAllVisible}
                />
              )}

              {isText2 && (
                <Subtitle
                  inputText={text2}
                  startTime={new Date().getTime()}
                  parentVisiblity={isAllVisible}
                />
              )}

              {isText3 && (
                <Subtitle
                  inputText={text3}
                  startTime={new Date().getTime()}
                  parentVisiblity={isAllVisible}
                />
              )}
            </div>

            {isLoaded && (
              <SkipButton parentVisiblity={isAllVisible} onSkip={onSkip} />
            )}
          </div>
        </div>
      )}

      {/* ---------
          Loading
        --------- */}
      {/* {isLoadingLayer && ( */}
      {visibleDebug && isLoadingLayer && (
        <div className="absolute top-0 left-0 h-[100vh] w-full z-10">
          <div className="relative flex flex-col justify-center items-center h-full w-full z-10">
            <div className="flex flex-row justify-center items-center h-[20vh] w-72">
              {/* CSS Animation */}
              <div id="container">
                <p
                  className={
                    "loading-text " +
                    (isLoaded ? "duration-1000 opacity-0" : "opacity-100")
                  }
                  aria-label="Loading"
                >
                  <span className="letter" aria-hidden="true">
                    L
                  </span>
                  <span className="letter" aria-hidden="true">
                    o
                  </span>
                  <span className="letter" aria-hidden="true">
                    a
                  </span>
                  <span className="letter" aria-hidden="true">
                    d
                  </span>
                  <span className="letter" aria-hidden="true">
                    i
                  </span>
                  <span className="letter" aria-hidden="true">
                    n
                  </span>
                  <span className="letter" aria-hidden="true">
                    g
                  </span>
                </p>
              </div>

              {/* Progress Ratio */}
              <span
                className={
                  "mr-7 text-black text-5xl " +
                  (isLoaded ? "duration-1000 opacity-0" : "opacity-100")
                }
              >
                {loadingProgressRatio}%
              </span>
            </div>

            {/* Comments */}
            <p
              className={
                "flex justify-center items-center h-[20vh] w-[90vw] text-center text-black text-2xl " +
                (isLoaded ? "duration-1000 opacity-0" : "opacity-100")
              }
            >
              This website was made for fun.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const text1 =
  "1 Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, praesentium.";

const text2 =
  "2 Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, praesentium.";

const text3 =
  "3 Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, praesentium.";
