varying vec3 vColor;

void main () {
    vec3 debugColor = vec3 (1.0, 0.0, 0.0);

    gl_FragColor = vec4(vColor, 1.0);
    // gl_FragColor = vec4(debugColor, 1.0);
}