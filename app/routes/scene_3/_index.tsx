import { AnimateIn } from "../../components/animate_in";

export default function Scene3() {
  return (
    <>
      <div className="bg-red-700 h-[800px] w-full">
        <div className="text-2xl">
          <AnimateIn>
            <span className="block">ああああああああああああ</span>
            <span className="block">いいいいいいいいいいいい</span>
            <span className="block">うううううううううううう</span>
            <span className="block">ええええええええええええ</span>
          </AnimateIn>
        </div>
      </div>
    </>
  );
}
