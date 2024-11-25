import { useRef } from "react";
import { ContentBlock } from "./component/ContentBlock";
import { setupAnimation } from "./gsap_setup";

export default function Panel1() {
  // const box1: any = useRef();
  // スコープを設定したい場合は
  // divタグにcontainerのrefを設定
  const container: any = useRef();

  setupAnimation({ container: container });

  return (
    <div
      ref={container}
      className="text-black bg-white min-h-[100vh]  h-auto w-full "
    >
      {/* Responsible Width-Max-Break */}
      <div className="xl:flex flex-row justify-between xl-3:justify-center">
        {/* Header */}
        <div className="hidden xl:block text-4xl my-sm:text-5xl xl-2:text-6xl mt-[7vh] ml-16 mr-6 font-archivo">
          Be <br />
          Super <br />
          <div className="underline underline-offset-[20px] decoration-[6px]">
            Creative
          </div>
        </div>

        {/* Responsible Width-Mid-Break */}
        <div className="my-md:flex flex-row justify-between my-lg:justify-around lg-2:justify-center my-2xl:justify-between">
          {/* Header & Content Container A */}
          <div>
            {/* Header */}
            <div className="text-4xl xl:text-white my-sm:text-5xl mt-[7vh] mb-24 ml-8 my-lg:ml-10 xl:hidden font-archivo">
              Be <br />
              Super <br />
              <div className="underline underline-offset-[20px] decoration-[6px]">
                Creative
              </div>
            </div>
            {/* Content Container A */}
            <div className="mt-10 ml-8 my-lg:ml-10 lg-2:mr-12 xl:mt-[7vh] xl-3:ml-24 xl-3:mr-20 w-96">
              {/* Content 1 */}
              <ContentBlock
                title="Title Cotent-1"
                subtitle="Subtitle Content-1"
                body="body"
                number={1}
              />
              {/* Content 2 */}
              <ContentBlock
                title="Title Cotent-2"
                subtitle="Subtitle Content-2"
                body="body"
                number={2}
              />
            </div>
          </div>

          {/* Content Container B */}
          <div>
            <div className="mt-10 ml-8 mr-8 my-lg:mr-0 my-md:mt-80 xl:mt-[7vh] xl:mr-16 w-96">
              {/* Content 3 */}
              <ContentBlock
                title="Title Cotent-3"
                subtitle="Subtitle Content-3"
                body="body"
                number={3}
              />

              {/* Content 4 */}
              <ContentBlock
                title="Title Cotent-4"
                subtitle="Subtitle Content-4"
                body="body"
                number={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
