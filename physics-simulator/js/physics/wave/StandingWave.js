// 定常波（standing wave）の一般モデル（physics.md §14、指示書§18）。
//
// 【進行波との違い（重要）】
// TravelingWave.js の u(x,t)=A sin(kx-ωt+φ) は「波形がx方向に移動していく」モデルだが、
// 定常波はその場で振動するだけで移動しない。両者は別の物理現象であり、
// 気柱振動を「進行波を筒に入れて描くだけ」で済ませてはいけない
// （指示書 禁止事項7：一端閉管を単純な進行波として実装しない）。
//
// 定常波は、位置に依存する部分（cos(kx)またはsin(kx)）と、時間に依存する部分 cos(ωt) の積として
// 変数分離できる形で表され（physics.md §14の重ね合わせ導出も参照）、
// 気柱振動ではこの分離形がそのまま境界条件（開口=腹・閉口=節）を扱いやすくする。
//
// 【cos(kx)とsin(kx)の使い分けについて】
// x=0がその境界条件で腹（振幅最大）になるか節（変位0）になるかで、位置に依存する部分の
// 形が変わる：x=0で腹ならcos(kx)（cos(0)=1）、x=0で節ならsin(kx)（sin(0)=0）。
// hasNodeAtOriginパラメータでこれを切り替える。気柱振動では、この境界がどちらになるかは
// 音源側(x=0)が開口(腹)か閉口(節)かで決まる（js/physics/acoustic/AirColumn.js参照）。

/**
 * 位置x、時刻tにおける定常波の変位u(x,t)を求める。
 *
 * 物理式:
 *   u(x,t) = A cos(kx) cos(ωt)   … hasNodeAtOrigin=false（x=0が腹）のとき
 *   u(x,t) = A sin(kx) cos(ωt)   … hasNodeAtOrigin=true（x=0が節）のとき
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
 * @param {number} x - 位置 [m]
 * @param {number} t - 時刻 [s]
 * @param {{amplitude: number, waveNumber: number, angularFrequency: number, hasNodeAtOrigin?: boolean}} parameters
 * @returns {number} 変位 u [m]
 */
export function calculateStandingWaveDisplacement(
  x,
  t,
  { amplitude, waveNumber, angularFrequency, hasNodeAtOrigin = false }
) {
  const spatialFactor = hasNodeAtOrigin ? Math.sin(waveNumber * x) : Math.cos(waveNumber * x);
  return amplitude * spatialFactor * Math.cos(angularFrequency * t);
}

/**
 * 位置x、時刻tにおける定常波の粒子速度 v_p(x,t) = ∂u/∂t を求める。
 *
 * 導出（hasNodeAtOrigin=falseの場合。trueのときも位置の部分がsin(kx)に変わるだけで
 * 導出の流れは同じ）:
 *   u(x,t) = A cos(kx) cos(ωt)
 *   ∂u/∂t = A cos(kx) × d/dt[cos(ωt)]
 *          = A cos(kx) × (-ω sin(ωt))
 *          = -Aω cos(kx) sin(ωt)
 *
 * 位置による腹・節の分布を表す部分（cos(kx)またはsin(kx)）はtで微分しても変わらず、
 * cos(ωt)の部分だけがsin(ωt)に変わり、係数-ωが掛かる。
 *
 * @param {number} x - 位置 [m]
 * @param {number} t - 時刻 [s]
 * @param {{amplitude: number, waveNumber: number, angularFrequency: number, hasNodeAtOrigin?: boolean}} parameters
 * @returns {number} 粒子速度 v_p [m/s]
 */
export function calculateStandingWaveParticleVelocity(
  x,
  t,
  { amplitude, waveNumber, angularFrequency, hasNodeAtOrigin = false }
) {
  const spatialFactor = hasNodeAtOrigin ? Math.sin(waveNumber * x) : Math.cos(waveNumber * x);
  return -amplitude * angularFrequency * spatialFactor * Math.sin(angularFrequency * t);
}
