uniform float uScrollRatio;

varying vec2 vUv;

void main () {

    // vec2 p = vUv;

    // float brightnessIntensity = dot(p.rgb, vec3(0.299, 0.587, 0.114));

    // vec3 color = vec3(brightnessIntensity);
    vec3 color = vec3(1.0, 0.0, 0.0);

    gl_FragColor = vec4(color, 1.0);
}