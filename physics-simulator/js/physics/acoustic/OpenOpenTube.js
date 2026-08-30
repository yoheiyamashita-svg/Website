// 「両端の種類が一致する」場合の固有値条件（physics.md §18, §20、指示書§17-1, §18-1）。
//
// 元々は「両端開管（x=0が開口・x=Lも開口）」専用のモジュールだったが、音源側(x=0)も
// 開口/閉口を選べるようになったことで、この式が実際に成り立つのは「両端の種類が
// 一致する」場合（開口-開口 または 閉口-閉口）全般であることがわかった
// （js/physics/acoustic/AirColumn.jsのヘッダーコメントにある導出参照）。
// ファイル名は歴史的経緯でOpenOpenTube.jsのままだが、意味するところは
// 「両端一致（same-end-type）の固有値条件」であり、どちらが開口/閉口かはこの
// モジュールの外（AirColumn.js）が決める。
//
// 境界条件（両端とも「同じ種類」＝両方とも腹、または両方とも節）：
//   両方とも腹（開口-開口）: x=0は自動的に腹（cos(0)=1）。x=Lも腹になる条件は
//     |cos(kL)|=1、すなわちkL=nπ（n=1,2,3,...）。
//   両方とも節（閉口-閉口）: x=0は自動的に節（sin(0)=0）。x=Lも節になる条件は
//     sin(kL)=0、すなわちkL=nπ（n=1,2,3,...）。
//   → どちらの場合も同じkL=nπという条件になる（cos/sinどちらでも、腹どうし・
//     節どうしを両端に置くための波長の条件は同じため）。
//
// 【開口端補正（end correction）Δx について】
// このモジュールはL_eff（開口端補正込みの実効長）を受け取るだけで、Δxそのものや
// 開口端の本数（0/1/2）は一切知らない。L_effの計算はAirColumn.js側に集約している
// （開口端の本数は両端の種類の組み合わせで変わり、「両端一致」の中でも
// 開口-開口なら2本、閉口-閉口なら0本と異なるため、このモジュール単体では
// 決められない）。

/**
 * 両端の種類が一致する場合のn次モードにおける波数kを求める。
 *
 * 物理式:
 *   k L_eff = nπ  →  k = nπ / L_eff
 *
 * @param {number} modeNumber - モード番号 n（1, 2, 3, ...）
 * @param {number} effectiveLength - 開口端補正込みの実効長 L_eff [m]
 * @returns {number} 波数 k [rad/m]
 */
export function calculateWaveNumberForMode(modeNumber, effectiveLength) {
  return (modeNumber * Math.PI) / effectiveLength;
}

/**
 * 両端の種類が一致する場合のn次モードの固有振動数を求める。
 *
 * 物理式:
 *   f_n = n v / (2 L_eff)
 *
 * 導出：波の基本式 v = fλ と k = 2π/λ より f = v k / (2π)。
 * ここに k = nπ/L_eff を代入すると、
 *   f_n = v (nπ/L_eff) / (2π) = n v / (2 L_eff)
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
  return (modeNumber * soundSpeed) / (2 * effectiveLength);
}
