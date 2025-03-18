uniform vec3 uSunPosition;
uniform float uPointSize;
uniform float uPixelRatio;
uniform float uBrightStrength;

attribute float aSize;
attribute vec3 aColor;

varying vec3 vColor;



void main () {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 projectedPosition = projectionMatrix * viewMatrix * modelPosition;
    gl_Position = projectedPosition;

    /*
    * Setup Size and Filter
    */

    vec3 normalizedSun = normalize(uSunPosition);
    vec3 normalizedPosition = normalize(modelPosition.xyz);

    float dotProduct = dot(normalizedSun, normalizedPosition); // [-1(180°) → 1(0°)]

    float sizeLevel = 1.0 - (dotProduct * 0.5 + 0.5); // [0(180°) → 1(0°)]

    float pointSize = aSize * uPointSize * uPixelRatio * sizeLevel;
    gl_PointSize = pointSize;


    if (pointSize < 0.5) {
        vec4 clippedPosition = vec4(2.0, 2.0, 2.0, 1.0);
        gl_Position = clippedPosition;
    }

    vColor = mix(aColor, vec3(1.0), uBrightStrength);

    
    

}