import { cli } from "@remix-run/dev";
import { BlendFunction, Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";

// Sobelフィルタ用に解像度を uniform として送る
const outlineEffectFragmentShader = /* glsl */ `
    uniform vec2 texelSize;
    uniform float scrollProgress;

    void mainUv(inout vec2 uv) {
        // 何も書かなくてもOK。UVをいじるならここ。
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    
        // solbeフィルタリング用のカーネル用の座標を選出    
        // vec4 c00 = texture2D(inputBuffer, uv + vec2(-texelSize.x, -texelSize.y));
        vec4 c01 = texture2D(inputBuffer, uv + vec2(         0.0, -texelSize.y));
        // vec4 c02 = texture2D(inputBuffer, uv + vec2(+texelSize.x, -texelSize.y));

        vec4 c10 = texture2D(inputBuffer, uv + vec2(-texelSize.x, 0.0));
        // vec4 c11 = texture2D(inputBuffer, uv + vec2(         0.0, 0.0));
        vec4 c12 = texture2D(inputBuffer, uv + vec2(+texelSize.x, 0.0));

        // vec4 c20 = texture2D(inputBuffer, uv + vec2(-texelSize.x, +texelSize.y));
        vec4 c21 = texture2D(inputBuffer, uv + vec2(         0.0, +texelSize.y));
        // vec4 c22 = texture2D(inputBuffer, uv + vec2(+texelSize.x, +texelSize.y));


        // float i00 = dot(c00.rgb, vec3(0.299, 0.587, 0.114));
        float i01 = dot(c01.rgb, vec3(0.299, 0.587, 0.114));
        // float i02 = dot(c02.rgb, vec3(0.299, 0.587, 0.114));
        
        float i10 = dot(c10.rgb, vec3(0.299, 0.587, 0.114));
        // float i11 = dot(c11.rgb, vec3(0.299, 0.587, 0.114));
        float i12 = dot(c12.rgb, vec3(0.299, 0.587, 0.114));

        // float i20 = dot(c20.rgb, vec3(0.299, 0.587, 0.114));
        float i21 = dot(c21.rgb, vec3(0.299, 0.587, 0.114));
        // float i22 = dot(c22.rgb, vec3(0.299, 0.587, 0.114));


        float Gx = (2.0 * i10) - (2.0 * i12);
        float Gy = (2.0 * i01) - (2.0 * i21);

        float edge = sqrt(Gx * Gx + Gy * Gy);

        float strength = 1.2;

          // 輪郭を黒、背景を白
        float sobel = 1.0 - clamp(edge * strength, 0.0, 0.4);

        float clipRate;

        if (scrollProgress < 0.235) {
          clipRate = 100.0;
         } else {
          clipRate = (1.0 - (scrollProgress - 0.235) / 0.235) * 100.0;
         }
         

        float t = step(clipRate / 100.0, 1.0 - uv.y);
        

        vec4 color = mix(vec4(vec3(sobel), 1.0), inputColor, t);

        outputColor = color;

        // // 1回のテクスチャフェッチでグレースケール値を計算
        // float gray = dot(texture2D(inputBuffer, uv).rgb, vec3(0.299, 0.587, 0.114));

        // // 微分関数を使って輝度の変化を検出
        // float dx = dFdx(gray);
        // float dy = dFdy(gray);
        // float edge = sqrt(dx * dx + dy * dy);

        // float strength = 5.0;
        // // エッジ部分を黒、背景を白にする
        // float sobel = 1.0 - clamp(edge * strength, 0.0, 1.0);

        // outputColor = vec4(vec3(sobel), 1.0);
    }
`;

export class OutLineEffect extends Effect {
  constructor(props: { x: number; y: number; scrollProgress: number }) {
    super("outlineEffect", outlineEffectFragmentShader, {
      blendFunction: BlendFunction.LIGHTEN,

      // uniforms
      uniforms: new Map<string, Uniform<any>>([
        ["texelSize", new Uniform(new Vector2(1 / props.x, 1 / props.y))],
        ["scrollProgress", new Uniform(props.scrollProgress)],
      ]),
    });
  }
}
