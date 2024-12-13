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

export const PopupLayer4 = (props: PopupLayerProps) => {
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
        ? window.innerWidth > 768 && (
            <>
              <div className="absolute top-1/2 left-1/2 z-30 h-1/2 w-1/2 bg-gray-200">
                {/* ConentBlock1 (右下) */}
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

              {/* ConentBlock2 (左上) */}
              <div className="absolute top-0 left-0 z-30 flex justify-center items-center h-1/2 w-1/2 overflow-y-auto bg-blue-400 popup-layer-1-scroll-a">
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
                  <AnimateIn rootMarginBottom={-70}>
                    <div>
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias facere earum sapiente, nulla vero tenetur?
                      </p>
                      <br />
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Aliquid, molestiae quisquam maxime error quae
                        adipisci.
                      </p>
                      <br />
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Exercitationem deserunt distinctio nostrum, maiores
                        perspiciatis dignissimos.
                      </p>
                      <br />
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Lorem ipsum dolor sit amet consectetur adipisicing.
                        <br />
                        <br />
                        TraceSpeaker: <br />
                        <a
                          className="cursor-pointer hover:text-gray-300 transform duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://trace-speaker-app-ja.apple-pepper.net"
                        >
                          https://trace-speaker-app-ja.apple-pepper.net
                        </a>
                        <br />
                        <br />
                        Tech Stack: <br />
                        Flutter Web, Firebase, Python
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
        ? window.innerWidth < 768 && (
            <>
              {/* モバイルの場合 */}
              <div className="absolute top-0 left-0 z-30 h-1/3 w-full bg-gray-200">
                {/* ConentBlock1 (下) */}
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
              {/* ConentBlock2 (上) */}
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
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias facere earum sapiente, nulla vero tenetur?
                      </p>
                      <br />
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Aliquid, molestiae quisquam maxime error quae
                        adipisci.
                      </p>
                      <br />
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Exercitationem deserunt distinctio nostrum, maiores
                        perspiciatis dignissimos.
                      </p>
                      <br />
                      <p
                        id="fade-in-bottom"
                        className="text-gray-50 text-xl font-normal"
                      >
                        Lorem ipsum dolor sit amet consectetur adipisicing.
                        <br />
                        <br />
                        TraceSpeaker: <br />
                        <a
                          className="cursor-pointer hover:text-gray-300 transform duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://trace-speaker-app-ja.apple-pepper.net"
                        >
                          https://trace-speaker-app-ja.apple-pepper.net
                        </a>
                        <br />
                        <br />
                        Tech Stack: <br />
                        Flutter Web, Firebase, Python
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
