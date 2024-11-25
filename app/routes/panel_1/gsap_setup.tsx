import { useGSAP } from "@gsap/react";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

/// GSAPのセットアップ用の関数
/// useGSAPはReactのライフサイクルに依存して動作するフックです。
/// そのため、関数自体が値をreturnしなくても正しく適用されます。
export const setupAnimation = ({ container }: any) => {
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
};
