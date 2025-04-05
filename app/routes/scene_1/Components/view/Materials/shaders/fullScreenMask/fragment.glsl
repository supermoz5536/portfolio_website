uniform float uOpacity;

varying vec2 vUv;

void main () {

    // float multiplier = 0.05;
    // float alpha = 1.0 - (uTime * multiplier);

    gl_FragColor = vec4(1.0, 1.0, 1.0, uOpacity);
}