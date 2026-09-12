// 横波（定常波）モードの、両端に境界条件を持つ弦の物理モデル（Physics Layer）。
// js/physics/wave/ReflectedWave.jsを置き換える新しいファイル
// （以前は左端(x=0)が「振動源」で境界条件を持たなかったが、ユーザー要望により
// 両端とも対等に固定端/自由端を選べるようになったため設計を作り直した）。
//
// 【両端に境界条件を置くと何が変わるか】
// 右向き波 u1(x,t)=a·sin(kx-ωt+φ)、左向き波 u2(x,t)=a·sin(kx+ωt+φ) の重ね合わせ
// （φは左端の境界条件だけで決まる位相）は、k・φの値に関わらず常に左端(x=0)の
// 境界条件を厳密に満たす（sinP+sinQ=2sin((P+Q)/2)cos((P-Q)/2)の和積公式で
// u1+u2 = 2a·sin(kx+φ)cos(ωt) となり、x=0でのsin(φ)/cos(φ)の値だけで
// 決まるため。φ=0(固定端)ならsin(0)=0で常に節、φ=π/2(自由端)なら
// sin(kx+π/2)の傾きがx=0で常に0になる）。
//
// しかし右端(x=L)の境界条件は、kL（両端の種類が一致するときはkL/πが整数、
// 不一致のときは(kL-π/2)/πが整数）が「共鳴」しているときしか厳密には
// 成り立たない。これは物理的に必然（Sturm-Liouville理論：両端に境界条件を持つ
// 弦は、離散的な固有振動数でしか定常波を作れない）で、無限回の反射を
// 足し合わせても回避できない。
//
// 【共鳴からズレたときの振幅について（共振曲線・ローレンツ型）】
// ユーザーはλ・f・Lを自由に設定でき、「設定次第で定常波が発生しなくてよい」
// ことを望んだ。ただし「右端がラベルと矛盾して振動して見える」設計は明確に
// 拒否されたため、共鳴からズレるほど振幅そのものがなめらかに小さくなり、
// 見た目にはほぼ静止するようにする。このとき振幅を完全に0にする（ハードカットオフ）
// のは物理として不正確な簡略化であり、採用しない。実際に駆動された共振系
// （おんさ・弦・気柱などの共振現象、physics.md/配布資料の「共振・共鳴」と同じ考え方）
// の定常応答振幅は、共鳴からのズレに対してローレンツ型の曲線
//   response = 1 / (1 + (detuning/halfWidth)^2)
// で滑らかに減衰する（detuning=0で最大値1、離れるほど0に近づくが数学的には
// 厳密な0にはならない）。この関数が返すresponseを、呼び出し側（Simulation層）が
// u1・u2の振幅に掛けることで、共鳴時は通常の定常波、共鳴から外れるとほぼ
// 静止して見える（が厳密には0ではない）変位を作る。

import { calculateDisplacement } from "./TravelingWave.js";
import { END_TYPE_FREE, RESONANCE_HALF_WIDTH } from "../../utils/constants.js";

// 左端の境界の種類から、位相φ [rad] を求める。
// 固定端(節)：sin(kx+φ)がx=0で0になるにはφ=0。
// 自由端(腹)：sin(kx+φ)の傾きがx=0で0になるにはφ=π/2
// （d/dx[sin(kx+φ)]=k cos(kx+φ)がx=0で0になるにはcos(φ)=0、すなわちφ=π/2）。
function calculatePhaseForLeftEnd(leftEndType) {
  return leftEndType === END_TYPE_FREE ? Math.PI / 2 : 0;
}

/**
 * 位置x、時刻tにおける右向き波（入射波）u1の変位を求める。
 *
 * 物理式:
 *   u1(x,t) = amplitude · sin(kx - ωt + φ)
 *
 * @param {number} x - 位置 [m]
 * @param {number} t - 時刻 [s]
 * @param {{amplitude:number, wavelength:number, frequency:number, leftEndType:string}} parameters
 *   amplitudeは呼び出し側が共鳴応答(calculateResonanceResponse)を掛けた実効振幅を渡す。
 * @returns {number} 変位 u1 [m]
 */
export function calculateIncidentDisplacement(x, t, { amplitude, wavelength, frequency, leftEndType }) {
  const phase = calculatePhaseForLeftEnd(leftEndType);
  return calculateDisplacement(x, t, { amplitude, wavelength, frequency, phase });
}

/**
 * 位置x、時刻tにおける左向き波（反射波）u2の変位を求める。
 *
 * 物理式:
 *   u2(x,t) = amplitude · sin(kx + ωt + φ)
 *
 * 【なぜtの符号を反転させるだけでよいのか】
 * TravelingWave.calculateDisplacementは u(x,t)=A sin(kx-ωt+φ) を計算する。
 * ここに-tを渡すと u(x,-t)=A sin(kx-ω(-t)+φ)=A sin(kx+ωt+φ) となり、
 * これがちょうどu2の式そのものになる。新しい物理式を書かず、
 * 既存の進行波の式をそのまま再利用できる（REQ-105の精神）。
 *
 * @param {number} x - 位置 [m]
 * @param {number} t - 時刻 [s]
 * @param {{amplitude:number, wavelength:number, frequency:number, leftEndType:string}} parameters
 * @returns {number} 変位 u2 [m]
 */
export function calculateReflectedDisplacement(x, t, { amplitude, wavelength, frequency, leftEndType }) {
  const phase = calculatePhaseForLeftEnd(leftEndType);
  return calculateDisplacement(x, -t, { amplitude, wavelength, frequency, phase });
}

/**
 * 現在のλ・L・両端の種類から、共鳴からのズレ(detuning)と共鳴応答係数(response)を求める。
 *
 * 【正規化された共鳴条件】
 * 両端の種類が一致する（固定端どうし／自由端どうし）とき、右端の境界条件が
 * 厳密に成り立つのは kL = nπ（n=1,2,3,...）のとき。不一致（固定端と自由端）のときは
 * kL = (n-1/2)π のとき。どちらも「kLをπで割った値が、一致なら整数、不一致なら
 * 整数+0.5」という条件にまとめられるので、
 *   normalized = 一致のとき kL/π、不一致のとき (kL-π/2)/π
 * という共通の指標を作ると、normalizedが整数に近いほど共鳴に近いと判定できる。
 *
 * 物理式（共振曲線・ローレンツ型）:
 *   detuning = normalized - round(normalized)
 *   response = 1 / (1 + (detuning / RESONANCE_HALF_WIDTH)^2)
 *
 * @param {{wavelength:number, mediumLength:number, leftEndType:string, rightEndType:string}} parameters
 * @returns {{detuning:number, response:number}}
 */
export function calculateResonanceResponse({ wavelength, mediumLength, leftEndType, rightEndType }) {
  const waveNumber = (2 * Math.PI) / wavelength;
  const kL = waveNumber * mediumLength;
  const endsMatch = leftEndType === rightEndType;
  const normalized = endsMatch ? kL / Math.PI : (kL - Math.PI / 2) / Math.PI;
  const detuning = normalized - Math.round(normalized);
  const response = 1 / (1 + Math.pow(detuning / RESONANCE_HALF_WIDTH, 2));
  return { detuning, response };
}
