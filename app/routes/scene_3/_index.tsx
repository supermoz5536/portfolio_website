import { AnimateInSection } from "~/components/animate_in_section";
import { AnimateIn } from "../../components/animate_in";

export default function Scene3() {
  return (
    <>
      <div className="bg-red-700 h-[800px] w-full">
        <div className="text-2xl">
          <AnimateInSection>
            <span className="block">ああああああああああああ</span>
            <span id="2" className="block">
              いいいいいいいいいいいい
            </span>
            <span className="block">うううううううううううう</span>
            <span className="block">ええええええええええええ</span>
          </AnimateInSection>
          {/* <br />
          <span className="block">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur,
            consequatur?
          </span>
          <br />
          <span className="block">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur,
            consequatur?
          </span>
          <br />
          <span className="block">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur,
            consequatur?
          </span>
          <br /> */}
        </div>
      </div>
    </>
  );
}
