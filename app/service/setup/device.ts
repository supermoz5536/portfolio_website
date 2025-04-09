import { useEffect } from "react";
import { useGlobalStore } from "~/store/global/global_store";

export function setupDevice() {
  const setIsMobile = useGlobalStore((state: any) => state.setIsMobile);
  const setIsLandscape = useGlobalStore((state: any) => state.setIsLandscape);

  useEffect(() => {
    if (/iPhone|Android.+Mobile/.test(navigator.userAgent)) {
      setIsMobile(true);
    }

    if (window.matchMedia("(orientation: landscape)").matches) {
      setIsLandscape(true);
    }

    // Callback
    const resizeCallback = () => {
      if (window.matchMedia("(orientation: landscape)").matches) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }

      if (/iPhone|Android.+Mobile/.test(navigator.userAgent)) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Listener
    window.addEventListener("resize", resizeCallback);

    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);
}
