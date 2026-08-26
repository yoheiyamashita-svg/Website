// 両端開管（open-open tube）の境界条件（physics.md §18, §20、指示書§17-1, §18-1）。
//
// 座標系：x=0が音源側（常に開口）、x=Lが管のもう一方の端（この境界条件では開口）。
//
// 境界条件（両端とも「変位の腹」）：
//   x=0: u(0,t) = A cos(0) cos(ωt) = A cos(ωt) … cos(0)=1なので常に腹（自動的に満たされる）
//   x=L: 腹になる条件は cos(kL) の振幅が最大、すなわち |cos(kL)|=1 になること。
//        これは kL = nπ （n=1,2,3,...）のときに成り立つ
//        （sin(kL)=0 になるという条件と同値：cos(kx)の空間微分 -k sin(kx) が
//          x=Lで0になる＝その点で変位が極値＝腹、という意味）。
//
// 【開口端補正（end correction）Δx について】
// 実際の気柱では、開口端の少し外側の空気も管内の空気と一緒になって振動するため、
// 「変位の腹」は管の開口部ちょうどではなく、そこから距離Δxだけ外側にできる
// （教科書的にはΔx ≈ 0.6×管の半径 程度とされるが、このアプリでは半径を扱わないため、
// Δxをユーザーが直接指定できるパラメータとして扱う）。
// 両端開管では両方の開口端がこの補正を受けるため、実効的な気柱の長さは
//   L_eff = L + 2Δx
// となり、この実効長を使って波数・固有振動数を計算する
// （Δx=0のときは L_eff = L となり、補正なしの元の式と完全に一致する）。

/**
 * 両端開管のn次モードにおける波数kを求める（開口端補正Δxを考慮）。
 *
 * 物理式:
 *   k L_eff = nπ,  L_eff = L + 2Δx  →  k = nπ / (L + 2Δx)
 *
 * @param {number} modeNumber - モード番号 n（1, 2, 3, ...）
 * @param {number} tubeLength - 気柱の長さ L [m]
 * @param {number} [endCorrection=0] - 開口端補正 Δx [m]（両端に適用されるため2倍で効く）
 * @returns {number} 波数 k [rad/m]
 */
export function calculateWaveNumberForMode(modeNumber, tubeLength, endCorrection = 0) {
  const effectiveLength = tubeLength + 2 * endCorrection;
  return (modeNumber * Math.PI) / effectiveLength;
}

/**
 * 両端開管のn次モードの固有振動数を求める（開口端補正Δxを考慮）。
 *
 * 物理式:
 *   f_n = n v / (2 L_eff),  L_eff = L + 2Δx
 *
 * 導出：波の基本式 v = fλ と k = 2π/λ より f = v k / (2π)。
 * ここに k = nπ/L_eff を代入すると、
 *   f_n = v (nπ/L_eff) / (2π) = n v / (2 L_eff)
 *
 * - f_n: n次固有振動数 [Hz]
 * - n (modeNumber): モード番号（1, 2, 3, ...）
 * - v (soundSpeed): 音速 [m/s]
 * - L (tubeLength): 気柱の長さ [m]
 * - Δx (endCorrection): 開口端補正 [m]。Δxが大きいほどL_effが伸び、f_nは下がる
 *   （管が実質的に長くなったのと同じ効果）。
 *
 * @param {number} modeNumber - モード番号 n
 * @param {number} soundSpeed - 音速 v [m/s]
 * @param {number} tubeLength - 気柱の長さ L [m]
 * @param {number} [endCorrection=0] - 開口端補正 Δx [m]
 * @returns {number} 固有振動数 f_n [Hz]
 */
export function calculateEigenfrequency(modeNumber, soundSpeed, tubeLength, endCorrection = 0) {
  const effectiveLength = tubeLength + 2 * endCorrection;
  return (modeNumber * soundSpeed) / (2 * effectiveLength);
}
