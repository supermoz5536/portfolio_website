import { Effect } from "postprocessing";

const normalEffectFragmentShader = /* glsl */ `
    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      vec4 filterColor = vec4(1.0, 1.0, 1.0, 0.3);
      float blendRate = 0.0;
      outputColor = mix(inputColor, filterColor, blendRate); 
    }
`;

export class NormalEffect extends Effect {
  constructor() {
    super("normalEffect", normalEffectFragmentShader, {});
  }
}
