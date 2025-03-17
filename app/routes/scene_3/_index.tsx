import "./css/index.css";
import { AnimateInBlock } from "~/components/animate_in_block";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useSystemStore } from "../../store/scene3/system_store";
import { useGlobalStore } from "../../store/global/global_store";
import { useEffect, useRef, useState } from "react";
import { CanvasScene3 } from "./Components/view/CanvasScene3";
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

  const isMobile = useGlobalStore((state) => state.isMobile);
  const isLandscape = useGlobalStore((state) => state.isLandscape);

  const scrollProgress = useSystemStore(
    (state) => state.scrollProgressTopAndTop,
  );

  const setClipRate = 
  useSystemStore((state: any)=>state.setClipRate) // prettier-ignore

  const setScrollProgressTopAndTop = 
    useSystemStore((state: any)=>state.setScrollProgressTopAndTop) // prettier-ignore

  const setScrollProgressTopAndBottom = 
      useSystemStore((state: any)=>state.setScrollProgressTopAndBottom) // prettier-ignore

  useEffect(() => {
    /**
     * GSAP: Recalculate Scroll Volume For mobile
     */
    ScrollTrigger.refresh();

    /**
     * Resize
     */

    // Callback
    const resizeCallback = () => {
      ScrollTrigger.refresh();
    };

    // Listener
    window.addEventListener("resize", resizeCallback);

    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);

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
            // console.log(progressRate);
            setScrollProgressTopAndTop(progressRate);
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
            setScrollProgressTopAndBottom(progressRate);
          },
        },
      },
    );
  }, []);

  useEffect(() => {
    /**
     * Control Text Groups
     */

    setTextGroup1();
    setTextGroup2();
    isMobile || setTextGroup3();
    setTextGroup4();
    setTextGroup5();
  }, [scrollProgress]);

  function setTextGroup1() {
    const triggerRate = 0.01;
    const speedRate = 0.1;
    const endRate = isMobile && isLandscape ? 0.27 : 0.19;
    let waitingViewPortRate;

    /**
     * Control Position
     */

    if (textGroup1Ref.current) {
      if (scrollProgress < triggerRate) {
        waitingViewPortRate = 100;
      } else {
        waitingViewPortRate =
          (1 -((scrollProgress - triggerRate) / triggerRate) * speedRate) * 100; // prettier-ignore
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
    const triggerRateNoMobile = 0.097;
    const triggerRateMobile = isMobile && isLandscape ? 0.095 : 0.14;
    const triggerRateFinal = isMobile ? triggerRateMobile : triggerRateNoMobile;

    const SpeedRateNoMobile = 0.97;
    const SpeedRateMobile = isMobile && isLandscape ? 0.95 : 1.4;
    const SpeedRateFinal = isMobile ? SpeedRateMobile : SpeedRateNoMobile;

    const endRate = isMobile && isLandscape ? 0.37 : 0.34;
    let waitingViewPortRate;

    /**
     * Control Position
     */

    if (textGroup2Ref.current) {
      if (scrollProgress < triggerRateFinal) {
        waitingViewPortRate = 100;
      } else {
        waitingViewPortRate =
          (1 -((scrollProgress - triggerRateFinal) / triggerRateFinal) * SpeedRateFinal) * 100; // prettier-ignore
      }

      textGroup2Ref.current.style.top = `${waitingViewPortRate}%`;

      /**
       * Control Display
       */

      if (scrollProgress < triggerRateFinal) {
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
    const speedRate = 1.9;
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
          (1 -((scrollProgress - triggerRate) / triggerRate) * speedRate) * 100; // prettier-ignore
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
    const speedRate = 4.0;
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
          (1 - ((scrollProgress - triggerRate) / triggerRate) * speedRate) *
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
    const speedRate = 5.6;
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
          (1 - ((scrollProgress - triggerRate) / triggerRate) * speedRate) *
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
          {/* Three Outline */}
          <div
            ref={canvasClipRef}
            className="absolute top-0 left-0 h-[100vh] w-full z-20"
          >
            <CanvasScene3 />
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
                <AnimateInBlock rootMarginBottom={-10}>
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
