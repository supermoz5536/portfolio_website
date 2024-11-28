import { useLoaderData } from "@remix-run/react";

type PopupLayerProps = {
  viewFlag: boolean;
  number: number;
};

export const PopupLayer1 = (props: PopupLayerProps) => {
  const { viewFlag, number } = props;
  const { downloadUrlArray }: any = useLoaderData();
  const FallbackLink = `zhttps://firebasestorage.googleapis.com/v0/b/portfolio-website-4645b.firebasestorage.app/o/system%2Fvideo%2Fcontent_block%1F${number}.mp4?alt=media`;

  return (
    <div className="absolute z-30 flex flex-row h-full w-full">
      {/* 1列目 */}
      <div className="flex flex-col h-ful w-1/2">
        {/* ConentBlock1 (左上) */}
        <div className="h-1/2 w-full bg-gray-200">
          <video
            controls
            className="object-fill h-full w-full bg-gray-200"
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
        <div className="h-1/2 w-full bg-transparent"></div>
      </div>
      {/* 2列目 */}
      <div className="flex flex-col h-ful w-1/2">
        {/* ConentBlock3 (右上) */}
        <div className="h-1/2 w-full bg-transparent"></div>

        {/* ConentBlock4 (右下) */}
        <div className="flex justify-center items-center h-1/2 w-full bg-gray-200">
          {/* 内枠 */}
          <div
            className="flex flex-col justify-between h-[90%] w-[90%]"
            style={{
              animation: viewFlag
                ? "fade-custom-video 4.5s cubic-bezier(.65, -0.06, .23, 1.12) forwards"
                : "",
            }}
          >
            {/* 説明 */}
            <div>
              <div>
                現在は専業のSEOライター・ディレクターとして、独立しております。また、YouTube台本ライターとしても活動しています。金融・就職・マーケティングをメインのジャンルとして活動中です。
              </div>
              <br />
              <div>
                営業・マーケティング・採用支援会社と業務委託契約。
                ライターとして、メディア運営やSEOライティング、セールスライティングを担当しています。
              </div>
              <br />
              <>
                大学4年生のときからメディア事業を開始し、アフィリエイトなどをおこなっていました。
                現在もSEOライターやディレクターとして活動しています。
              </>
              <br />
              <div>
                大学4年から個人事業主として活動し、2019年から本格的に就職活動に関するメディア運営を開始しました。
              </div>
            </div>

            {/* 使用技術 */}
            <div>使用技術: Flutter Web, Firebase, Youtube</div>
          </div>
        </div>
      </div>
    </div>
  );
};
