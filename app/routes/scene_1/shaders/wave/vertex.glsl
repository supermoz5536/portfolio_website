uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uElapseTime;

void main() {
    // オブジェクトの中心を基準にしたローカル座標に
    // modelMatrix(transform)を適用して
    // シーンを基準にした座標系であるワールド座標に変換
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // += にすると modelPosition.y の
    // transformした後のワールド座標に追加する形で
    // sin(x)のy座標の値をオフセットしてるので
    // modelMatrixで反映させたワールド座標を変更する形で操作できる。
    float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uElapseTime) *
                      sin(modelPosition.z * uBigWavesFrequency.y + uElapseTime) *
                      uBigWavesElevation;     

    modelPosition.y += elevation;

    
    
    // ワールド座標にviewMatrixを適用して
    // カメラの座標を基準としたビュー座標に変換
    vec4 viewPosition =  viewMatrix * modelPosition;

    // ビュー座標を2D上に投影するためのクリップ座標に変換
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    
}