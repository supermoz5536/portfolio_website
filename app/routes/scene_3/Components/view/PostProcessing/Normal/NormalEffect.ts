import { BlendFunction, Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";

const normalEffectFragmentShader = /* glsl */ `
    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      outputColor = inputColor; 
    }
`;

export class NormalEffect extends Effect {
  constructor() {
    super("normalEffect", normalEffectFragmentShader, {
      blendFunction: BlendFunction.ALPHA,
    });
  }
}
