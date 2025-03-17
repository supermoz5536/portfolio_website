import { BlendFunction, Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";

const normalEffectFragmentShader = /* glsl */ `
    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      vec4 filterColor = vec4(0.0, 0.0, 0.0, 0.4);
      outputColor = filterColor; 
    }
`;

export class NormalEffect extends Effect {
  constructor() {
    super("normalEffect", normalEffectFragmentShader, {
      blendFunction: BlendFunction.ALPHA,
      // blendFunction: BlendFunction.SATURATION,
    });
  }
}
