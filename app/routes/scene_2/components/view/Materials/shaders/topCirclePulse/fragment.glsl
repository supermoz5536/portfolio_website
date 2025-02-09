float Math_PI = 3.141592653589793238462643383279502884197; 

precision mediump float;

uniform float uTime;

varying vec2 vUv;


float getRandom (vec2 arg ) {
    float random = sin(dot(arg, vec2(45.9898, 78.233)));
    return random;
}

void main() {
    vec2 p = vUv;
       
    /**
    * Pulse
    */

    vec2 A = vec2(0.0, 1.0); 
    vec2 B = vec2(1.0, 0.0); 

    float period = 2.0;
    float cycle = floor(uTime / period);

    float randomResult = getRandom(vec2(cycle, cycle));

    // x座標を0に固定してから座標算出
    if (randomResult > 0.5) {
        A = vec2(0.0, getRandom(vec2(randomResult, randomResult))); 
        B = vec2(1.0, 1.0 - getRandom(vec2(randomResult, randomResult))); 

    // y座標を0に固定してから座標算出
    } else if (randomResult <= 0.5) {
        A = vec2(1.0, 1.0 - getRandom(vec2(randomResult, randomResult)));
        B = vec2(0.0, getRandom(vec2(randomResult, randomResult)));
    }

    float distanceBetAB = distance(A, B);
    vec2 normDir = normalize(B - A);
    float distanceAlong = dot(p - A, normDir);

    float t1 = distanceAlong / distanceBetAB;

    // offset を計算して A に加える
    vec2 proj = A + t1 * (B - A);
    // 点 p とその射影点との距離を dLine とする
    float dLine = length(p - proj);

    float t2 = pow(mod(uTime, period) / period, 12.0);

    float baseLowStep = sin(Math_PI / 2.0 * t2) - 0.15; 

    float shaftMask = 
        smoothstep(baseLowStep, baseLowStep + 0.15, t1) *  // 先頭
        (1.0 - smoothstep(baseLowStep + 0.1, baseLowStep + 0.15, t1)); // 後尾

    // dLine が小さい（直線に近い）部分を smoothstep で線として描く（0.008 以下を線幅として採用）
    float shaft = smoothstep(0.03, 0.0, dLine) * shaftMask;
    
    
    // 最終的な表示色（ここでは赤色）と、alpha に arrowShape を利用
    vec3 arrowColor = vec3(0.0, 1.0, 1.0);
    gl_FragColor = vec4(arrowColor, shaft);
}
