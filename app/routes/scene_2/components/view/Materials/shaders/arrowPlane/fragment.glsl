precision mediump float;

varying vec2 vUv;

void main() {
    // フラグメント（ピクセル）の UV 座標を p とする
    vec2 p = vUv;
    
    // ── 1. 矢印シャフト（軸）の計算 ──
    // 始点 A = (0.5, 0.0) と先端 B = (0.0, 1.0) を定義
    vec2 A = vec2(0.5, 0.0);
    vec2 B = vec2(0.0, 1.0);
    vec2 BA = B - A; // A→B のベクトル
    
    // 点 p を A→B の直線上に射影して、
    // 進行度 tParam (0～1) を求める
    float tParam = dot(p - A, BA) / dot(BA, BA);
    vec2 proj = A + tParam * BA;
    // 点 p とその射影点との距離を dLine とする
    float dLine = length(p - proj);
    
    // シャフトは A から B へ進む途中 (tParam ∈ [0, 0.9]) の部分のみ表示
    float shaftMask = step(0.0, tParam) * step(tParam, 0.9);
    // dLine が小さい（直線に近い）部分を smoothstep で線として描く（0.008 以下を線幅として採用）
    float shaft = smoothstep(0.008, 0.0, dLine) * shaftMask;
    
    
    // ── 2. 矢印ヘッド（先端三角形）の計算 ──
    // 先端 B を頂点とし、矢印の向き（A→B）の正規化ベクトル N を求める
    vec2 N = normalize(BA);
    // p と先端 B の差分（B を原点とした局所座標）
    vec2 r = p - B;
    // x_ は矢印軸方向に対する後退距離（B から見て内部方向に向かう）
    float x_ = -dot(r, N);
    
    // N に垂直な単位ベクトル（右手系）
    vec2 perp = vec2(-N.y, N.x);
    // y_ は軸に対して左右どれだけずれているか
    float y_ = dot(r, perp);
    
    // ヘッドの長さ（Lh）と先端での半幅（Wh）の設定
    float Lh = 0.12; // ヘッドの長さ
    float Wh = 0.06; // ヘッドの最大半幅（B での左右広がり）
    float minAllowed = 0.005; // x_ = 0 付近の最小許容幅
    // x_ に応じて allowed（左右許容オフセット）を線形補間で決定
    float allowed = mix(minAllowed, Wh, x_ / Lh);
    allowed = clamp(allowed, minAllowed, Wh);
    float edgeSmooth = 0.005; // エッジのソフト化用幅
    
    // p が矢印ヘッド内部にあるか判定：
    //  |y_| が allowed 未満なら内部とみなし、smoothstep でエッジをなめらかに
    float head = (1.0 - smoothstep(allowed - edgeSmooth, allowed, abs(y_)))
                 * step(0.0, x_) * step(x_, Lh);
    
    // ── 3. シャフトとヘッドを合成 ──
    float arrowShape = max(shaft, head);
    
    // 最終的な表示色（ここでは赤色）と、alpha に arrowShape を利用
    vec3 arrowColor = vec3(1.0, 0.0, 0.0);
    gl_FragColor = vec4(arrowColor, arrowShape);
}
