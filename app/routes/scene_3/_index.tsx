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
  const textGroup1Ref = useRef<any>(null);
  const textGroup2Ref = useRef<any>(null);
  const textGroup3Ref = useRef<any>(null);
  const textGroup4Ref = useRef<any>(null);
  const textGroup5Ref = useRef<any>(null);
  const textGroup1DoneRef = useRef<any>(false);
  const textGroup2DoneRef = useRef<any>(false);
  const textGroup3DoneRef = useRef<any>(false);
  const textGroup4DoneRef = useRef<any>(false);
  const textGroup5DoneRef = useRef<any>(false);

  const scrollProgress = useSystemStore((state) => state.scrollProgress);
  const setScrollProgress = 
    useSystemStore((state: any)=>state.setScrollProgress) // prettier-ignore

  const scrollProgressTest = useSystemStore((state) => state.scrollProgressTest); // prettier-ignore
  const setScrollProgressTest = 
      useSystemStore((state: any)=>state.setScrollProgressTest) // prettier-ignore

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
          },
        },
      },
    );

    /**
     * Test Scroll Trigger
     */
    gsap.fromTo(
      "#scene3",

      {}, // fromVars: null

      {
        // toVars: null
        // Option
        scrollTrigger: {
          trigger: "#scene3",
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.5,
          pin: false,
          onUpdate: (value) => {
            const progressRate = value.progress;
            setScrollProgressTest(progressRate);
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
     * GSAP Reset
     * モバイルは、初回マウント後のスクロール計算結果が不正確
     * スクロールの再計算を明示
     */

    ScrollTrigger.refresh();

    /**
     * Resize
     */

    // Callback
    const resizeCallback = () => {
      if (window.matchMedia("(orientation: landscape)").matches) {
        setIsLandscape(true);
        ScrollTrigger.refresh();
      } else {
        setIsLandscape(false);
        ScrollTrigger.refresh();
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
    /**
     * Control ClipPath
     */
    setClipPath();

    /**
     * Control Text Groups
     */

    setTextGroup1();
    setTextGroup2();
    isMobile || setTextGroup3();
    setTextGroup4();
    setTextGroup5();
  }, [scrollProgress]);

  function setClipPath() {
    let newClip;
    if (scrollProgress < 0.235) {
      newClip = "100%";
    } else {
      // scrollProgress が 0.235 から 1 に進むと、画面 Bottom(100%) => Top に変化
      newClip = `${(1 - (scrollProgress - 0.235) / 0.235) * 100}%`;
    }

    if (canvasClipRef.current) {
      canvasClipRef.current.style.setProperty("--clip-bottom", newClip);
    }
  }

  function setTextGroup1() {
    const triggerRate = 0.01;
    const scrollSpeedRate = 0.1;
    const endRate = 0.19;
    let waitingViewPortRate;

    /**
     * Control Position
     */

    if (textGroup1Ref.current) {
      if (scrollProgress < triggerRate) {
        waitingViewPortRate = 100;
      } else {
        waitingViewPortRate =
          (1 -((scrollProgress - triggerRate) / triggerRate) * scrollSpeedRate) * 100; // prettier-ignore
      }

      textGroup1Ref.current.style.top = `${waitingViewPortRate}%`;

      /**
       * Control Display
       */

      if (scrollProgress < triggerRate) {
        textGroup1Ref.current.style.display = "none";
      } else if (scrollProgress > endRate) {
        textGroup1Ref.current.style.display = "none";
        textGroup1DoneRef.current = true;
      } else {
        textGroup1Ref.current.style.display = "block";
      }

      // console.log(waitingViewPortRate + "%");
    }
  }

  function setTextGroup2() {
    const triggerRate = 0.095;
    const scrollSpeedRate = 0.95;
    const endRate = 0.28;
    let waitingViewPortRate;

    /**
     * Control Position
     */

    if (textGroup2Ref.current) {
      if (scrollProgress < triggerRate) {
        waitingViewPortRate = 100;
      } else {
        waitingViewPortRate =
          (1 -((scrollProgress - triggerRate) / triggerRate) * scrollSpeedRate) * 100; // prettier-ignore
      }

      textGroup2Ref.current.style.top = `${waitingViewPortRate}%`;

      /**
       * Control Display
       */

      if (scrollProgress < triggerRate) {
        textGroup2Ref.current.style.display = "none";
      } else if (scrollProgress > endRate) {
        textGroup2Ref.current.style.display = "none";
        textGroup2DoneRef.current = true;
      } else {
        textGroup2Ref.current.style.display = "block";
      }

      // console.log(waitingViewPortRate + "%");
    }
  }

  function setTextGroup3() {
    const triggerRate = 0.19;
    const scrollSpeedRate = 1.9;
    const endRate = 0.38;
    let waitingViewPortRate;

    /**
     * Control Position
     */

    if (textGroup3Ref.current) {
      if (scrollProgress < triggerRate) {
        waitingViewPortRate = 100;
      } else {
        waitingViewPortRate =
          (1 -((scrollProgress - triggerRate) / triggerRate) * scrollSpeedRate) * 100; // prettier-ignore
      }

      textGroup3Ref.current.style.top = `${waitingViewPortRate}%`;

      /**
       * Control Display
       */

      if (scrollProgress < triggerRate) {
        textGroup3Ref.current.style.display = "none";
      } else if (scrollProgress > endRate) {
        textGroup3Ref.current.style.display = "none";
        textGroup3DoneRef.current = true;
      } else {
        textGroup3Ref.current.style.display = "block";
      }

      // console.log(waitingViewPortRate + "%");
    }
  }

  function setTextGroup4() {
    const triggerRate = 0.4;
    const scrollSpeedRate = 4.0;
    const endRate = 0.55;
    let waitingViewPortRate;

    /**
     * Control Viewport Position
     */

    if (textGroup4Ref.current) {
      if (scrollProgress < triggerRate) {
        waitingViewPortRate = 100;
      } else {
        waitingViewPortRate =
          (1 -
            ((scrollProgress - triggerRate) / triggerRate) * scrollSpeedRate) *
          100;
      }

      textGroup4Ref.current.style.top = `${waitingViewPortRate}%`;

      /**
       * Control Display
       */

      if (scrollProgress < triggerRate) {
        textGroup4Ref.current.style.display = "none";
      } else if (scrollProgress > endRate) {
        textGroup4Ref.current.style.display = "none";
        textGroup4DoneRef.current = true;
      } else {
        textGroup4Ref.current.style.display = "block";
      }

      // console.log(Math.round(waitingViewPortRate) + "%");
    }
  }

  function setTextGroup5() {
    const triggerRate = 0.56;
    const scrollSpeedRate = 5.6;
    const endRate = 0.71;
    let waitingViewPortRate;

    /**
     * Control Position
     */

    if (textGroup5Ref.current) {
      if (scrollProgress < triggerRate) {
        waitingViewPortRate = 100;
      } else {
        waitingViewPortRate =
          (1 -
            ((scrollProgress - triggerRate) / triggerRate) * scrollSpeedRate) *
          100;
      }

      textGroup5Ref.current.style.top = `${waitingViewPortRate}%`;

      /**
       * Control Display
       */

      if (scrollProgress < triggerRate) {
        textGroup5Ref.current.style.display = "none";
      } else if (scrollProgress > endRate) {
        textGroup5Ref.current.style.display = "none";
        textGroup5DoneRef.current = true;
      } else {
        textGroup5Ref.current.style.display = "block";
      }

      // console.log(waitingViewPortRate + "%");
    }
  }

  const textGroup1Content = (
    <div className="absolute top-0 left-0 flex flex-col justify-start items-center w-full">
      <div
        id="tablet"
        // id="scale-in-top"
        className={
          "flex flex-col justify-start h-[30vh] w-full my-md:pl-0 my-md:flex-row my-md:justify-between my-md:items-center lg-2:justify-around xl-2:justify-center " +
          (isMobile && isLandscape ? "items-start ml-[7vw]" : "items-center")
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
  );

  const textGroup2Content = (
    <div className="absolute top-0 left-0 flex flex-col justify-start items-center w-full">
      <div
        id="tablet"
        // id="scale-in-top"
        className={
          "mt-10 flex flex-col justify-start h-[30vh] w-full my-md:pl-0 my-md:flex-row my-md:justify-between my-md:items-center lg-2:justify-around xl-2:justify-center " +
          (isMobile && isLandscape ? "items-end mr-[7vw]" : "items-center")
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
  );

  const textGroup3Content = (
    <div className="absolute top-0 left-0 flex flex-col justify-start items-center w-full">
      <div
        id="tablet"
        // id="scale-in-top"
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
  );

  const textGroup4Content = (
    <div
      id="tablet"
      className="absolute top-0 right-[50%] translate-x-[50%] h-52 w-[20rem] flex flex-col justify-center items-center border-t-2 border-t-gray-300 border-b-2 border-b-gray-300 my-sm:right-[30%] my-lg:w-[26rem]"
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
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, odio.
      </p>
    </div>
  );

  const textGroup5Content = (
    <div
      id="tablet"
      className="absolute top-0 left-[50%] translate-x-[-50%] h-52 w-[20rem] flex flex-col justify-center items-center border-t-2 border-t-gray-300 border-b-2 border-b-gray-300 my-sm:left-[30%] my-lg:w-[26rem]"
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
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, odio.
      </p>
    </div>
  );

  return (
    <>
      <div
        id="scene3"
        className="relative justify-center items-center h-[800vh] w-full"
      >
        {/*
         * Sticky Components
         */}

        <div className="sticky top-0 left-0 h-[100vh] w-full z-0">
          {/* Three Normal */}
          {/* {isMobile || ()} */}
          <div className="absolute top-0 left-0 h-[100vh] w-full z-0">
            <CanvasNormal />
          </div>

          {/* Three Outline */}
          <div
            ref={canvasClipRef}
            className="absolute top-0 left-0 h-[100vh] w-full z-20"
            // style={
            //   isMobile
            //     ? {}
            //     : {
            //         clipPath:
            //           "polygon(0 0, 100% 0, 100% var(--clip-bottom, 100%), 0 var(--clip-bottom, 100%))",
            //       }
            // }
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% var(--clip-bottom, 100%), 0 var(--clip-bottom, 100%))",
            }}
          >
            <CanvasOutline />
          </div>

          {/* Text Group 1 */}
          <div
            ref={textGroup1Ref}
            className="absolute top-0 left-0 h-[100vh] w-full z-30"
          >
            <div className="relative w-full h-full">
              {textGroup1DoneRef.current ? (
                textGroup1Content
              ) : (
                <AnimateInBlock rootMarginBottom={-20}>
                  {textGroup1Content}
                </AnimateInBlock>
              )}
            </div>
          </div>

          {/* Text Group 2 */}
          <div
            ref={textGroup2Ref}
            className="absolute top-0 left-0 h-[100vh] w-full z-30"
          >
            <div className="relative w-full h-full">
              {textGroup2DoneRef.current ? (
                textGroup2Content
              ) : (
                <AnimateInBlock rootMarginBottom={-20}>
                  {textGroup2Content}
                </AnimateInBlock>
              )}
            </div>
          </div>

          {/* Text Group 3 */}
          {isMobile || (
            <>
              <div
                ref={textGroup3Ref}
                className="absolute top-0 left-0 h-[100vh] w-full z-30"
              >
                <div className="relative w-full h-full">
                  {textGroup3DoneRef.current ? (
                    textGroup3Content
                  ) : (
                    <AnimateInBlock rootMarginBottom={-20}>
                      {textGroup3Content}
                    </AnimateInBlock>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Text Group 4 (Right Texts) */}
          <div
            ref={textGroup4Ref}
            className="absolute top-0 left-0 h-[100vh] w-full z-30"
          >
            <div className="relative w-full h-full">
              {textGroup4DoneRef.current ? (
                textGroup4Content
              ) : (
                <AnimateInBlock rootMarginBottom={-10}>
                  {textGroup4Content}
                </AnimateInBlock>
              )}
            </div>
          </div>

          {/* Text Group 5 (Left Texts) */}
          <div
            ref={textGroup5Ref}
            className="absolute top-0 left-0 h-[100vh] w-full z-30"
          >
            <div className="relative w-full h-full">
              {textGroup5DoneRef.current ? (
                textGroup5Content
              ) : (
                <AnimateInBlock rootMarginBottom={-20}>
                  {textGroup5Content}
                </AnimateInBlock>
              )}
            </div>
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
                className="absolute top-[707.5vh] left-0 h-[92.5vh] w-[100%] z-40 overflow-auto"
                style={{ backgroundColor: "rgba(0, 255, 0, 0.4)" }}
              >
                <ContactForm />
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

// {
//   /* 輪郭抽出部分のテキスト群のラッパー(デスクトップ) */
// }
// <div className="absolute top-0 left-0 h-[87.5%] w-full z-40">
//   <div className="relative top-0 left-0 h-full w-full">
//     {/* Row1 */}
//     <AnimateInBlock rootMarginBottom={-50}>
//       <div className="absolute top-[3.5%] left-0 flex flex-col justify-start items-center w-full">
//         <div
//           id="scale-in-top"
//           className={
//             "mt-10 flex flex-col justify-start h-[30vh] w-full my-md:pl-0 my-md:flex-row my-md:justify-between my-md:items-center lg-2:justify-around xl-2:justify-center " +
//             (isMobile && isLandscape ? "items-start ml-[7vw]" : "items-center")
//           }
//         >
//           {/* Row1-L */}
//           <div className=" ml-0 flex flex-col justify-start items-start h-[30vh] w-[21rem] my-md:ml-20 xl-2:ml-0">
//             <span
//               id="tablet"
//               className="mb-5 z-50 text-6xl text-black my-md:text-7xl my-lg:text-8xl"
//             >
//               {isMobile ? " " : "Curious"}
//             </span>
//           </div>

//           {/* Row1-R */}
//           <div
//             className="pt-4 pl-8 mr-0 flex flex-col justify-start items-start h-[33rem] w-[21rem] my-md:mt-36 my-md:pt-9 my-md:mr-32 xl-2:ml-20"
//             style={{
//               backgroundColor: "rgba(255, 0, 0, 0.5)",
//             }}
//           >
//             <span
//               id="tablet"
//               className="mb-7 z-50 text-4xl text-white whitespace-nowrap"
//             >
//               Find your Joy
//             </span>

//             <div className="ml-6 flex flex-col justify-start items-start">
//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Ideas spark here daily.
//               </span>
//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Creative minds play freely.
//               </span>
//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Imagination thrives openly.
//               </span>
//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Dare to dream boldly.
//               </span>

//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Invent joy daily always.
//               </span>
//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Curiosity rules your mind.
//               </span>
//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Passion meets creation.
//               </span>
//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Art starts right now.
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </AnimateInBlock>

//     {/* Row2 */}
//     <AnimateInBlock rootMarginBottom={-20}>
//       <div className="absolute top-[15%] left-0 flex flex-col justify-start items-center w-full">
//         <div
//           id="scale-in-top"
//           className={
//             "mt-10 flex flex-col justify-start h-[30vh] w-full my-md:pl-0 my-md:flex-row my-md:justify-between my-md:items-center lg-2:justify-around xl-2:justify-center " +
//             (isMobile && isLandscape ? "items-end mr-[7vw]" : "items-center")
//           }
//         >
//           {/* Row2-L */}
//           <div className=" ml-0 flex flex-col justify-start items-start h-[30vh] w-[21rem] my-md:ml-20 xl-2:ml-0">
//             <span
//               id="tablet"
//               className="mb-5 z-50 text-6xl text-black my-md:text-7xl my-lg:text-8xl"
//             >
//               {isMobile ? " " : "Discover"}
//             </span>
//           </div>

//           {/* Row2-R */}
//           <div
//             className="pt-4 pl-8 mr-0 flex flex-col justify-start items-start h-[33rem] w-[21rem] my-md:mt-36 my-md:pt-9 my-md:mr-32 xl-2:ml-20"
//             style={{
//               backgroundColor: "rgba(0, 0, 255, 0.5)",
//             }}
//           >
//             <span
//               id="tablet"
//               className="mb-7 z-50 text-4xl text-white whitespace-nowrap"
//             >
//               Explore Ideas
//             </span>

//             <div className="ml-6 flex flex-col justify-start items-start">
//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Joy fuels art daily.
//               </span>
//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Play is truly powerful.
//               </span>
//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Delight in every detail.
//               </span>
//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Create smiles often.
//               </span>
//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Embrace fun daily here.
//               </span>
//               <span className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap">
//                 - Steps to playful wonder.
//               </span>
//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Unleash laughter now.
//               </span>
//               <span
//                 id="fade-in-left"
//                 className="mb-7 z-50 text-[1.2rem] leading-6 text-white whitespace-nowrap"
//               >
//                 - Make play serious always.
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </AnimateInBlock>

//     {/* Row3 */}
//     {(isMobile && isLandscape) || (
//       <>
//         <AnimateInBlock rootMarginBottom={-20}>
//           <div className="absolute top-[26.5%] left-0 flex flex-col justify-start items-center w-full">
//             <div
//               id="scale-in-top"
//               className="mt-10 flex flex-col justify-start items-center h-[30vh] w-full my-md:pl-0 my-md:flex-row my-md:justify-between my-md:items-center lg-2:justify-around xl-2:justify-center"
//             >
//               {/* Row3-L */}
//               <div className=" ml-0 flex flex-col justify-start items-start h-[30vh] w-[21rem] my-md:ml-20 xl-2:ml-0">
//                 <span
//                   id="tablet"
//                   className="mb-5 z-50 text-6xl text-black my-md:text-7xl my-lg:text-8xl"
//                 >
//                   {isMobile ? " " : "Innovate"}
//                 </span>
//               </div>

//               {/* Row3-R */}
//               <div
//                 className="pt-4 pl-8 mr-0 flex flex-col justify-start items-start h-[33rem] w-[21rem] my-md:mt-36 my-md:pt-9 my-md:mr-32 xl-2:ml-20"
//                 style={{
//                   backgroundColor: "rgba(0, 255, 0, 0.5)",
//                 }}
//               >
//                 <span
//                   id="tablet"
//                   className="mb-7 z-50 text-4xl text-black whitespace-nowrap"
//                 >
//                   Genuine Fun
//                 </span>

//                 <div className="ml-6 flex flex-col justify-start items-start">
//                   <span
//                     id="fade-in-left"
//                     className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
//                   >
//                     - Sparks new paths.
//                   </span>
//                   <span
//                     id="fade-in-left"
//                     className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
//                   >
//                     - Fun with daily inspires.
//                   </span>
//                   <span
//                     id="fade-in-left"
//                     className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
//                   >
//                     - True creativity right here.
//                   </span>
//                   <span
//                     id="fade-in-left"
//                     className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
//                   >
//                     - Authentic joy found now.
//                   </span>
//                   <span
//                     id="fade-in-left"
//                     className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
//                   >
//                     - Deep play fuels creativity.
//                   </span>
//                   <span
//                     id="fade-in-left"
//                     className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
//                   >
//                     - True laughter inspires ideas.
//                   </span>
//                   <span
//                     id="fade-in-left"
//                     className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
//                   >
//                     - Ideas is truly righteous.
//                   </span>
//                   <span
//                     id="fade-in-left"
//                     className="mb-7 z-50 text-[1.2rem] leading-6 text-black whitespace-nowrap"
//                   >
//                     - Play always honestly.
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </AnimateInBlock>
//       </>
//     )}

//     {/* Right Texts */}
//     <AnimateInBlock rootMarginBottom={-30}>
//       <div
//         id="tablet"
//         className="absolute top-[55%] right-[50%] translate-x-[50%] translate-y-[-50%] h-52 w-[20rem] flex flex-col justify-center items-center border-t-2 border-t-gray-300 border-b-2 border-b-gray-300 my-sm:right-[30%] my-lg:w-[26rem]"
//         style={{
//           backgroundColor: "rgba(255, 0, 0, 0.35)",
//         }}
//       >
//         <span
//           id="fade-in-bottom"
//           className="mb-3 text-5xl text-white whitespace-nowrap my-lg:text-6xl"
//         >
//           Where?
//         </span>
//         <p
//           id="fade-in-bottom"
//           className="text-center text-2xl text-white my-lg:text-3xl"
//         >
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, odio.
//         </p>
//       </div>
//     </AnimateInBlock>

//     {/* Left Texts */}
//     <AnimateInBlock rootMarginBottom={-30}>
//       <div
//         id="tablet"
//         className="absolute top-[67%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-52 w-[20rem] flex flex-col justify-center items-center border-t-2 border-t-gray-300 border-b-2 border-b-gray-300 my-sm:left-[30%] my-lg:w-[26rem]"
//         style={{
//           backgroundColor: "rgba(0, 0, 255, 0.4)",
//         }}
//       >
//         <span
//           id="fade-in-bottom"
//           className="mb-3 text-5xl text-white whitespace-nowrap my-lg:text-6xl"
//         >
//           When?
//         </span>
//         <p
//           id="fade-in-bottom"
//           className="text-center text-2xl text-white my-lg:text-3xl"
//         >
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, odio.
//         </p>
//       </div>
//     </AnimateInBlock>
//   </div>
// </div>;
