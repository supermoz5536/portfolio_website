uniform sampler2D uTextureSky;
uniform sampler2D uTextureGround;

varying vec2 vUv;

void main () {
    vec4 colorSky = texture2D(uTextureSky, vUv);
    vec4 colorGround = texture2D(uTextureGround, vUv);
    float lowStep = 0.525;

    // x軸中央から両サイドの離れるほど、gradientYの適用範囲が下降
    // 2.0: 指数関数的傾斜の生成
    // 0.1: Multiplier
    lowStep -= pow(abs(vUv.x - 0.5), 2.0) * 0.175;
    
    // lowStepから + 0.05の範囲でグラデーション
    // x軸がサイドに広がるにつれて、グラデーション領域が下降
    float gradientY = smoothstep(lowStep, lowStep + 0.06, vUv.y);

    vec3 finalColor = mix(colorGround.rgb, colorSky.rgb, gradientY);

    gl_FragColor = vec4(finalColor, 1.0);
}