import "./css/index.css";
import { gsap } from "gsap/dist/gsap";
import { useSystemStore } from "../../store/scene1/system_store";
import { useGlobalStore } from "../../store/global/global_store";
import { useEffect, useRef, useState } from "react";
import { CanvasScene1 } from "./Components/view/CanvasScene1";
import { ShowSubtitle } from "./intro/intro";

export default function Scene1() {
  const [isTextAllVisible, setIsAllTextVisible] = useState(true);
  const [isText1, setIsText1] = useState(false);
  const [isText2, setIsText2] = useState(false);
  const [isText3, setIsText3] = useState(false);
  const [isSkiped, setIsSkiped] = useState(false);

  const scrollTriggerRef = useRef<any>(false);
  const currentWindowWidthRef = useRef<any>();
  const isMobileRef = useRef<any>();

  /**
   * Store State
   */

  const isMobile = useGlobalStore((state) => state.isMobile);
  const isIntroEnded = useSystemStore((state: any)=>state.isIntroEnd) // prettier-ignore

  /**
   * Store Setter
   */

  const setScrollProgressTopAndBottom = 
      useSystemStore((state: any)=>state.setScrollProgressTopAndBottom) // prettier-ignore

  const setIsIntroEnd = 
      useSystemStore((state: any)=>state.setIsIntroEnd) // prettier-ignore

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
              // console.log(progressRate);
            },
          },
        },
      );
    });

    /**
     * Subtitle
     */

    const timeout1 = setTimeout(() => setIsText1(true), 2000);
    const timeout2 = setTimeout(() => setIsText2(true), 7000);
    const timeout3 = setTimeout(() => setIsText3(true), 12000);
    const timeout4 = setTimeout(() => setIsIntroEnd(true), 17000);

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
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  function controlSkip() {
    setIsAllTextVisible(false);
    setIsSkiped(true);
    setTimeout(() => {
      setIsIntroEnd(true);
    }, 1000);
  }

  useEffect(() => {
    if (isIntroEnded) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isIntroEnded]);

  return (
    <div
      id="scene1"
      className="relative justify-center items-center h-[400vh] w-full"
    >
      {/* --------
          Scene1
        -------- */}
      <div className="relative justify-center items-center h-full w-full">
        {/**
         *  Sticky
         */}

        <div className="sticky top-0 left-0 h-[100vh] w-full z-0">
          <div className="absolute top-0 left-0 h-full w-full z-0">
            <CanvasScene1 />
          </div>
        </div>
      </div>

      {/* -------
          Intro
        -------- */}
      {isIntroEnded || (
        <div className="absolute top-0 left-0 h-[100vh] w-full z-10">
          <div className="relative flex flex-col justify-center items-center h-full w-full z-10 ">
            <div className="flex flex-col justify-start items-start h-[20vh] w-[70vw]">
              {isText1 && (
                <ShowSubtitle
                  inputText={text1}
                  startTime={new Date().getTime()}
                  parentVisiblity={isTextAllVisible}
                />
              )}

              {isText2 && (
                <ShowSubtitle
                  inputText={text2}
                  startTime={new Date().getTime()}
                  parentVisiblity={isTextAllVisible}
                />
              )}

              {isText3 && (
                <ShowSubtitle
                  inputText={text3}
                  startTime={new Date().getTime()}
                  parentVisiblity={isTextAllVisible}
                />
              )}
            </div>

            <button
              className={
                "absolute top-[90%] left-[90%] -translate-x-1/2 -translate-y-1/2 h-10 w-16 text-black outline duration-1000 " +
                (isSkiped ? "opacity-0" : "opacity-100")
              }
              onClick={() => controlSkip()}
            >
              Skip
            </button>
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
