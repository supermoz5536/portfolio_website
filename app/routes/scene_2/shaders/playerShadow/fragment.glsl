uniform vec2 uPlayerShadowPositionUv; 

varying vec2 vUv;

void main () {

    vec2 shadowCenter = vec2(uPlayerShadowPositionUv);
    vec2 floorCenter = vec2(0.5, 0.5);
    
    float distanceToShadowCenter = distance(vUv, shadowCenter);
    float distanceToFloorCenter = distance(uPlayerShadowPositionUv, floorCenter);

    /*
    * Shadow Size
    */

    // PlayerShadowの中心からのスムーズな値の変化(t)を取得
    float t1 = smoothstep(0.0, 0.05, distanceToShadowCenter);

    // 変化(t)に合わせて、opacityの値を減少させ
    // 放射状の影を再現
    float baseOopacity = mix(0.9, 0.0, t1);

    if (distanceToShadowCenter > 0.05) {
        discard;
    }
    
    /** 
    * Shadow Transparency
    */

    // Floor の中心からのスムーズな値の変化(t)を取得
    // 第一引数 0.1: ShowCase部分を除外
    float t2 = smoothstep(0.1, 1.0, distanceToFloorCenter);

    float opacityStrength = mix(baseOopacity, 0.0, t2);

    gl_FragColor = vec4(0.0, 0.0, 0.0, opacityStrength);

}