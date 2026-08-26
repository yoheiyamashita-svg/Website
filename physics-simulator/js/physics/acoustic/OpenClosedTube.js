// 一端閉管（open-closed tube）の境界条件（physics.md §19, §20、指示書§17-2, §18-2）。
//
// 座標系：x=0が音源側（指示書§15の絶対条件により常に開口）、
//         x=Lが反対側（この境界条件では閉口）。
//
// 境界条件：
//   x=0（開口）: u(0,t) = A cos(0) cos(ωt) = A cos(ωt) … 常に腹（StandingWave.jsの式の形が自動的に保証）
//   x=L（閉口）: u(L,t) = 0 が全時刻tで厳密に成り立たなければならない（変位の節）。
//        u(L,t) = A cos(kL) cos(ωt) が任意のtで0になるためには、tに依存しない
//        係数 cos(kL) 自体が0でなければならない。すなわち、
//          cos(kL) = 0  →  kL = (2n-1)π/2  （n=1,2,3,...）
//        n=1: kL=π/2、n=2: kL=3π/2、n=3: kL=5π/2 …と、
//        奇数×(π/2)の値しか許されない。これが「偶数次の振動が存在しない」理由であり、
//        「kLが奇数×π/2でなければ閉口端の節条件(cos(kL)=0)を満たせない」という
//        数式そのものから導かれる（見た目ではなく計算結果としての境界条件）。
//
// 【開口端補正（end correction）Δx について】
// 開口端(x=0)の少し外側の空気も一緒に振動するため、変位の腹は開口部そのものではなく
// そこから距離Δxだけ外側にできる。閉口端(x=L)は硬い壁なので補正は起きない
// （壁の外側は振動しようがないため）。したがって一端閉管では、開口端側だけに
// 補正がかかり、実効的な気柱の長さは
//   L_eff = L + Δx
// となる（Δx=0のときは L_eff = L となり、補正なしの元の式と完全に一致する）。

/**
 * 一端閉管のn次モードにおける波数kを求める（開口端補正Δxを考慮）。
 *
 * 物理式:
 *   k L_eff = (2n-1)π/2,  L_eff = L + Δx  →  k = (2n-1)π / (2 L_eff)
 *
 * @param {number} modeNumber - モード番号 n（1, 2, 3, ...）
 * @param {number} tubeLength - 気柱の長さ L [m]
 * @param {number} [endCorrection=0] - 開口端補正 Δx [m]（開口端(x=0)側のみに適用）
 * @returns {number} 波数 k [rad/m]
 */
export function calculateWaveNumberForMode(modeNumber, tubeLength, endCorrection = 0) {
  const effectiveLength = tubeLength + endCorrection;
  return ((2 * modeNumber - 1) * Math.PI) / (2 * effectiveLength);
}

/**
 * 一端閉管のn次モードの固有振動数を求める（開口端補正Δxを考慮）。
 *
 * 物理式:
 *   f_n = (2n-1) v / (4 L_eff),  L_eff = L + Δx
 *
 * 導出：f = v k / (2π) に k = (2n-1)π/(2 L_eff) を代入すると、
 *   f_n = v (2n-1)π/(2 L_eff) / (2π) = (2n-1) v / (4 L_eff)
 *
 * n=1,2,3,... を代入すると f_1=v/4L_eff, f_2=3v/4L_eff, f_3=5v/4L_eff, ... となり、
 * 基本振動数の奇数倍だけが現れる関係はΔxの有無によらず保たれる（偶数倍は存在しない）。
 *
 * - f_n: n次固有振動数 [Hz]
 * - n (modeNumber): モード番号（1, 2, 3, ...）
 * - v (soundSpeed): 音速 [m/s]
 * - L (tubeLength): 気柱の長さ [m]
 * - Δx (endCorrection): 開口端補正 [m]
 *
 * @param {number} modeNumber - モード番号 n
 * @param {number} soundSpeed - 音速 v [m/s]
 * @param {number} tubeLength - 気柱の長さ L [m]
 * @param {number} [endCorrection=0] - 開口端補正 Δx [m]
 * @returns {number} 固有振動数 f_n [Hz]
 */
export function calculateEigenfrequency(modeNumber, soundSpeed, tubeLength, endCorrection = 0) {
  const effectiveLength = tubeLength + endCorrection;
  return ((2 * modeNumber - 1) * soundSpeed) / (4 * effectiveLength);
}
