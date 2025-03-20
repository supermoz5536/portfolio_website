uniform sampler2D uTextureSky;
uniform sampler2D uTextureGround;
uniform bool uIsMobile;
uniform float uLowStep;

varying vec2 vUv;

void main () {
    vec4 colorSky = texture2D(uTextureSky, vUv);
    vec4 colorGround = texture2D(uTextureGround, vUv);
    float lowStep = uLowStep;

    float holizontalCurveMultiplier = uIsMobile ? 0.005 : 0.1;

    lowStep -= pow(abs(vUv.x - 0.5), 2.0) * holizontalCurveMultiplier;
    
    // lowStepから + 0.05の範囲でグラデーション
    // x軸がサイドに広がるにつれて、グラデーション領域が下降
    float gradientY = smoothstep(lowStep, lowStep + 0.06, vUv.y);

    vec3 finalColor = mix(colorGround.rgb, colorSky.rgb, gradientY);

    gl_FragColor = vec4(finalColor, 1.0);
}





// uniform sampler2D uTextureSky;
// uniform sampler2D uTextureGround;
// uniform bool uIsMobile;

// varying vec2 vUv;

// void main () {
//     vec4 colorSky = texture2D(uTextureSky, vUv);
//     vec4 colorGround = texture2D(uTextureGround, vUv);
    
//     // 上接ピクセルのalpha値をサンプリング
//     float alphaUp = texture2D(uTextureGround, vUv + vec2(0.0, 0.003)).a;

//     float gradientY;

//     // Groundを描画
//     if (colorGround.a == 1.0) {
//       gradientY = 1.0;

//     // Skyを描画
//     } else if (colorGround.a == 0.0) {
//       gradientY = 0.0;
//     } 
    
//     // 境界のぼかし描画
//     if (alphaUp == 0.0 && colorGround.a == 1.0) {
//         gradientY = smoothstep(vUv.y - 0.03, vUv.y + 0.03, vUv.y);
//     }

//     vec3 finalColor = mix(colorSky.rgb, colorGround.rgb, gradientY);

//     gl_FragColor = vec4(finalColor, 1.0);
// }


