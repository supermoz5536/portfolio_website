float Math_PI = 3.141592653589793238462643383279502884197; 

precision mediump float;

uniform float uTime;

varying vec2 vUv;


float getRandom (float arg ) {
    vec2 dotElement1 = vec2(arg * 3.64968, arg * 53.64968);
    vec2 dotElement2 = vec2(45.9898, 78.233) ;
    float random = sin(dot(dotElement1, dotElement2));
    return random;
}

void main() {
    vec2 p = vUv;
       
    /**
    * Pulse
    */

   

    float period = 1.5;
    float cycle = floor(uTime / period);

    float randomResult = getRandom(cycle);

    /**
    * Coordinate A and B
    */
    vec2 A = vec2(cos(Math_PI * 2.0 * randomResult) * 0.5 + 0.5, sin(Math_PI * 2.0 * randomResult) * 0.5 + 0.5); 

    vec2 originBasedA = A - vec2(0.5);
    vec2 originBasedB = vec2(-originBasedA);

    vec2 B = originBasedB + vec2(0.5); 
   
   /**
   * Progress Rate (t1) 
   */

    float distanceBetAB = distance(A, B);
    vec2 normDir = normalize(B - A);
    float distanceAlong = dot(p - A, normDir);

    float t1 = distanceAlong / distanceBetAB;

    // offset を計算して A に加える
    vec2 proj = A + t1 * (B - A);
    // 点 p とその射影点との距離
    float vDistace = length(p - proj);

    /**
    * LowStep Rate (t2)
    */
    float t2 = pow(mod(uTime, period) / period, 12.0);

    float baseLowStep = sin(Math_PI / 2.0 * t2) - 0.15; 

    float pulseHeight = 
        smoothstep(baseLowStep, baseLowStep + 0.15, t1) *  // 先頭
        (1.0 - smoothstep(baseLowStep + 0.1, baseLowStep + 0.15, t1)); // 後尾

    float shaft = smoothstep(0.03, 0.0, vDistace) * pulseHeight;
    
    
    vec3 arrowColor = vec3(0.0, 1.0, 1.0);
    gl_FragColor = vec4(arrowColor, shaft);
}
