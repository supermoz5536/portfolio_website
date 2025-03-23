import { BlendFunction, Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";

const whiteSlideEffectFragmentShader = /* glsl */ `
    uniform float uTime;
    uniform float uLoadedTime;
    uniform float uLoadFactor;

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

         vec3 color = vec3(1.0, 1.0, 1.0);
         float low = -0.5;
         float high = -0.3;
         float multiplyer = 0.25;

         low += ((uTime - uLoadedTime) - 0.02) * multiplyer * uLoadFactor;
         high += (pow((uTime - uLoadedTime) + 0.5, 2.0) - 0.25) * multiplyer * uLoadFactor; 
      
         float blend = min(1.0, smoothstep(low, high, uv.x));

         color = mix(inputColor.xyz, color, blend);

         outputColor = vec4(color, 1.0);
        }
`;

export class WhiteSlideEffect extends Effect {
  constructor() {
    super("whiteSlideEffect", whiteSlideEffectFragmentShader, {
      blendFunction: BlendFunction.NORMAL,

      // uniforms
      uniforms: new Map<string, Uniform<any>>([
        ["uTime", new Uniform(0)],
        ["uLoadedTime", new Uniform(0)],
        ["uLoadFactor", new Uniform(0)],
      ]),
    });
  }
}
