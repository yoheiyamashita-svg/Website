// 横波（定常波）モードの反射波モデル（Physics Layer）。
//
// このモードでは、js/physics/wave/TravelingWave.jsが定義する入射波
//   u1(x,t) = A sin(kx - ωt)   … +x方向（左端→右端）に進む
// が、右端(x=mediumLength)で反射して戻ってくる波を u2 として扱う。
// u1自体はTravelingWave.calculateDisplacementをそのまま再利用し（別の近似式を作らない）、
// このファイルは「反射して-x方向に戻る波」という、TravelingWave.jsにはまだ無い
// 物理現象だけを追加で定義する。
//
// 【反射波の式の導出（境界条件から）】
// 反射波を u2(x,t) = ε・A・sin(2kL - kx - ωt) という形で仮定する
// （L=mediumLength、εは境界の種類で決まる符号）。
//
// 自由端(x=Lで傾き∂u/∂x=0)の場合：
//   u=u1+u2 を x で微分すると、x=Lで
//     ∂u/∂x|_{x=L} = kA cos(kL-ωt) + ε・(-k)A cos(2kL-kL-ωt)
//                  = kA cos(kL-ωt) - εkA cos(kL-ωt)
//   これが全てのtで0になるには ε=+1 が必要。
//
// 固定端(x=Lで変位u=0)の場合：
//   u(L,t) = A sin(kL-ωt) + ε・A sin(2kL-kL-ωt) = A sin(kL-ωt) + ε・A sin(kL-ωt)
//          = (1+ε)A sin(kL-ωt)
//   これが全てのtで0になるには ε=-1 が必要。
//
// つまり ε = +1（自由端） / -1（固定端）。この符号関係は数値計算でも検証済み。

import { calculateAngularFrequency, calculateWaveNumber } from "./TravelingWave.js";

/**
 * 位置x、時刻tにおける反射波の変位u2(x,t)を求める。
 *
 * 物理式:
 *   u2(x,t) = ε・A・sin(2kL - kx - ωt)
 *
 * - u2: 反射波の変位 [m]
 * - A (amplitude): 反射波の振幅 [m]（通常は入射波と同じ振幅を使う＝エネルギー損失のない反射）
 * - k (waveNumber): 波数 [rad/m]
 * - L (mediumLength): 反射が起きる右端の位置 [m]（媒質の全長）
 * - ω (angularFrequency): 角周波数 [rad/s]
 * - ε: 境界の種類で決まる符号。自由端なら+1、固定端なら-1
 *   （自由端反射では位相が反転せず、固定端反射では位相が反転する。physics.md §15-16参照）
 *
 * @param {number} x - 位置 [m]
 * @param {number} t - 時刻 [s]
 * @param {{amplitude: number, wavelength: number, frequency: number, mediumLength: number, isFixedEnd: boolean}} parameters
 * @returns {number} 反射波の変位 u2 [m]
 */
export function calculateReflectedDisplacement(
  x,
  t,
  { amplitude, wavelength, frequency, mediumLength, isFixedEnd }
) {
  const waveNumber = calculateWaveNumber(wavelength);
  const angularFrequency = calculateAngularFrequency(frequency);
  const sign = isFixedEnd ? -1 : 1;
  return sign * amplitude * Math.sin(2 * waveNumber * mediumLength - waveNumber * x - angularFrequency * t);
}
