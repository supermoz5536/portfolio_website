uniform float uScrollRatio;
uniform float uAspectRatio;
uniform float uAngle;

varying vec2 vUv;

vec2 rotatedPosition (vec2 value) {
    vec2 center = vec2(0.8, 0.8);

    value -= center;

    // 2D回転行列を適用
    vec2 result = vec2(
                     cos(uAngle) * value.x - sin(uAngle) * value.y,
                     sin(uAngle) * value.x + cos(uAngle) * value.y
                   );
    result += center;

    return result;

}

void main() {

    vec2 center = vec2(0.8, 0.8);

    // Uv rotated
    vec2 rUv = rotatedPosition(vUv);

    vec2 heightLimited = vec2(0.8, 0.8 + (0.8 * max(0.0, uScrollRatio - 0.1) * 5.0));
    vec2 rHeightLimited = rotatedPosition(heightLimited);
    float rHeightRange = distance(rHeightLimited, center);

    vec2 leftLimited = vec2(0.8 - (0.8 * max(0.0, uScrollRatio - 0.1) * 5.0), 0.8);
    vec2 rLeftLimited = rotatedPosition(leftLimited);
    float rWidthRange = distance(rLeftLimited, center);
    
    vec2 diff = rUv -center;

    if (
       abs(diff.y) < rHeightRange / 2.0 && 
       abs(diff.x) < rWidthRange / 2.0
    ) {
        discard;
    }


     gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

}