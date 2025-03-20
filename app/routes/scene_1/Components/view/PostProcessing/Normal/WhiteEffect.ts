import { BlendFunction, Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";

const whiteEffectFragmentShader = /* glsl */ `
    uniform float scrollProgress;

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      
      vec4 filterColor = vec4(1.0, 1.0, 1.0, 1.0);      
      float threshold = step(scrollProgress, uv.x);

      outputColor = mix(inputColor, filterColor, threshold);
    }
`;

export class WhiteEffect extends Effect {
  constructor(props: { scrollProgress: number }) {
    super("whiteEffect", whiteEffectFragmentShader, {
      blendFunction: BlendFunction.NORMAL,

      // uniforms
      uniforms: new Map<string, Uniform<any>>([
        ["scrollProgress", new Uniform(props.scrollProgress)],
      ]),
    });
  }
}
