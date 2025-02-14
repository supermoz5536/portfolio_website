
uniform float uPointSize;
uniform float uPixelRatio;
uniform float uTime;

attribute float aScale;
attribute float aRandom;

void main () {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.y += sin(uTime * aRandom * 0.9) * aScale + 2.0;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;

    gl_PointSize = uPointSize * uPixelRatio * aScale;
    // カメラからの奥行き(z)に応じて、サイズが可変する公式を適用
    gl_PointSize *= (1.0 / - viewPosition.z);

 

}