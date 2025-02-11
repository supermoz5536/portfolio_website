// 円周率の定義（コサイン補間で使用）
float Math_PI = 3.141592653589793238462643383279502884197;

uniform float uTime;
uniform float maxIntensity;

varying vec2 vUv;
varying vec3 vModelPosition;
varying vec3 vNormal;


void main() {

    /*
    * Periodic Alpha Intensity
    */

    float fadeTime1st = 1.75;
    float waitTime1st = 2.5;
    float fadeTime2nd = 1.75;
    float waitTime2nd = 0.5;

    // サイクル全体の時間：フェードイン＋待機＋フェードアウト＋待機
    float cycleTime = fadeTime1st + waitTime1st + fadeTime2nd + waitTime2nd;

    // uTime を周期内の相対時刻に変換
    float t = mod(uTime, cycleTime);

    float periodicIntensity = 0.0;
    if(t < fadeTime1st) {
        // [0, fadeTime] : フェードイン（0 から 1 へ）
        float progress = t / fadeTime1st;
        // コサイン補間
        // progress=0 のとき cos(0)=1 → 0.5*(1-1)=0、
        // progress=1 のとき cos(PI)=-1 → 0.5*(1-(-1))=1
        periodicIntensity = (0.5 * (1.0 - cos(progress * Math_PI))) * maxIntensity;

    } else if(t < fadeTime1st + waitTime1st) {
        // [fadeTime1st, fadeTime1st + waitTime1st] : alpha = 1 で待機
        periodicIntensity = maxIntensity;

    } else if(t < (fadeTime1st + waitTime1st) + fadeTime2nd) {
        // [fadeTime1st + waitTime1st, (fadeTime1st + waitTime1st) + fadeTime2nd] : 
        // フェードアウト（1 => 0）
        float progress = (t - fadeTime1st - waitTime1st) / fadeTime2nd;

        // コサイン補間
        // progress=0 のとき cos(0)=1 → 0.5*(1+1)=1
        // progress=1 のとき cos(PI)=-1 → 0.5*(1+(-1))=0）
        periodicIntensity = (0.5 * (1.0 + cos(progress * Math_PI))) * maxIntensity;

    } else {
        // [fadeTime1st + waitTime1st + fadeTime2nd, cycleTime]
        // => waitTime2nd : alpha = 0 で待機
        periodicIntensity = 0.0;
    }

    /**
    * Fresnel Intensity
    */

    vec3 dirToCameraNorm = normalize(cameraPosition - vModelPosition);
    float dotResult = dot(vNormal, dirToCameraNorm); // cos(θ) [1.0 => -1.0]
    float FresnelIntensity = pow(1.0 - dotResult, 3.0); // [0.0 => 1.0]

    /**
    * Synthesize Intensities
    */

    float alphaIntensity = periodicIntensity * FresnelIntensity;


    vec3 color = vec3(1.0, 1.0, 1.0);

    gl_FragColor = vec4(color, alphaIntensity);
}
