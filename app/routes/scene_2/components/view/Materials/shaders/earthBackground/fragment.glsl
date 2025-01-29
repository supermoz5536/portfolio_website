uniform sampler2D uTextureSky;
uniform sampler2D uTextureGround;
uniform bool uIsMobile;

varying vec2 vUv;

void main () {
    vec4 colorSky = texture2D(uTextureSky, vUv);
    vec4 colorGround = texture2D(uTextureGround, vUv);
    float lowStep = 0.525;

    float holizontalCurveMultiplier = uIsMobile ? 0.005 : 0.175;

    lowStep -= pow(abs(vUv.x - 0.5), 2.0) * holizontalCurveMultiplier;
    
    // lowStepから + 0.05の範囲でグラデーション
    // x軸がサイドに広がるにつれて、グラデーション領域が下降
    float gradientY = smoothstep(lowStep, lowStep + 0.06, vUv.y);

    vec3 finalColor = mix(colorGround.rgb, colorSky.rgb, gradientY);

    gl_FragColor = vec4(finalColor, 1.0);
}