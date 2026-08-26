// 定常波（standing wave）の一般モデル（physics.md §14、指示書§18）。
//
// 【進行波との違い（重要）】
// TravelingWave.js の u(x,t)=A sin(kx-ωt+φ) は「波形がx方向に移動していく」モデルだが、
// 定常波はその場で振動するだけで移動しない。両者は別の物理現象であり、
// 気柱振動を「進行波を筒に入れて描くだけ」で済ませてはいけない
// （指示書 禁止事項7：一端閉管を単純な進行波として実装しない）。
//
// 定常波は、位置に依存する部分 cos(kx) と、時間に依存する部分 cos(ωt) の積として
// 変数分離できる形で表され（physics.md §14の重ね合わせ導出も参照）、
// 気柱振動ではこの分離形がそのまま境界条件（開口=腹・閉口=節）を扱いやすくする。

/**
 * 位置x、時刻tにおける定常波の変位u(x,t)を求める。
 *
 * 物理式:
 *   u(x,t) = A cos(kx) cos(ωt)
 *
 * - u: 変位 [m]
 * - A (amplitude): 振幅 [m]
 * - k (waveNumber): 波数 [rad/m]（気柱の境界条件から決まる。物理量の意味自体は
 *   TravelingWave.calculateWaveNumberと同じだが、値の決め方が異なる＝
 *   physics/acoustic/側の境界条件モジュールが計算する）
 * - x: 位置 [m]
 * - ω (angularFrequency): 角周波数 [rad/s]（気柱の固有振動数から決まる）
 * - t: 時刻 [s]
 *
 * x=0では cos(k·0)=cos(0)=1 となるため、この式は常に x=0 で
 * 「振幅A・角周波数ωで振動する腹」になる（指示書§15：音源側=開口=腹、という
 * 絶対条件をこの式の形自体が保証している）。
 *
 * @param {number} x - 位置 [m]
 * @param {number} t - 時刻 [s]
 * @param {{amplitude: number, waveNumber: number, angularFrequency: number}} parameters
 * @returns {number} 変位 u [m]
 */
export function calculateStandingWaveDisplacement(x, t, { amplitude, waveNumber, angularFrequency }) {
  return amplitude * Math.cos(waveNumber * x) * Math.cos(angularFrequency * t);
}

/**
 * 位置x、時刻tにおける定常波の粒子速度 v_p(x,t) = ∂u/∂t を求める。
 *
 * 導出:
 *   u(x,t) = A cos(kx) cos(ωt)
 *   ∂u/∂t = A cos(kx) × d/dt[cos(ωt)]
 *          = A cos(kx) × (-ω sin(ωt))
 *          = -Aω cos(kx) sin(ωt)
 *
 * cos(kx)の部分（位置による腹・節の分布）はtで微分しても変わらず、
 * cos(ωt)の部分だけがsin(ωt)に変わり、係数-ωが掛かる。
 *
 * @param {number} x - 位置 [m]
 * @param {number} t - 時刻 [s]
 * @param {{amplitude: number, waveNumber: number, angularFrequency: number}} parameters
 * @returns {number} 粒子速度 v_p [m/s]
 */
export function calculateStandingWaveParticleVelocity(x, t, { amplitude, waveNumber, angularFrequency }) {
  return -amplitude * angularFrequency * Math.cos(waveNumber * x) * Math.sin(angularFrequency * t);
}
