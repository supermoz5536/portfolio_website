import "./Popup_layer.css";
import { useLoaderData } from "@remix-run/react";

type PopupLayerProps = {
  viewFlag: boolean;
  number: number;
};

export const PopupLayer3 = (props: PopupLayerProps) => {
  const { viewFlag, number } = props;
  const { downloadUrlArray }: any = useLoaderData();
  const FallbackLink = `zhttps://firebasestorage.googleapis.com/v0/b/portfolio-website-4645b.firebasestorage.app/o/system%2Fvideo%2Fcontent_block%1F${number}.mp4?alt=media`;

  return (
    <>
      {/* デスクトップの場合 or タブレットの場合*/}
      {typeof window != "undefined"
        ? window.innerWidth > 768 && (
            <>
              <div className="absolute top-1/2 left-0 z-30 h-1/2 w-1/2 bg-gray-200">
                {/* ConentBlock1 (左下) */}
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

              {/* ConentBlock2 (右上) */}
              <div className="absolute top-0 left-1/2 z-30 flex justify-center items-center h-1/2 w-1/2 overflow-y-auto bg-blue-400 popup-layer-1-scroll-a">
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
                  <div>
                    <div className="text-gray-50 text-xl font-normal">
                      昔々あるところに、小さな山里がありました。その村には、心優しいおばあさんと、一匹の白い狐が住んでいました。おばあさんは狐を家族のように可愛がり、狐もおばあさんを守るように寄り添っていました。
                    </div>
                    <br />
                    <div className="text-gray-50 text-xl font-normal">
                      ある日、村に大きな嵐が襲い、川が氾濫して橋が壊れてしまいました。村人たちは困り果てましたが、狐が不思議な力で橋を修復しました。その光景に村人たちは感謝し、狐を守り神として祀ることにしました。
                    </div>
                    <br />
                    <div className="text-gray-50 text-xl font-normal">
                      その後も、狐は村の平和を見守り続けました。しかし、ある満月の夜、狐はおばあさんに別れを告げ、静かに森の奥へ帰っていきました。村人たちはその後も狐への感謝を忘れず、祭りを開きました。
                    </div>
                    <br />
                    <div className="text-gray-50 text-xl font-normal">
                      そして今でも、その村では満月の夜に白い狐の姿が見えると言い伝えられています。それは、おばあさんと村を愛した狐の魂が村を守っているからだと信じられているのです。
                    </div>
                  </div>

                  {/* 使用技術 */}
                  <div className="text-gray-50 text-xl font-normal mt-10">
                    使用技術： <br />
                    Flutter Web, Firebase, Youtube
                  </div>
                </div>
              </div>
            </>
          )
        : null}

      {typeof window != "undefined"
        ? window.innerWidth < 768 && (
            <>
              {/* モバイルの場合 */}
              <div className="absolute top-1/2 left-0 z-30 h-1/2 w-full bg-gray-200">
                {/* ConentBlock1 (左下) */}
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
              {/* ConentBlock2 (右上) */}
              <div className="absolute top-0 left-0 z-30 flex justify-center items-center h-1/2 w-full overflow-y-auto bg-blue-400 popup-layer-1-scroll-a">
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
                  <div>
                    <div className="text-gray-50 text-xl font-normal">
                      現在は専業のSEOライター・ディレクターとして、独立しております。また、YouTube台本ライターとしても活動しています。金融・就職・マーケティングをメインのジャンルとして活動中です。
                    </div>
                    <br />
                    <div className="text-gray-50 text-xl font-normal">
                      営業・マーケティング・採用支援会社と業務委託契約。
                      ライターとして、メディア運営やSEOライティング、セールスライティングを担当しています。
                    </div>
                    <br />
                    <div className="text-gray-50 text-xl font-normal">
                      大学4年生のときからメディア事業を開始し、アフィリエイトなどをおこなっていました。
                      現在もSEOライターやディレクターとして活動しています。
                    </div>
                    <br />
                    <div className="text-gray-50 text-xl font-normal">
                      大学4年から個人事業主として活動し、2019年から本格的に就職活動に関するメディア運営を開始しました。
                    </div>
                  </div>

                  {/* 使用技術 */}
                  <div className="text-gray-50 text-xl font-normal mt-10">
                    使用技術： <br />
                    Flutter Web, Firebase, Youtube
                  </div>
                </div>
              </div>
            </>
          )
        : null}
    </>
  );
};
