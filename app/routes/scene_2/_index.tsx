import "./css/index.css";
import { Button } from "@headlessui/react";
import EntryPointThree from "./EntryPointThree";
import { useSystemStore } from "~/store/scene2/system_store";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { LuChevronDown } from "react-icons/lu";
import { useEffect, useState } from "react";
import { AnimateInBlock } from "~/components/animate_in_block";
import { AnimateIn } from "~/components/animate_in";
import ThreePlayer from "../../store/scene2/three_player_store";
import ThreeContents from "../../store/scene2/three_contents_store";
import { MdOutlineCameraswitch } from "react-icons/md";
import { useGlobalStore } from "~/store/global/global_store";
import { gsap } from "gsap/dist/gsap";

export default function Scene2() {
  /**
   * Local State
   */
  const { isActivated, setIsActivated } = useSystemStore();
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [isFirstActivate, setIsFirstActivate] = useState(true);
  const [isGuidOn, setIsGuideOn] = useState(true);
  const [isGuidVisible, setIsGuideVisible] = useState(false);
  const [isPlayerFocused, setIsPlayerFocused] = useState(true);
  const [isNoneSelected, setIsNoneSelected] = useState(false);
  const [isOrbitControlMobile, setIsOrbitControlMobile] = useState(false);

  /**
   * Store State
   */
  const isMobile = useGlobalStore((state) => state.isMobile);
  const toggleIsOrbitControlMobile = useSystemStore((state:any)=> state.toggleIsOrbitControlMobile) // prettier-ignore

  /**
   * Store Setter
   */
  const setIsPlayerFocus = useSystemStore((state: any) => state.setIsPlayerFocus); // prettier-ignore
  const setScrollProgressTopAndBottom = 
      useSystemStore((state: any)=>state.setScrollProgressTopAndBottom) // prettier-ignore

  const activateOn = () => {
    setIsActivated(true);
    setIsPlayerFocus(true);
  };

  const activateOff = () => {
    setIsActivated(false);
    setIsPlayerFocus(true);
  };

  const toggleOrbitControl = () => {
    toggleIsOrbitControlMobile();
  };

  const handleHome = () => {
    if (isOrbitControlMobile) {
      setIsOrbitControlMobile(false);
      toggleIsOrbitControlMobile();
    }

    setIsPlayerFocus(true);
  };

  useEffect(() => {
    /**
     * Scroll Trigger
     */
    import("gsap/dist/ScrollTrigger").then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.refresh(); //  Recalculate Scroll Volume For mobile

      gsap.fromTo(
        "#scene2",

        {}, // fromVars: null

        {
          // toVars: null
          // Option
          scrollTrigger: {
            trigger: "#scene2",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
            pin: false,
            onUpdate: (value) => {
              const progressRate = value.progress;
              setScrollProgressTopAndBottom(progressRate);
            },
          },
        },
      );
    });

    /**
     * ZoomOut Control
     */

    const unsubscribeIsPlayerFocused = useSystemStore.subscribe(
      (state: any) => state.isPlayerFocused,
      (isPlayerFocused) => {
        setIsPlayerFocused(isPlayerFocused);
      },
    );

    /**
     * Guide Control
     */

    // 入力を確認して非表示
    const unsubscribePlayer = ThreePlayer.subscribe(
      (state: any) => state.isPlayerFirstMoved,
      (value: any) => {
        if (value) {
          // フェードアウト
          setIsGuideVisible(false);
          //フェードアウト終了後にアンマウント
          setTimeout(() => {
            setIsGuideOn(false);
          }, 500);
        }
      },
    );

    /**
     * Button Control
     */

    const unsubscribeContents = ThreeContents.subscribe(
      (state: any) => state.isNoneSelected,
      (value) => {
        setIsNoneSelected(value);
      },
    );

    const unsubscribeIsOrbitControlMobile = useSystemStore.subscribe(
      (state: any) => state.isOrbitControlMobile,
      (value) => {
        setIsOrbitControlMobile(value);
      },
    );

    /**
     * Resize
     */

    window.addEventListener("resize", activateOff);

    return () => {
      unsubscribePlayer();
      unsubscribeIsPlayerFocused();
      unsubscribeContents();
      unsubscribeIsOrbitControlMobile();
      window.removeEventListener("resize", activateOff);
    };
  }, []);

  /* --------------------
      Control Activation
    -------------------- */
  useEffect(() => {
    if (isActivated) {
      // 初回アクティベーション時の遅延演出の表示
      if (isFirstActivate) {
        setIsFirstActivate(false);
        setTimeout(() => {
          setIsGuideVisible(true);
        }, 300);
      }

      /**
       * Setup Scroll
       */

      // 初回のマウント時はスキップ（スクロール補正が必要ない）
      fixScroll();

      // fixScroll()で scene2 の位置に移動した後に
      // 現在のスクロール位置を取得
      const currentScrollY = window.scrollY;

      // bodyを固定（トップを -scrollY にする）
      document.body.style.position = "fixed";
      document.body.style.top = `-${currentScrollY}px`; // body自体を上にズラしてスクロール再現
      document.body.style.left = "0"; // 水平方向のbodyのスクロール位置を0(tailwind left-0と同じ)
      document.body.style.width = "100vw"; // position: fixed で body のサイズが縮小し不具合の可能性。初期化が必要。
      document.documentElement.style.overflow = "hidden";
    } else {
      if (!isFirstMount) {
        // body固定を解除する
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.width = "";
        document.documentElement.style.overflow = "";

        fixScroll();
      }
    }

    setIsFirstMount(false);
  }, [isActivated]);

  function fixScroll() {
    // Scene2のコンポーネントをDOMからIDで取得
    const scene2Element: HTMLLIElement | null =
      document.querySelector("#scene2");
    if (!scene2Element) return;

    // offsetのメソッドで上端のスクロール位置を取得
    const scene2OffsetTop = scene2Element.offsetTop;

    // scrollToのtopの値は、
    // ViewPortの上端を示すので
    // そのままoffsetTopの値を渡せばOK
    window.scrollTo({
      top: scene2OffsetTop,
    });
  }

  return (
    <>
      <div
        id="scene2"
        className="relative flex justify-center items-center h-[100vh] w-full"
      >
        {/* Three */}
        <div className="absolute top-0 left-0 h-[100vh] w-full z-0">
          <EntryPointThree />
        </div>

        {isActivated == false ? (
          <>
            <AnimateInBlock>
              {/* 文字とボタンの配置管理するコンテナ */}
              <div className="flex flex-col justify-center items-center h-[80vh] w-[80vw] z-10">
                <div className="mb-5 z-10 text-2xl text-white whitespace-nowrap">
                  <p>Journey through Creations</p>
                </div>
                <span className="mb-5 z-10 text-7xl text-white ">Who?</span>
                <span className="mb-5 z-10 text-[1.2rem] leading-6 text-white whitespace-nowrap">
                  Steps to an Inner Universe.
                </span>

                <Button
                  id="button"
                  className={
                    "mt-10 ml-28 z-10 rounded-full border-2 border-sky-400 bg-white text-black hover:bg-gray-300 transform duration-200"
                  }
                  onClick={() => activateOn()}
                >
                  <p id="fade-in-bottom" className="p-3">
                    Get Started!
                  </p>
                </Button>
              </div>
            </AnimateInBlock>

            {/* 背景 */}
            <div className="absolute top-0 left-0 h-full w-full bg-black opacity-35 z-[5]" />
          </>
        ) : (
          <>
            {/* Mobile */}
            {isGuidOn && isMobile && (
              <>
                {/* 背景 */}
                <div
                  className={
                    "absolute top-0 left-0 z-10 h-full w-full bg-black transition-all duration-300 " +
                    (isGuidVisible ? "opacity-55" : "opacity-0")
                  }
                />
                {isGuidVisible && (
                  <AnimateInBlock>
                    {/* 文字とボタンの配置管理するコンテナ */}
                    <div className="flex flex-col justify-center items-center h-[80vh] w-[80vw] z-20">
                      <div className="mb-16 z-10 text-6xl text-white whitespace-nowrap">
                        <p>How to Play</p>
                      </div>

                      <span className="mb-10 z-10 text-[1.6rem] text-center text-white ">
                        Drag on touchpad!
                      </span>

                      <span className="mt-5 mb-5 z-10 text-[1.2rem] leading-6 text-white whitespace-nowrap">
                        Try tapping the objects!
                      </span>
                      <span className="mb-5 z-10 text-[1.2rem] leading-6 text-white whitespace-nowrap">
                        You can find something interesting.
                      </span>
                    </div>
                  </AnimateInBlock>
                )}
              </>
            )}

            {/* PC, Tablet */}
            {isGuidOn && !isMobile && (
              <>
                {/* 背景 */}
                <div
                  className={
                    "absolute top-0 left-0 z-10 h-full w-full bg-black transition-all duration-300 " +
                    (isGuidVisible ? "opacity-55" : "opacity-0")
                  }
                />
                {isGuidVisible && (
                  <AnimateInBlock>
                    {/* 文字とボタンの配置管理するコンテナ */}
                    <div className="flex flex-col justify-center items-center h-[80vh] w-[80vw] z-20">
                      <div className="mb-5 z-10 text-2xl text-white whitespace-nowrap">
                        <p>How to Play</p>
                      </div>
                      <span className="mb-5 z-10 text-7xl text-white ">
                        (A W S D) or (← ↑ ↓ →)
                      </span>
                      <span className="mb-5 z-10 text-[1.2rem] leading-6 text-white whitespace-nowrap">
                        Try clicking obejests.
                      </span>
                      <span className="mb-5 z-10 text-[1.2rem] leading-6 text-white whitespace-nowrap">
                        You could find something interesting.
                      </span>
                    </div>
                  </AnimateInBlock>
                )}
              </>
            )}

            {/* Game Playing */}
            {!isGuidOn && (
              <>
                {/* Close Button */}
                {isOrbitControlMobile || (
                  <AnimateIn>
                    <Button
                      id="svg"
                      className="absolute mt-5 mr-5 top-[5%] right-[5%]"
                      onClick={() => activateOff()}
                    >
                      <IoMdCloseCircleOutline className="absolute top-[50%] left-[50%] h-12 w-12 z-20 text-white translate transform -translate-x-1/2 -translate-y-1/2 hover:cursor-pointer hover:text-gray-400 duration-200 rounded-full" />
                    </Button>
                  </AnimateIn>
                )}

                {/* OrbitControl Button */}
                {!isOrbitControlMobile && (
                  <AnimateIn>
                    <Button
                      id="svg"
                      className="absolute mt-5 ml-5 top-[4.5%] left-[5%]"
                      onClick={() => toggleOrbitControl()}
                    >
                      <MdOutlineCameraswitch className="absolute top-[50%] left-[50%] h-12 w-12 z-20 text-white translate transform -translate-x-1/2 -translate-y-1/2 hover:cursor-pointer hover:text-gray-400 duration-200 rounded-full" />
                    </Button>
                  </AnimateIn>
                )}

                {/* Home Button */}
                {!isPlayerFocused && !isNoneSelected && (
                  <Button onClick={handleHome}>
                    <div className="absolute flex justify-center items-center top-[75%] right-[50%] h-14 w-14 translate-x-1/2 -translate-y-1/2 bg-white border-4 border-t-purple-400 border-b-purple-400 rounded-full transform hover:cursor-pointe hover:bg-gray-300 duration-200">
                      <LuChevronDown className="h-10 w-10 text-gray-700 bounce-animation" />
                    </div>
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
