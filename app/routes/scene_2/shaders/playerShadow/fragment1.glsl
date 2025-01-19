uniform float uShadowLevel;
uniform vec3 uPlayerPosition; 
uniform mat4 uModelMatrix;

varying vec2 vUv;

void main () {

    /*
    * Convert Coordinates from Global to Local
    */

    // プレイヤーのグローバル座標を4Dベクトルに変換（y=0, zはuPlayerPosition.yを使用）
    vec4 playerPositionGlobal = vec4(uPlayerPosition.x, 0.0, uPlayerPosition.z, 1.0);
    
    // グローバル座標をローカル座標に変換（モデル行列の逆行列を使用）
    vec4 playerPositionLocal = inverse(uModelMatrix) * playerPositionGlobal;

    // ローカル座標をUV座標系に変換
    vec2 playerPositionUv = 
        vec2(
            playerPositionLocal.x / 24.0 + 0.5,
            playerPositionLocal.y / 24.0 + 0.5
        );


    /**
    * Offset
    */

    vec2 floorCenter = vec2(0.5, 0.5);

    // playerPositionUv と floorCenter の単位ベクトルを取得する
    // 取得した単位ベクトルにoffset値を与えて、
    // playerPositionUv に合成
    vec2 normalDirection = normalize(playerPositionUv - floorCenter);
    float offset = 0.015;
    vec2 shadowCenter = playerPositionUv + normalDirection * offset; 
    
    
    float distanceToShadowCenter = distance(vUv, shadowCenter);
    float distanceToFloorCenter = distance(playerPositionUv, floorCenter);

   /*
    * Shadow Size
    */  

    // PlayerShadowの中心からのスムーズな値の変化(t)を取得
    float t1 = smoothstep(0.0, 0.05, distanceToShadowCenter);

    // 変化(t)に合わせて、opacityの値を減少させ
    // 放射状の影を再現
    float baseOopacity = mix(1.0, 0.0, t1);

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

    gl_FragColor = vec4(0.0, 0.0, 0.0, opacityStrength * uShadowLevel * 1.3);

}