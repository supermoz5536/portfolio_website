import { useEffect, useRef, useState } from "react";
type ShowSubtitle = {
  inputText: string;
  startTime: number;
  parentVisiblity: boolean;
};

export function Subtitle({
  inputText,
  startTime,
  parentVisiblity,
}: ShowSubtitle) {
  let timeProgress = 0;
  let fixedTextCount = 0;
  let currentTime: number;
  let tempText;
  const inputTextCount = inputText.length;
  const duration = 3000;
  const randomText = "*`~^=-&%$#?*_}<>_~?   ";

  const [outputText, setOutputText] = useState<string>();
  const [isVisible, setIsVisible] = useState(true);

  const textRef = useRef<any>();

  useEffect(() => {
    const timeoutOpacity = setTimeout(() => {
      setIsVisible(false);
    }, 3500);

    const timeoutRemove = setTimeout(() => {
      textRef.current.style.display = "none";
    }, 4500);

    const interval = setInterval(() => {
      tempText = "";
      currentTime = new Date().getTime();

      timeProgress = ((currentTime - startTime) / duration) * 2.0; // [0 - 1]

      fixedTextCount = Math.min(
        inputTextCount,
        Math.floor(inputTextCount * timeProgress),
      );

      for (let i = 0; i < fixedTextCount; i++) {
        tempText += inputText[i];
      }

      // ランダム演出は2文字
      const restTextCount = Math.min(2, inputTextCount - fixedTextCount);

      for (let i = 0; i < restTextCount; i++) {
        tempText += randomText[Math.floor(randomText.length * Math.random())];
      }

      setOutputText(tempText);
    }, 5.0); // ms

    return () => {
      clearTimeout(timeoutOpacity);
      clearTimeout(timeoutRemove);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setIsVisible(parentVisiblity);
  }, [parentVisiblity]);

  return (
    <span
      ref={textRef}
      className={
        "text-3xl text-white duration-1000 " +
        (isVisible ? "opacity-100" : "opacity-0")
      }
    >
      {outputText}
    </span>
  );
}
