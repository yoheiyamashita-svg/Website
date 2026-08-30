// 「両端の種類が不一致」の場合の固有値条件（physics.md §19, §20、指示書§17-2, §18-2）。
//
// 元々は「一端閉管（x=0が開口・x=Lが閉口）」専用のモジュールだったが、音源側(x=0)も
// 開口/閉口を選べるようになったことで、この式が実際に成り立つのは「両端の種類が
// 不一致」の場合全般（開口-閉口 または 閉口-開口）であることがわかった
// （js/physics/acoustic/AirColumn.jsのヘッダーコメントにある導出参照）。
// ファイル名は歴史的経緯でOpenClosedTube.jsのままだが、意味するところは
// 「両端不一致（different-end-type）の固有値条件」であり、どちらが開口/閉口かは
// このモジュールの外（AirColumn.js）が決める。
//
// 境界条件（一方が腹、もう一方が節）：
//   x=0が腹・x=Lが節（開口-閉口）: u(L,t)=0が全時刻tで厳密に成り立たなければならない。
//     u(L,t) = A cos(kL) cos(ωt) が任意のtで0になるためには cos(kL)=0、
//     すなわち kL=(2n-1)π/2（n=1,2,3,...）。
//   x=0が節・x=Lが腹（閉口-開口）: 対称的に、u(x,t)=A sin(kx)cos(ωt)がx=Lで
//     腹（|sin(kL)|=1）になる条件も、同じkL=(2n-1)π/2に一致する。
//   → どちらの場合も同じkL=(2n-1)π/2という条件になる。
// n=1: kL=π/2、n=2: kL=3π/2、n=3: kL=5π/2 …と、奇数×(π/2)の値しか許されない。
// これが「偶数次の振動が存在しない」理由であり、「kLが奇数×π/2でなければ
// 不一致境界の条件を満たせない」という数式そのものから導かれる。
//
// 【開口端補正（end correction）Δx について】
// このモジュールはL_eff（開口端補正込みの実効長）を受け取るだけで、Δxそのものや
// 開口端の本数は一切知らない。L_effの計算はAirColumn.js側に集約している。

/**
 * 両端の種類が不一致の場合のn次モードにおける波数kを求める。
 *
 * 物理式:
 *   k L_eff = (2n-1)π/2  →  k = (2n-1)π / (2 L_eff)
 *
 * @param {number} modeNumber - モード番号 n（1, 2, 3, ...）
 * @param {number} effectiveLength - 開口端補正込みの実効長 L_eff [m]
 * @returns {number} 波数 k [rad/m]
 */
export function calculateWaveNumberForMode(modeNumber, effectiveLength) {
  return ((2 * modeNumber - 1) * Math.PI) / (2 * effectiveLength);
}

/**
 * 両端の種類が不一致の場合のn次モードの固有振動数を求める。
 *
 * 物理式:
 *   f_n = (2n-1) v / (4 L_eff)
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
 * - L_eff (effectiveLength): 開口端補正込みの実効長 [m]
 *
 * @param {number} modeNumber - モード番号 n
 * @param {number} soundSpeed - 音速 v [m/s]
 * @param {number} effectiveLength - 開口端補正込みの実効長 L_eff [m]
 * @returns {number} 固有振動数 f_n [Hz]
 */
export function calculateEigenfrequency(modeNumber, soundSpeed, effectiveLength) {
  return ((2 * modeNumber - 1) * soundSpeed) / (4 * effectiveLength);
}
