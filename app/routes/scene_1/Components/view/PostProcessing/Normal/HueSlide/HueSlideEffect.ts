import { BlendFunction, Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";

const hueSlideEffectFragmentShader = /* glsl */ `
    uniform float uTime;
    uniform float uSkippedTime;
    uniform bool uIsSkiped;

    // https://qiita.com/keim_at_si/items/c2d1afd6443f3040e900
    // このコードの中で、
    // fract(hsv.x + vec3(0,2,1)/3.)
    // が色相の小数部分を取り出す処理を行っています。
    // これにより、色相が1を超えても、
    // 0から1の範囲に収まるようになっています。
    vec3 hsv2rgb( vec3 hsv ) {
        return ((clamp(abs(fract(hsv.x+vec3(0,2,1)/3.)*6.-3.)-1.,0.,1.)-1.)*hsv.y+1.)*hsv.z;
    }

    // https://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
    float random(vec2 p) {
        return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {


         vec3 color = hsv2rgb(
             vec3(
             -vUv.x * 0.2 + 0.3 + uTime * 0.1 + random( gl_FragCoord.xy * 0.01 ) * 0.02,
             0.95,
             1.0
             )
         );

         if (uIsSkiped) {
            color += (uTime - uSkippedTime) * 1.5;
         }

         outputColor = vec4( color, 1.0 );
        
        }
`;

export class HueSlideEffect extends Effect {
  constructor() {
    super("hueSlideEffect", hueSlideEffectFragmentShader, {
      blendFunction: BlendFunction.NORMAL,

      // uniforms
      uniforms: new Map<string, Uniform<any>>([
        ["uTime", new Uniform(0)],
        ["uSkippedTime", new Uniform(0)],
        ["uIsSkiped", new Uniform(false)],
      ]),
    });
  }
}
