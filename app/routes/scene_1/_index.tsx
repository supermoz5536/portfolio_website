import "./css/index.css";
import "./css/loading.scss";
import { gsap } from "gsap/dist/gsap";
import { useSystemStore } from "../../store/scene1/system_store";
import { useGlobalStore } from "../../store/global/global_store";
import { useEffect, useRef, useState } from "react";
import { CanvasScene1 } from "./Components/view/CanvasScene1";
import { Subtitle } from "./intro/Subtitle";
import { SkipButton } from "./intro/SkipButton";

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
      const timeout0 = setTimeout(() => setIsLoadingLayer(false), 0);
      const timeout1 = setTimeout(() => setIsText1(true), 2000);
      const timeout2 = setTimeout(() => setIsText2(true), 7000);
      const timeout3 = setTimeout(() => setIsText3(true), 12000);
      const timeout4 = setTimeout(() => setIsSkiped(true), 17000);
      const timeout5 = setTimeout(() => setIsIntroEnd(true), 18000);

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
    if (isIntroEnded) {
      document.body.style.position = "";
    } else {
      document.body.style.position = "fixed";
    }
  }, [isIntroEnded]);

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
      className="relative justify-center items-center h-[400vh] w-full bg-white"
    >
      {/* --------
          Scene1
        -------- */}
      <div
        className={
          "relative justify-center items-center h-full " +
          (isIntroEnded ? "w-full" : "w-[100vw]")
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
      {isIntroEnded && (
        <div className="absolute top-0 left-0 h-[100vh] w-full z-10">
          <div className="relative flex flex-col justify-center items-center h-[100vh] w-full z-10 ">
            <button
              className={
                "absolute top-[90%] left-[50%] -translate-x-1/2 -translate-y-1/2 h-10 w-14 text-black outline transition-opacity duration-1000"
              }
            >
              ↓
            </button>
          </div>
        </div>
      )}

      {/* -------
          Intro
        -------- */}
      {isLoaded && !isIntroEnded && (
        <div className="absolute top-0 left-0 h-[100vh] w-full z-10">
          <div className="relative flex flex-col justify-center items-center h-full w-full z-10 ">
            <div className="flex flex-col justify-start items-start h-[20vh] w-[70vw]">
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
      {isLoadingLayer && (
        <div className="absolute top-0 left-0 h-[100vh] w-full z-10">
          <div className="relative flex flex-col justify-center items-center h-full w-full z-10 ">
            <div className="flex flex-row justify-center items-center h-[20vh] w-[70vw]">
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
                "flex justify-center items-center h-[20vh] w-[70vw] text-black text-2xl " +
                (isLoaded ? "duration-1000 opacity-0" : "opacity-100")
              }
            >
              This website was made just for fun.
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
