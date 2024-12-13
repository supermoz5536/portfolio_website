import { AnimateIn } from "~/components/animate_in";
import "./Popup_layer.css";
import { useLoaderData } from "@remix-run/react";
import { MdScreenRotation } from "react-icons/md";
import { useEffect, useState } from "react";

type PopupLayerProps = {
  viewFlag: boolean;
  number: number;
  height: number;
  width: number;
};

export const PopupLayer2 = (props: PopupLayerProps) => {
  const { viewFlag, number } = props;
  const { downloadUrlArray }: any = useLoaderData();
  const FallbackLink = `zhttps://firebasestorage.googleapis.com/v0/b/portfolio-website-4645b.firebasestorage.app/o/system%2Fvideo%2Fcontent_block%1F${number}.mp4?alt=media`;
  const [isResized, setIsResized] = useState<boolean>();

  useEffect(() => {
    setIsResized((prev) => !prev);
  }, [props.height, props.width]);

  return (
    <>
      {/* デスクトップの場合 or タブレットの場合*/}
      {typeof window != "undefined"
        ? window.innerWidth > 500 && (
            <>
              <div className="absolute top-0 left-1/2 z-30 h-1/2 w-1/2 bg-gray-200">
                {/* ConentBlock1 (右上) */}
                <video
                  controls
                  className="object-fill h-full w-full"
                  style={{
                    animation: viewFlag
                      ? "fade-custom-video 4.5s cubic-bezier(.65, -0.06, .23, 1.12) forwards"
                      : "",
                  }}
                >
                  <source src={downloadUrlArray[number - 1]} type="video/mp4" />
                  <a href={FallbackLink}></a>
                </video>
              </div>

              {/* ConentBlock2 (左下) */}
              <div className="absolute top-1/2 left-0 z-30 flex justify-center items-center h-1/2 w-1/2 overflow-y-auto bg-blue-400 popup-layer-1-scroll-a">
                {/* 背景画像 */}
                <div
                  className="absolute top-0 left-0 h-full w-full"
                  style={{
                    backgroundImage: `url(
                  "asset/image/project0${number}.png")`,
                    backgroundSize: "cover", // 背景画像をカバー
                    backgroundPosition: "center", // 背景画像を中央配置
                    backgroundRepeat: "no-repeat", // 背景画像の繰り返しを無効化
                    animation: viewFlag
                      ? "fade-custom-bg-img 4.5s cubic-bezier(.65, -0.06, .23, 1.12) forwards"
                      : "",
                  }}
                ></div>
                {/* 内枠 */}
                <div
                  className="flex flex-col justify-between mt-10 mb-10 h-[90%] w-[90%]"
                  style={{
                    animation: viewFlag
                      ? "fade-custom-video 4.5s cubic-bezier(.65, -0.06, .23, 1.12) forwards"
                      : "",
                  }}
                >
                  {/* 説明 */}
                  <AnimateIn>
                    <div>
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Inventory Z is a desktop application specialized in
                        inventory management for Amazon import businesses and
                        retail arbitrage, known as "Sedori" in Japan.
                      </p>
                      <br />
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Simply register the product's ASIN code, and it will
                        automatically track daily fluctuations in "accurate"
                        inventory levels.
                      </p>
                      <br />
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Inventory Z retrieves data for each ASIN with meticulous
                        attention to detail. Compared to industry-standard tools
                        like Keepa, which prioritize large-scale efficiency, it
                        offers higher reliability in data acquisition.
                      </p>
                      <br />
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Trustworthy and accurate numbers maximize the potential
                        of your business.
                        <br />
                        <br />
                        Inventory Z: <br />
                        <a
                          className="cursor-pointer hover:text-gray-300 transform duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                          href="http://inventoryz.apple-pepper.net/"
                        >
                          http://inventoryz.apple-pepper.net
                        </a>
                        <br />
                        <br />
                        Tech Stack: <br />
                        React, Electron, Firebase, Stripe API
                        <br />
                        <br />
                      </p>
                    </div>
                  </AnimateIn>
                </div>
              </div>
            </>
          )
        : null}

      {typeof window != "undefined"
        ? window.innerWidth < 500 && (
            <>
              {/* モバイルの場合 */}
              <div className="absolute top-0 left-0 z-30 h-1/3 w-full bg-gray-200">
                {/* ConentBlock1 (左上) */}
                <video
                  controls
                  className="object-fill h-full w-full"
                  style={{
                    animation: viewFlag
                      ? "fade-custom-video 4.5s cubic-bezier(.65, -0.06, .23, 1.12) forwards"
                      : "",
                  }}
                >
                  <source src={downloadUrlArray[number - 1]} type="video/mp4" />
                  <a href={FallbackLink}></a>
                </video>
              </div>
              {/* ConentBlock2 (右下) */}
              <div className="absolute top-1/3 left-0 z-30 flex justify-center items-center h-2/3 w-full overflow-y-auto bg-blue-400 popup-layer-1-scroll-a">
                {/* 背景画像 */}
                <div
                  className="absolute top-0 left-0 h-full w-full"
                  style={{
                    backgroundImage: `url(
                  "asset/image/project0${number}.png")`,
                    backgroundSize: "cover", // 背景画像をカバー
                    backgroundPosition: "center", // 背景画像を中央配置
                    backgroundRepeat: "no-repeat", // 背景画像の繰り返しを無効化
                    animation: viewFlag
                      ? "fade-custom-bg-img 4.5s cubic-bezier(.65, -0.06, .23, 1.12) forwards"
                      : "",
                  }}
                ></div>
                {/* 内枠 */}
                <div
                  className="flex flex-col justify-between mt-10 mb-10 h-[90%] w-[90%]"
                  style={{
                    animation: viewFlag
                      ? "fade-custom-video 4.5s cubic-bezier(.65, -0.06, .23, 1.12) forwards"
                      : "",
                  }}
                >
                  {/* 説明 */}
                  <AnimateIn>
                    <div
                      id="fade-in-bottom"
                      className="inline-flex justify-center items-center  text-gray-50 text-1xl font-normal"
                    >
                      -&nbsp;Try landscape mode!&nbsp;-&nbsp;
                      <MdScreenRotation className="h-[20px] w-[20px]" />
                    </div>
                    <p>
                      <br />
                    </p>
                    <div>
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Inventory Z is a desktop application specialized in
                        inventory management for Amazon import businesses and
                        retail arbitrage, known as "Sedori" in Japan.
                      </p>
                      <br />
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Simply register the product's ASIN code, and it will
                        automatically track daily fluctuations in "accurate"
                        inventory levels.
                      </p>
                      <br />
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Inventory Z retrieves data for each ASIN with meticulous
                        attention to detail. Compared to industry-standard tools
                        like Keepa, which prioritize large-scale efficiency, it
                        offers higher reliability in data acquisition.
                      </p>
                      <br />
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Trustworthy and accurate numbers maximize the potential
                        of your business.
                        <br />
                        <br />
                        Inventory Z: <br />
                        <a
                          className="cursor-pointer hover:text-gray-300 transform duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                          href="http://inventoryz.apple-pepper.net/"
                        >
                          http://inventoryz.apple-pepper.net
                        </a>
                        <br />
                        <br />
                        Tech Stack: <br />
                        React, Electron, Firebase, Stripe API
                        <br />
                        <br />
                      </p>
                    </div>
                  </AnimateIn>
                </div>
              </div>
            </>
          )
        : null}
    </>
  );
};
