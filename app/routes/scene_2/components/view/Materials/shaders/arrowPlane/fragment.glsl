precision mediump float;

varying vec2 vUv;

void main() {
    vec2 p = vUv;
    
    /**
    * Shaft
    */

    vec2 A = vec2(0.5, 0.0); // 始点 A = (0.5, 0.0)
    vec2 B = vec2(0.0, 1.0); // 終点 B = (0.0, 1.0) を定義
    vec2 BA = B - A; // A → B のベクトル
    
    // 点 p を A→B の直線上に射影して、進行度 tParam (0～1) を求める
    // |p-A| * |BA| * cos(θ) / |BA|^2 * cos(θ) => |p-A| * cos(θ) / |BA|
    float tParam = dot(p - A, BA) / dot(BA, BA);
    // offset を計算して A に加える
    vec2 proj = A + tParam * BA;
    // 点 p とその射影点との距離を dLine とする
    float dLine = length(p - proj);
    
    // シャフトは A から B の間の矢印部分を除いた
    // 0 以上、かつ、0.9 以下 (tParam ∈ [0, 0.9]) の範囲を表示
    // GLSL の場合、条件分岐 (if) はパフォーマンス上の問題があるため、
    // step を使って a ≤ t ≤ b を表現する
    float shaftMask = step(0.0, tParam) * step(tParam, 1.0);
    // dLine が小さい（直線に近い）部分を smoothstep で線として描く（0.008 以下を線幅として採用）
    float shaft = smoothstep(0.008, 0.0, dLine) * shaftMask;
    
    
    /**
    * Head
    */

    /* 「矢印の先端」　〜 「Shaft 上に投影した p」までの後退距離 */
    
    // 先端 B を頂点とし、矢印の向き（A→B）の正規化ベクトル N を求める
    vec2 N = normalize(BA);
    // 任意の点 p の位置を、矢印の先端 B を原点とした座標系に変換しています。
    // 後の計算で、p が矢印の内部にあるかの判定に使用
    vec2 r = p - B;
    // x_ は矢印軸方向に対する後退距離（B から見て内部方向に向かう）
    float x_ = dot(r, -N);
    
    /* 頂点から Shaft までの垂直距離 */

    // N に垂直な単位ベクトル（時計回り）
    vec2 perp = vec2(-N.y, N.x);
    float y_ = dot(r, perp);
    
    // ヘッドの長さ（Lh）と先端での半幅（Wh）の設定
    float Lh = 0.0; // ヘッドの長さ
    float Wh = 0.035; // ヘッドの最大幅

    // x_ = 0 (後退距離)付近の最小許容幅
    // 非常に先端近くにおいても最低限の幅が確保
    float minAllowed = 0.005; 
    
    // 後退距離に応じて 左右オフセットを調整
    // B → ヘッドの最大幅 : 0 → 1
    float allowed = mix(minAllowed, Wh, x_ / Lh);
    // allowed は x_ に依存しており
    // かつ、x_ は Lh 以上の値になるから
    // allowed が Wh以上の値を取りうるので
    // clamp で範囲指定が必要
    allowed = clamp(allowed, minAllowed, Wh);
    
    float edgeSmooth = 0.005; // エッジのソフト化用幅
    
    // p が矢印ヘッド内部にあるか判定：
    //  |y_| が allowed 未満なら内部とみなし、smoothstep でエッジをなめらかに
    float head = (1.0 - smoothstep(allowed - edgeSmooth, allowed, abs(y_)))
                 * step(0.0, x_) * step(x_, Lh);
    
    /*
    * Synthesize
    */

    // 片方が０の時、もう片方は０ではないので max で棲み分け
    float arrowShape = max(shaft, head);
    
    // 最終的な表示色（ここでは赤色）と、alpha に arrowShape を利用
    vec3 arrowColor = vec3(1.0, 1.0, 1.0);
    gl_FragColor = vec4(arrowColor, arrowShape);
}
