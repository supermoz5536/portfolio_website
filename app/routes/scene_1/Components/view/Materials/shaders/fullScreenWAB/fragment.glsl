uniform float uScrollRatio;
uniform sampler2D uTexture;
varying vec2 vUv;

void main () {

    

    vec4 p = texture2D(uTexture, vUv);

    float brightness = dot(p.rgb, vec3(0.299, 0.587, 0.114));
    float intensity = 1.0;

    vec4 filterColor = vec4(vec3(brightness * intensity), 1.0);

    float speed = 1.0;
    float blend = uScrollRatio * speed;

    vec4 finalColor = mix(filterColor, p, blend);


    gl_FragColor = vec4(finalColor.rgb, 1.0);
}