uniform vec3 uSunPosition;

varying vec2 vUv;


void main () {

    float sunHight = uSunPosition.y;
    float groundHight = -80.0;

    float sunOpacity = smoothstep(groundHight, groundHight + 20.0, sunHight);

    float alpha = mix(0.0, 1.0, sunOpacity);

    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);

}