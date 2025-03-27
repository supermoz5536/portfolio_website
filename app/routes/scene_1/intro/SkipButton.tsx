import { useEffect, useRef, useState } from "react";
import { useGlobalStore } from "~/store/global/global_store";
type ShowSubtitle = {
  parentVisiblity: boolean;
  onSkip: () => void;
};

export function SkipButton({ parentVisiblity, onSkip }: ShowSubtitle) {
  const buttonRef = useRef<any>();
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useGlobalStore((state) => state.isMobile);

  useEffect(() => {
    const timeoutVisible = setTimeout(() => setIsVisible(true), 1500);
    const timeoutInvisible = setTimeout(() => setIsVisible(false), 19500);
    const timeoutRemove = setTimeout(() => {
      if (buttonRef.current) buttonRef.current.style.display = "none";
    }, 20500);

    return () => {
      clearTimeout(timeoutVisible);
      clearTimeout(timeoutInvisible);
      clearTimeout(timeoutRemove);
    };
  }, []);

  useEffect(() => {
    if (!parentVisiblity) setIsVisible(parentVisiblity);
  }, [parentVisiblity]);

  return (
    <>
      <button
        ref={buttonRef}
        className={
          "absolute h-10 w-16 text-gray-600 outline transition-opacity " +
          (isMobile //
            ? "top-[75%] right-[15%] "
            : "top-[85%] right-[10%] ") +
          (isVisible
            ? "duration-[3000ms] opacity-100"
            : "duration-[1000ms] opacity-0")
        }
        onClick={() => onSkip()}
      >
        Skip
      </button>
    </>
  );
}
