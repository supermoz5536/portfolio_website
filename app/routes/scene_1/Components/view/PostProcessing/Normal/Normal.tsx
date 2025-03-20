import { NormalEffect } from "./NormalEffect";

export function NormalCustom() {
  const normalEffect = new NormalEffect();

  return (
    <>
      <primitive object={normalEffect} />
    </>
  );
}
