import "./css/index.css";
import "./css/loading.scss";
import { gsap } from "gsap/dist/gsap";
import { useSystemStore } from "../../store/scene1/system_store";
import { useSystemStore as useSystemStore2 } from "../../store/scene2/system_store";
import { useGlobalStore } from "../../store/global/global_store";
import { useEffect, useRef, useState } from "react";
import { CanvasScene1 } from "./Components/view/CanvasScene1";
import { Subtitle } from "./intro/Subtitle";
import { SkipButton } from "./intro/SkipButton";

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
  const [isIntroVisibleAll, setIsIntroVisibleAll] = useState(true);
  const [isSceneLayerVisible, setIsSceneLayerVisible] = useState(true);
  const [isText1, setIsText1] = useState(false);
  const [isText2, setIsText2] = useState(false);
  const [isText3, setIsText3] = useState(false);
  const [isLoadingLayer, setIsLoadingLayer] = useState(true);
  const [isOnScreen, setIsOnScreen] = useState(true);

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
  const isActivated = useSystemStore2((state) => state.isActivated);

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

              if (progressRate == 0) {
                setIsSceneLayerVisible(true);
              } else {
                setIsSceneLayerVisible(false);
              }

              if (progressRate > 0.99) {
                setIsOnScreen(false);
              } else {
                setIsOnScreen(true);
              }
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
    // 入力操作の停止 : Tower旋回中のバグ防止
    if (isIntroEnded && !isAnimationEnd) {
      document.body.style.pointerEvents = "none";
    } else {
      document.body.style.pointerEvents = "auto";
    }

    // スクロールの停止 : HueEffect 中のバグ防止
    if (isAnimationEnd) {
      document.body.style.position = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
    } else {
      document.body.style.position = "fixed";
      document.body.style.width = "100vw"; // fixed で body サイズが縮小するのでサイズ指定で対応
      document.documentElement.style.overflow = "hidden";
    }
    // }
  }, [isIntroEnded, isAnimationEnd]);

  function onSkip() {
    setIsIntroVisibleAll(false);
    setIsSkiped(true);
    setTimeout(() => {
      setIsIntroEnd(true);
    }, 1000);
  }

  return (
    <div
      id="scene1"
      className={
        "relative flex justify-center items-center h-[400vh] w-full bg-white " +
        (isOnScreen ? "" : "off-screen")
      }
    >
      {/* --------
          Scene1
        -------- */}
      <div className="relative h-full w-full">
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
      {isAnimationEnd && isOnScreen && !isActivated && !isMobile && (
        <div
          className={
            "fixed top-0 left-0 h-[100vh] w-full z-10 duration-1000 " +
            (isSceneLayerVisible ? "opacity-100" : "opacity-0")
          }
        >
          <div className="relative flex flex-col justify-center items-end h-[100vh] w-full z-10">
            <div className="flex flex-col justify-start items-center h-[80%] w-auto bg-purple-0">
              {/* Block 1 */}
              <div className="flex flex-col justify-top items-end h-auto w-full pt-2 pr-2 ">
                <span className="text-black text-sm font-light show-up-2">
                  A portfolio website made for fun.
                </span>
              </div>

              {/* Block 1 */}
              <div className="flex flex-col justify-top items-center h-full w-full px-5 pt-28 bg-yellow-0">
                {/* Header */}
                <h1 className="text-black text-6xl space-x-4">
                  <span className="show-up-1">Paradoxical</span>
                  <span className="header-1-animation">Harmony</span>
                </h1>
                {/* Sub-Header */}
                <div className="mt-4 ml-5 space-x-4 text-black text-3xl font-light whitespace-nowrap">
                  <span className="sub-header-1-animation">Mature mind,</span>
                  <span className="sub-header-2-animation">
                    primitive spirit.
                  </span>
                </div>
              </div>

              {/* Block 2 */}
              <div className="flex flex-col justify-top items-center h-full w-full pt-36 pr-3 space-y-4 show-up-2 bg-green-0">
                <div className="flex flex-col justify-center items-center ml-28">
                  <h3 className="text-black text-3xl flowing-underline exclude-off-screen">
                    What's the factor of mature mind?
                  </h3>
                  <div className="text-black text-base font-light mt-6 space-y-2">
                    <p className="list-item-1">
                      - Self-Other Distinction (Social Order Basis)?
                    </p>
                    <br />
                    <p className="list-item-2">
                      - Duality (Balanced Cognition)?
                    </p>
                    <br />
                    <p className="list-item-3">
                      - Other-Oriented Consciousness?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 3 */}
            <div className="flex flex-row justify-end items-center h-full w-full bg-red-0">
              <span className="text-black text-lg font-light whitespace-nowrap show-up-3">
                ...Then, what about the primitive spirit?
              </span>

              {/* Scroll Icon */}
              <div className="h-10 w-14 ml-8 mr-10">
                {/* Border Animation */}
                <div className="stroke is-animated exclude-off-screen h-full w-full">
                  <div className="border top"></div>
                  <div className="border right"></div>
                  <div className="border bottom"></div>
                  <div className="border left"></div>

                  {/* Aroow Animation */}
                  <div className="arrow exclude-off-screen">
                    <span className="invisible">sHolder</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {visibleDebug && isIntroEnded && ( */}
      {isAnimationEnd && isOnScreen && !isActivated && isMobile && (
        <div
          className={
            "fixed top-0 left-0 h-[100vh] w-full z-10 duration-1000 " +
            (isSceneLayerVisible ? "opacity-100" : "opacity-0")
          }
        >
          <div className="flex flex-col justify-start items-center h-[80%] w-auto bg-pink-0">
            {/* Block 1 */}
            <div className="flex flex-col justify-top items-end h-auto w-full pt-2 pr-2 ">
              <span className="text-black text-sm font-light show-up-2">
                A portfolio website made for fun.
              </span>
            </div>

            {/* Block 1 */}
            <div className="flex flex-col justify-top items-start h-auto w-full px-5 pt-16 bg-purple-0">
              <h1 className="text-5xl text-black">
                <span className="show-up-1">Paradoxical</span>
                <span className="header-1-animation">Harmony</span>
              </h1>

              <div className="mt-4 ml-1 space-x-4 text-black text-2xl font-light whitespace-nowrap">
                <span className="sub-header-1-animation">Mature mind,</span>
                <span className="sub-header-2-animation">
                  primitive spirit.
                </span>
              </div>
            </div>

            {/* Block 2 */}
            <div className="flex flex-col justify-top items-start h-auto w-full pt-12 pr-3 space-y-4 show-up-2 bg-green-0">
              <div className="flex flex-col justify-center items-start px-5">
                <h3 className="text-black text-[1.6rem] whitespace-nowrap flowing-underline exclude-off-screen">
                  The factor of mature mind?
                </h3>
                <div className="text-black text-base font-light mt-4 ml-4 space-y-2 whitespace-nowrap">
                  <p className="list-item-1">
                    - Self-Other Distinction (Social Order Basis)?
                  </p>
                  <br />
                  <p className="list-item-2">- Duality (Balanced Cognition)?</p>
                  <br />
                  <p className="list-item-3">- Other-Oriented Consciousness?</p>
                </div>
              </div>
            </div>

            {/* Block 3 */}
            <div className="flex flex-row justify-center items-center h-full w-full bg-green-0">
              <span className="text-black text-base font-light whitespace-nowrap show-up-3">
                ...Then, what about the primitive spirit?
              </span>

              {/* Scroll Icon */}
              <div className="h-10 w-14 ml-4">
                {/* Border Animation */}
                <div className="stroke is-animated exclude-off-screen h-full w-full">
                  <div className="border top"></div>
                  <div className="border right"></div>
                  <div className="border bottom"></div>
                  <div className="border left"></div>

                  {/* Aroow Animation */}
                  <div className="arrow exclude-off-screen">
                    <span className="invisible">sHolder</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------
          Intro
        -------- */}
      {!isIntroEnded && (
        // {visibleDebug && !isIntroEnded && (
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
                  parentVisiblity={isIntroVisibleAll}
                />
              )}

              {isText2 && (
                <Subtitle
                  inputText={text2}
                  startTime={new Date().getTime()}
                  parentVisiblity={isIntroVisibleAll}
                />
              )}

              {isText3 && (
                <Subtitle
                  inputText={text3}
                  startTime={new Date().getTime()}
                  parentVisiblity={isIntroVisibleAll}
                />
              )}
            </div>

            {isLoaded && (
              <SkipButton parentVisiblity={isIntroVisibleAll} onSkip={onSkip} />
            )}
          </div>
        </div>
      )}

      {/* ---------
          Loading
        --------- */}
      {isLoadingLayer && (
        // {/* {visibleDebug && isLoadingLayer && ( */}
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
