import { OutLineEffect } from "./OutlineEffect";

export function OutLineCustom() {
  const OutlineEffect = new OutLineEffect({
    x: window.innerWidth,
    y: window.innerHeight,
  });

  return (
    <>
      <primitive object={OutlineEffect} />
    </>
  );
}
