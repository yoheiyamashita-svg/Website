// 縦波（粗密波）に固有の物理量を扱うPhysics Layerのモジュール（physics.md §6, §12）。
//
// 縦波では、粒子は波の進行方向と同じ軸（1次元のx軸）上で前後に振動する
// （横波のように上下に振動するのではない）。
// 粒子の位置そのものは TravelingWave.calculateDisplacement が返す変位 u を使って
// x(t) = x0 + u(x0, t) と表せるため、ここでは新たな式を定義していない
// （REQ-105：粒子表示用に別の近似式を作らない）。
//
// このファイルが追加で提供するのは、変位の「時間微分」にあたる粒子速度の計算だけである。

import { calculateAngularFrequency, calculateWaveNumber } from "./TravelingWave.js";

/**
 * 位置 x、時刻 t における粒子速度 v_p(x,t) を求める。
 *
 * 物理式:
 *   v_p(x,t) = ∂u/∂t = -ωA cos(kx - ωt + φ)
 *
 * u(x,t) = A sin(kx - ωt + φ) を時刻tで微分すると、
 * sinの微分がcosになり、内側の(-ωt)の微分である-ωが係数として掛かるため、
 * 上記の式になる。
 *
 * - v_p: 粒子速度 [m/s]。その場にとどまる1つの粒子が、時刻tに
 *   どれだけの速さで動いているか。
 * - A: 振幅 [m]、k: 波数 [rad/m]、ω: 角周波数 [rad/s]、φ: 初期位相 [rad]。
 *
 * 注意：この v_p は「粒子自身の振動の速さ」であり、
 * 波形（山や谷のパターン）が進む速さ v = fλ（TravelingWave.calculateWaveSpeed）
 * とはまったく別の物理量である（physics.md §23 誤解3）。
 *
 * @param {number} x - 位置 [m]
 * @param {number} t - 時刻 [s]
 * @param {{amplitude: number, wavelength: number, frequency: number, phase: number}} parameters
 * @returns {number} 粒子速度 v_p [m/s]
 */
export function calculateParticleVelocity(x, t, { amplitude, wavelength, frequency, phase }) {
  const waveNumber = calculateWaveNumber(wavelength);
  const angularFrequency = calculateAngularFrequency(frequency);
  return -angularFrequency * amplitude * Math.cos(waveNumber * x - angularFrequency * t + phase);
}
