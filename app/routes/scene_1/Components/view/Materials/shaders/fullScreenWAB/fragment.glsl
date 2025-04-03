uniform float uScrollRatio;
uniform sampler2D uTexture;
varying vec2 vUv;

void main () {
    vec4 p = texture2D(uTexture, vUv);

   /**
    * Brightness
    */

    float brightness = dot(p.rgb, vec3(0.299, 0.587, 0.114));
    float brighterIntensity = 0.64;
    float weight = 1.0 - brightness;

    brightness += weight * brighterIntensity;

   /**
    * Filter
    */

    vec4 filterColor = vec4(vec3(brightness), 1.0);

   /**
    * Alpha
    */

    float speed = 10.0;
    float alpha = (1.0 - uScrollRatio * speed);

   /**
    * Output
    */

    gl_FragColor = vec4(filterColor.rgb, alpha);
}