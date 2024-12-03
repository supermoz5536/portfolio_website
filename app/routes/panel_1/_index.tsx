import { useRef } from "react";
import { ContentBlock } from "./component/ContentBlock";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap/dist/gsap";

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

          {/* Header Header Place Holde0r & Content Container B */}
          <div>
            {/* Header Place Holder */}
            <div className="text-4xl xl:text-white hidden my-md:text-5xl my-md:block mt-[7vh] mb-24 ml-8 my-lg:ml-10 xl:hidden font-archivo">
              <br />
              <br />
              <br />
            </div>
            {/* Content Container B */}
            <div>
              <div className="mt-10 ml-8 mr-8 my-lg:mr-0 my-md:mt-10 xl:mt-[7vh] xl:mr-16 w-96">
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
    </div>
  );
}
