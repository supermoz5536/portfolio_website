import { BlendFunction, Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";

const hueSlideEffectFragmentShader = /* glsl */ `
    uniform float uTime;
    uniform bool uIsSkiped;

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      
      vec4 filterColor = vec4(1.0, 0.0, 0.0, 1.0);      
      float threshold = step(uTime * 0.1, uv.x);

      outputColor = mix(inputColor, filterColor, threshold);
    }
`;

export class HueSlideEffect extends Effect {
  constructor() {
    super("hueSlideEffect", hueSlideEffectFragmentShader, {
      blendFunction: BlendFunction.NORMAL,

      // uniforms
      uniforms: new Map<string, Uniform<any>>([
        ["uTime", new Uniform(0)],
        ["uIsSkiped", new Uniform(false)],
      ]),
    });
  }
}
