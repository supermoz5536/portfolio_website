import { useRef } from "react";
import { ContentBlock } from "./component/ContentBlock";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap/dist/gsap";
import { AnimateInBlock } from "~/components/animate_in_block";

export default function Panel1() {
  // const box1: any = useRef();
  // スコープを設定したい場合は
  // divタグにcontainerのrefを設定
  const container: any = useRef();

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.to(".myapp-icon-1", {
        x: 32,
        duration: 2.5,
        height: 16,
        width: 16,
        borderRadius: 8,
        rotate: 360,
      }); // <-- automatically reverted

      tl.to(".myapp-icon-1", {
        x: 0,
        duration: 5,
        height: 36,
        width: 36,
        borderRadius: 0,
        rotate: -360,
        ease: "power3",
      });
    },
    { scope: container },
  );

  useGSAP(
    () => {
      gsap.to(".myapp-icon-2", {
        delay: 0,
        duration: 2.5,
        rotate: -360,
        repeat: -1,
        repeatDelay: 4,
      });
    },
    { scope: container },
  );

  return (
    <>
      <div ref={container} className="text-black bg-white min-h-[100vh] h-auto w-full overflow-hidden">
        {/* Responsible Width-Max-Break */}
        <div className="xl:flex flex-row justify-between xl-3:justify-center">
          {/* Header */}
          <AnimateInBlock>
            <div className="hidden space-y-2 xl:block text-4xl my-sm:text-5xl xl-2:text-6xl mt-[7vh] ml-16 mr-6 font-archivo">
              <span className="block">Be</span>
              <span className="block">Super</span>
              <span className="block">Creative</span>
              <span id="line" className="block h-[0.5rem] my-sm:w-[14.75rem] xl-2:w-[18rem] mt-3 bg-black" />
            </div>
          </AnimateInBlock>

          {/* Responsible Width-Mid-Break */}
          <div className="my-md:flex flex-row justify-between my-lg:justify-around lg-2:justify-center my-2xl:justify-between">
            {/* Header & Content Container A */}
            <div>
              {/* Header */}
              <AnimateInBlock>
                <div className="text-4xl space-y-2 xl:text-white my-sm:text-5xl mt-[7vh] mb-24 ml-8 my-lg:ml-10 xl:hidden font-archivo">
                  <span className="block">Be</span>
                  <span className="block">Super</span>
                  <span className="block">Creative</span>
                  <span
                    id="line"
                    className="block  h-[0.5rem] w-[11.25rem] my-sm:w-[14.7rem] mt-3 bg-black"
                  />
                </div>
              </AnimateInBlock>
              {/* Content Container A */}
              <div className="mt-10 ml-8 my-lg:ml-10 lg-2:mr-12 xl:mt-[7vh] xl-3:ml-24 xl-3:mr-20 w-72">
                {/* Content 1 */}
                <ContentBlock
                  title="ChatBus"
                  subtitle="Exchange Learning with Random Chat"
                  medium="Web App"
                  number={1}
                />
                {/* Content 3 */}
                <ContentBlock
                  title="TraceSpeaker"
                  subtitle="YouTube Simultaneous Interpretation"
                  medium="Web App"
                  number={3}
                />
              </div>
            </div>

            {/* Header Header Place Holde0r & Content Container B */}
            <div>
              {/* Header Place Holder */}
              <div className="text-4xl xl:text-white hidden my-md:text-5xl my-md:block mt-[7vh] mb-24 ml-8 my-lg:ml-10 xl:hidden font-archivo">
                <br />
                <br />
                <br />
                <span className="block h-[0.5rem] w-[13rem] mt-3 bg-transparent" />
              </div>
              {/* Content Container B */}
              <div>
                <div className="mt-10 ml-8 mr-8 my-lg:mr-0 my-md:mt-10 xl:mt-[7vh] xl:mr-16 w-72">
                  {/* Content 2 */}
                  <ContentBlock
                    title="Inventory Z"
                    subtitle="Scraping Amazon to Fetch Inventory Data"
                    medium="Desktop"
                    number={2}
                  />

                  {/* Content 4 */}
                  <ContentBlock
                    title="The Gallery"
                    subtitle="Showcase of Artwork"
                    medium="Web App"
                    number={4}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
