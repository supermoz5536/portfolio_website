import { useEffect, useRef, useState } from "react";
import useSystemStore from "../../../../store/three_contents_store";
import ThreeContentsStore from "../../../../store/three_contents_store";
import { AnimateIn } from "~/components/animate_in";
import { AnimateInBlock } from "~/components/animate_in_block";

export function StoneTabletView() {
  const [isViewOn, setIsViewOn] = useState(false);
  const [isVisBg, setIsVisBg] = useState(false);
  const [isVisHeader, setIsVisHeader] = useState(false);
  const [isVisText1, setIsVisText1] = useState(false);
  const [isVisText2, setIsVisText2] = useState(false);
  const [isVisText3, setIsVisText3] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(true);

  const timeoutBgRef = useRef<any>();
  const timeoutHeaderRef = useRef<any>();
  const timeoutText1Ref = useRef<any>();
  const timeoutText2Ref = useRef<any>();
  const timeoutText3Ref = useRef<any>();

  const handleViewOn = () => {
    /**
     * Count Reset
     */
    clearTimeout(timeoutBgRef.current);
    clearTimeout(timeoutHeaderRef.current);
    clearTimeout(timeoutText1Ref.current);
    clearTimeout(timeoutText2Ref.current);
    clearTimeout(timeoutText3Ref.current);

    /**
     * Control View
     */

    setIsViewOn(true);

    timeoutBgRef.current = setTimeout(() => setIsVisBg(true), 700);
    timeoutHeaderRef.current = setTimeout(() => setIsVisHeader(true), 1000);
    timeoutText1Ref.current = setTimeout(() => setIsVisText1(true), 2000);
    timeoutText2Ref.current = setTimeout(() => setIsVisText2(true), 2500);
    timeoutText3Ref.current = setTimeout(() => setIsVisText3(true), 3000);
  };

  const handleViewOff = () => {
    setIsViewOn(false);

    setIsVisBg(false);
    setIsVisHeader(false);
    setIsVisText1(false);
    setIsVisText2(false);
    setIsVisText3(false);
  };

  const getObj = (selectedStoneTabletIndex: number) => {
    const currentObject = viewObjects[selectedStoneTabletIndex];
    return currentObject;
  };

  useEffect(() => {
    /*
     * Device Setup
     */

    if (typeof window !== "undefined") {
      if (window.innerWidth < 500) setIsMobile(true);
      if (window.innerWidth >= 500) setIsMobile(false);
    }

    /**
     * Handle View
     */

    const unsubscribeSelectedStoneTabletIndex = ThreeContentsStore.subscribe(
      (state: any) => ({
        isStoneTabletSelected: state.isStoneTabletSelected,
        selectedStoneTabletIndex: state.selectedStoneTabletIndex,
      }),
      (value) => {
        if (value.isStoneTabletSelected) handleViewOn();
        if (!value.isStoneTabletSelected) handleViewOff();
        setSelectedIndex(value.selectedStoneTabletIndex);
      },
    );

    return () => {
      unsubscribeSelectedStoneTabletIndex();
    };
  }, []);

  return (
    <>
      {isViewOn && (
        <>
          <div
            className={
              "absolute py-32 justify-center items-center top-[0%] left-[0%] z-10 h-full w-full pointer-events-none " +
              (isMobile ? "px-2" : "px-10")
            }
          >
            {/* Container */}
            <div className="flex flex-col justify-start items-center z-10 h-full w-full">
              {/* Container Header */}
              <div className="flex flex-col justify-center items-center mt-10">
                {isVisHeader ? (
                  <AnimateInBlock>
                    <p
                      id="tablet"
                      className={isMobile ? "text-white text-2xl" : "text-4xl"}
                    >
                      {getObj(selectedIndex).header1}
                    </p>
                    <p
                      id="tablet"
                      className={isMobile ? "text-white text-2xl" : "text-4xl"}
                    >
                      {getObj(selectedIndex).header2}
                    </p>
                  </AnimateInBlock>
                ) : (
                  <>
                    <p> &nbsp; </p>
                    <p> &nbsp; </p>
                  </>
                )}
              </div>

              {/* Container Texts */}
              <div
                className={
                  "flex flex-col justify-start items-start h-full mt-10 " +
                  (isMobile ? "w-[90%]" : "w-[50%]")
                }
              >
                {isVisText1 && (
                  <AnimateIn rootMarginBottom={0}>
                    <p
                      id="tablet"
                      className={isMobile ? "text-white text-lg" : "text-2xl"}
                    >
                      {getObj(selectedIndex).text1}
                    </p>
                  </AnimateIn>
                )}

                <div className="mt-7">
                  {isVisText2 && (
                    <AnimateIn rootMarginBottom={0}>
                      <p
                        id="tablet"
                        className={isMobile ? "text-white text-lg" : "text-2xl"}
                      >
                        {getObj(selectedIndex).text2}
                      </p>
                    </AnimateIn>
                  )}
                </div>

                <div className="mt-7">
                  {isVisText3 && (
                    <AnimateIn rootMarginBottom={0}>
                      <p
                        id="tablet"
                        className={isMobile ? "text-white text-lg" : "text-2xl"}
                      >
                        {getObj(selectedIndex).text3}
                      </p>
                    </AnimateIn>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* bg */}
          <div
            className={
              "absolute top-[0%] left-[0%] h-full w-full z-0 bg-black pointer-events-none transform transition-opacity duration-500 " +
              (isVisBg ? "opacity-60 " : "opacity-0 ")
            }
          />
        </>
      )}
    </>
  );
}

const viewObjects: any = {
  // 0: {
  //   header1: "God Does Not Exist,",
  //   header2: "the one standing there says,",
  //   text1: "The expansion of the sense of absolute justice.",
  //   text2: "Ontological self-Destruction.",
  //   text3: "Restriction within a certain social identity due to a singular and narrow perspective.", // prettier-ignore
  // },
  0: {
    header1: "Sanple Text",
    header2: "Sanple Text",
    text1: "Sanple Text ",
    text2: "Sanple Text Sanple Text",
    text3: "Sanple Text Sanple Text Sanple Text",
  },
  3: {
    header1: "Monotheism",
    header2: "Fixed-Do Style",
    text1: "Synchronization of social sensibility",
    text2: "Absolute perception of a name based on its appearance.",
    text3: "It accepts contradictions as if they don't exist.",
  },
  6: {
    header1: "Polytheism",
    header2: "Movable-Do Style",
    text1: "Synchronization of self-Sensibility",
    text2: "Relative perception of tonality based on its quality.",
    text3: "It prefers things to be logically consistent.",
  },
  7: {
    header1: "Sanple Text",
    header2: "Sanple Text",
    text1: "Sanple Text ",
    text2: "Sanple Text Sanple Text",
    text3: "Sanple Text Sanple Text Sanple Text",
  },
  9: {
    header1: "Pantheism",
    header2: "",
    text1: "Everything is interconnected while remaining distinct.",
    text2: "A sense of well-being in being normal, deeply rooted in the chest.",
    text3: "",
  },
  10: {
    header1: "Sanple Text",
    header2: "Sanple Text",
    text1: "Sanple Text ",
    text2: "Sanple Text Sanple Text",
    text3: "Sanple Text Sanple Text Sanple Text",
  },
  11: {
    header1: "Sanple Text",
    header2: "Sanple Text",
    text1: "Sanple Text ",
    text2: "Sanple Text Sanple Text",
    text3: "Sanple Text Sanple Text Sanple Text",
  },
};
