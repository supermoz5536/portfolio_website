import { BlendFunction, Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";

const whiteSlideEffectFragmentShader = /* glsl */ `
    precision lowp float;

    uniform float uTime;
    uniform float uLoadedTime;
    uniform float uLoadFactor;

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

         vec3 color = vec3(1.0, 1.0, 1.0);
         float low = -0.65;
         float high = -0.6;
         float multiplyer = 0.15;
         float elapsedTime = uTime - uLoadedTime;
         

         low += elapsedTime * multiplyer * uLoadFactor;
         high += (elapsedTime) * (elapsedTime) * multiplyer * uLoadFactor; 
      
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
