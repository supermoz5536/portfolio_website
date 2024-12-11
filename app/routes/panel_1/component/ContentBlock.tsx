import { tv } from "tailwind-variants";
import { SVGIcon3 } from "../svg/icon_3/SVGIcon3";
import { SVGIcon4 } from "../svg/icon_4/SVGIcon4";
import { useEffect, useState } from "react";
import { PopUpComponent } from "./popup/Popup";
import { AnimateIn } from "~/components/animate_in";
import { AnimateInBlock } from "~/components/animate_in_block";

type ContentBlockProps = {
  title: string;
  subtitle: string;
  body: string;
  number: 1 | 2 | 3 | 4;
};

// Tailwind Variants を使ったスタイル設定
const iconStyles = tv({
  base: "flex absolute h-10 w-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  variants: {
    number: {
      1: "myapp-icon-1 bg-black",
      2: "myapp-icon-2 bg-pink-500",
    },
  },
  defaultVariants: {
    number: 1,
  },
});

export const ContentBlock = ({
  title,
  subtitle,
  body,
  number,
}: ContentBlockProps) => {
  const [popupFlag, setPopupFlag] = useState<boolean>(false);

  return (
    <>
      {/* Content format */}
      <div>
        <AnimateIn>
          {/* Icon BG */}
          <div
            id="svg"
            className="flex relative h-16 w-16 rounded-full bg-gray-300"
          >
            {/* GSAPアニメーション */}
            {(number == 1 || number == 2) && (
              <div className={iconStyles({ number: number })}></div>
            )}
            {/* SVGアニメーション */}
            {number == 3 && <SVGIcon3 />}
            {number == 4 && <SVGIcon4 />}
          </div>
        </AnimateIn>
        <AnimateInBlock>
          {/* Content Title  */}
          <h2 className="text-2xl font-bold mt-4">{title}</h2>

          {/* Content Subtitle  */}
          <h3 className="text-base font-semibold mt-1">{subtitle}</h3>

          {/* Asset Image */}
          <div className="flex mt-6">
            <img
              className="w-80 h-auto shadow-lg cursor-pointer hover:bg-white hover:opacity-75 transition-all duration-300"
              src={`/asset/image/project0${number}.png`}
              alt="No Image"
              onClick={() => setPopupFlag(true)}
            ></img>
          </div>

          {/* Divider */}
          <div className="flex items-center mt-10 mb-20">
            <span className="text-xs">PROJECT 0{number} //</span>
            <span
              id="line"
              className="w-[225px] border-gray-500 border-b"
            ></span>
          </div>
        </AnimateInBlock>
      </div>

      <PopUpComponent
        viewFlag={popupFlag}
        setViewFlag={setPopupFlag}
        number={number}
      />
    </>
  );
};
