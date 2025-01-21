uniform float uAtmosphereElevation;
uniform float uAtmospherePower;
uniform vec3 uColorDayCycleLow;
uniform vec3 uColorDayCycleHigh;
uniform vec3 uColorNightLow;
uniform vec3 uColorNightHigh;

uniform float uDayCycleProgress;

varying vec3 vColor;

void main () {
vec4 modelPosition = modelMatrix * vec4(position, 1.0);
vec4 projectedPosition = projectionMatrix * viewMatrix * modelPosition;

gl_Position = projectedPosition;


    // 原点（ローカル座標の中心）から、
    // その頂点（各vertex）へ向かう「方向」の単位ベクトルが得られます。
    // 位置情報だけをnormalize関数に入れると、自動的に原点が基準になる理由は
    // 通常、各頂点の位置情報は、原点（座標 (0,0,0)）から
    // その頂点までのベクトルとして表現されるからです
    vec3 normalizedPosition = normalize(position);

    /**
     * Sky and atmosphere
     * 空と大気の基本色の計算
     */
    
    // Horizon intensity
    
    // 「中央」を基準にした対称的な処理を行うために
    // uv座標のy軸の中央値(0.5)を引くことで
    // uv座標の中心からの縦の距離を取得する

    //「大気が厚い（＝エレベーション値が大きい）場合は、
    // 中央からのわずかな高さのずれでも色の変化が緩やかになるように調整する」
    float horizonIntensity = (uv.y - 0.5) / uAtmosphereElevation;

    // 計算で得た「中央からの高さのずれ」に基づく値（horizonIntensity）を、
    // 1.0から引いています。
    // 値が大きい部分（例えば、画面の上部で高く離れている部分）は 
    // 1.0 - (大きな数) → 小さな値に、
    // 逆に、中央付近では 1.0 - (小さい数) → 大きな値になります。
    // これにより、中央（地平線付近）と上部（または下部）の関係が反転し、
    // 地平線付近の効果を強調できるようになります。

    // pow 関数は、括弧内の値を uAtmospherePower で指定した指数でべき乗します。
    // これにより、もともとの値の変化が、非線形（急激またはなだらか）に強調されます。
    horizonIntensity = pow(1.0 - horizonIntensity, uAtmospherePower);

    // Color day
    // 昼間の空の色を決めるために
    // 上部の色（uColorDayCycleHigh）と下部の色（uColorDayCycleLow）を、
    // 計算された「horizonIntensity」を使って線形補間（ミックス）している、
    vec3 colorDayCycle = mix(uColorDayCycleHigh, uColorDayCycleLow, horizonIntensity);
    
    // Color night
    // 同様
    vec3 colorNight = mix(uColorNightHigh, uColorNightLow, horizonIntensity);
    
    // Mix between day and night

    // uDayCycleProgress: 昼夜サイクルの進行度を 0〜1 の範囲で示すパラメーターです。

    // - 0.5: uDayCycleProgress が中央（0.5）からどれだけ離れているかを求めます。
    //   これにより、中央 (0.5) からの差分が求まります。

    //   uDayCycleProgress が 0.5 のとき、この値は 0。
    //   uDayCycleProgress が 0 または 1 のとき、
    //   0.0 - 0.5 = -0.5
    //   1.0 - 0.5 = +0.5
    
    // abs(uDayCycleProgress - 0.5): 最大値は 0.5（中央からのずれが最大の場合）
    // * 2.0: 0〜0.5 の範囲を 0～1 の範囲に正規化します。
    float dayIntensity = abs(uDayCycleProgress - 0.5) * 2.0;

    // uDayCycleProgress = 0.5 (中間値)の時、dayIntensity = 0(最小:夜間)
    // uDayCycleProgress = 0 or 1(上端 or下端)は、dayIntensity = 1(最大:昼間)
    // 0.5を基準値として夜間に設定し、0.5から差分を作るほど、昼間になる。

    // uDayCycleProgress の設計思想
    // 周期性（サイクル）の考え方：通常「0」と「1」は実質同じ状態（たとえば正午など）を
    // 表し、サイクル上で連続していると考えるケースがよくあります。
    // そのため、0 と 1 が同じ（あるいは似た）明るさの状態になり、
    // 真ん中の 0.5 が最も暗い状態（夜または真夜中）として設定する、
    // という設計が採用されることがあります。
    // 例：CSS のシンプルな上下周期のアニメーション
    vec3 color = mix(colorNight, colorDayCycle, dayIntensity);

    vColor = color;
}