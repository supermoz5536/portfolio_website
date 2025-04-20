import { BlendFunction, Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";

const wABEffectFragmentShader = /* glsl */ `
    uniform float uScrollRatio;

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

      /**
       * Brightness
       */
   
       float brightness = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
       float brighterIntensity = 0.35;
       float weight = 1.0 - brightness;
   
       brightness += weight * brighterIntensity;
   
      /**
       * Filter
       */
   
       vec4 filterColor = vec4(vec3(brightness), 1.0);
   
      /**
       * Alpha
       */
   
       float speed = 10.0;
       float blend = clamp(uScrollRatio * speed, 0.0, 1.0);
   
      /**
       * Output
       */
      
      outputColor = mix(filterColor, inputColor, blend);      

    }
`;

export class WABEffect extends Effect {
  constructor() {
    super("wABEffect", wABEffectFragmentShader, {
      blendFunction: BlendFunction.NORMAL,

      // uniforms
      uniforms: new Map<string, Uniform<any>>([
        ["uScrollRatio", new Uniform(0)],
      ]),
    });
  }
}
