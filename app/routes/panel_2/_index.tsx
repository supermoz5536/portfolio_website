//
import { BarChartWrapper } from "./component/Bar_chart_wrapper";
import GraphRadar from "./component/Radar_chart";
import GanttChart from "./component/Gantt_chart_";
import { AnimateInBlock } from "../../components/animate_in_block";
import { AnimateIn } from "~/components/animate_in";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap/dist/gsap";
import { useGlobalStore } from "~/store/global/global_store";

let isFirstTry = true;

export default function Panel2() {
  const panel2Ref = useRef<any>();
  const contentRef = useRef<any>();
  const scrollTriggerRef = useRef<any>(false);
  const currentWindowWidthRef = useRef<any>();
  const isMobileRef = useRef<any>();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [contentHeight, setContentHeight] = useState();

  const isMobile = useGlobalStore((state) => state.isMobile);

  useEffect(() => {
    setIsMounted(true);
    currentWindowWidthRef.current = window.innerWidth;

    /**
     * GSAP
     */

    import("gsap/dist/ScrollTrigger").then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.refresh(); //  Recalculate Scroll Volume For mobile
      scrollTriggerRef.current = ScrollTrigger;

      /**
       * Control Scroll
       */

      gsap.fromTo(
        "#panel2",
        {}, // fromVars: null
        {
          // toVars: null
          // Option
          scrollTrigger: {
            trigger: "#panel2",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
            pin: false,
            onUpdate: (value) => {
              const progressRate = value.progress;
              setScrollProgress(progressRate);
              if (progressRate >= 1.0) isFirstTry = false;
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
          callbackActions();
          currentWindowWidthRef.current = window.innerWidth;
        }
      } else {
        callbackActions();
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
    if (isMounted) {
      getContentHeight();
      if (scrollTriggerRef.current) scrollTriggerRef.current.refresh();
    }
  }, [isMounted]);

  const placeHolder = (
    <div
      className="w-full"
      style={{ height: `${contentHeight}px` }} // 「初回マウント」「リサイズ」でキャッシュした高さを適用
    />
  );

  const body = (
    <div
      ref={contentRef}
      className="text-black bg-white min-h-[100vh] h-auto w-full overflow-hidden"
    >
      {/* Responsible Width-Max-Break */}
      <div className="xl:flex flex-row justify-between xl-3:justify-center">
        {/* Header Max Wide */}
        <AnimateInBlock>
          <div className="hidden xl:block text-4xl my-sm:text-5xl xl-2:text-6xl mt-[7vh] ml-16 mr-6 font-archivo">
            <span className="block">Be</span>
            <span className="block">Super</span>
            <span className="block">Creative</span>
            <span
              id="line"
              className="block h-[0.5rem] w-[13.75rem] mt-3 bg-black"
            />
          </div>
        </AnimateInBlock>
        {/* Responsible Width-Mid-Break */}
        <div className="my-md:flex flex-row justify-between my-lg:justify-around lg-2:justify-center my-2xl:justify-between">
          {/* Header & Content Container A */}
          <div>
            {/* Header */}
            <AnimateInBlock>
              <div className="text-4xl xl:text-white my-sm:text-5xl mt-[7vh] mb-24 ml-8 my-lg:ml-10 xl:hidden font-archivo">
                <span className="block">Be</span>
                <span className="block">Super</span>
                <span className="block">Creative</span>
                <span
                  id="line"
                  className="block  h-[0.5rem] w-[10.25rem] my-sm:w-[13.7rem] mt-3 bg-black"
                />
              </div>
            </AnimateInBlock>
            {/* Content Container A */}
            <div className="mt-10 -ml-10 my-lg:ml-10 lg-2:mr-12 xl:mt-[7vh] xl-3:ml-24 xl-3:mr-20 w-96">
              <div id="chart-l" className="w-full h-[400px]">
                <BarChartWrapper />
              </div>
            </div>
          </div>

          {/* Header Place Holder & Content Container B */}
          <div>
            {/* Header Place Holder */}
            <div className="text-4xl hidden my-md:text-5xl my-md:block mt-[7vh] mb-24 ml-8 my-lg:ml-10 xl:hidden font-archivo">
              <br />
              <br />
              <br />
              <span className="block h-[0.5rem] w-[13rem] mt-3 bg-transparent" />
            </div>
            {/* Content Container B */}
            <div>
              <div className="mt-10 ml-0 mr-8 my-lg:mr-0 my-md:mt-10 xl:mt-[7vh] xl:mr-16 w-96">
                <div id="chart-r" className="w-full h-[400px]">
                  <GraphRadar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gunt Chart */}
      <div className="flex justify-center items-start mt-[5vh] w-full h-[50vh]">
        <div id="chart-b" className=" h-[90%] w-[90%]">
          <GanttChart />
        </div>
      </div>
    </div>
  );

  const body1 = <AnimateIn>{body}</AnimateIn>;
  const body2 = body;

  function getBody() {
    if (isFirstTry) return body1;
    return body2;
  }

  /// 初回マウント / リサイズ時に適用
  function getContentHeight() {
    if (panel2Ref.current) {
      // 初期化要素の高さをキャッシュ
      setContentHeight(panel2Ref.current.offsetHeight);

      // 初期化プロセスを終了し
      // 条件分岐プロセス（スクロール範囲別でのマウント <=> アンマウント）を開始
      setIsInitialized(true);
    }
    return <></>;
  }

  function callbackActions() {
    setIsInitialized(false);
    getContentHeight();
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.refresh();
    }
  }

  return (
    <div ref={panel2Ref} id="panel2" className="w-full bg-white">
      {isInitialized || (isMounted && getBody())}
      {isInitialized && (
        <>
          {scrollProgress <= 0.0 && placeHolder}
          {scrollProgress >= 1.0 && placeHolder}
          {0.0 < scrollProgress && scrollProgress < 1.0 && getBody()}
        </>
      )}
    </div>
  );
}
