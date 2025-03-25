import { useEffect, useRef, useState } from "react";
type ShowSubtitle = {
  parentVisiblity: boolean;
  onSkip: () => void;
};

export function SkipButton({ parentVisiblity, onSkip }: ShowSubtitle) {
  const buttonRef = useRef<any>();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutVisible = setTimeout(() => setIsVisible(true), 1500);
    const timeoutInvisible = setTimeout(() => setIsVisible(false), 19500);
    const timeoutRemove = setTimeout(() => {
      if (buttonRef.current) buttonRef.current.style.display = "none";
    }, 18000);

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
          "absolute top-[90%] left-[90%] -translate-x-1/2 -translate-y-1/2 h-10 w-16 text-black outline transition-opacity " +
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
