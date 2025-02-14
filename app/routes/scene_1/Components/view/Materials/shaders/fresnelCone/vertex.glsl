
varying vec2 vUv;
varying vec3 vModelPosition;
varying vec3 vNormal;

void main () {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 projectedPosition = projectionMatrix * viewMatrix * modelPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vModelPosition = modelPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
}



