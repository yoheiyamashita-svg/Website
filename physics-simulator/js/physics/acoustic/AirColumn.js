// 気柱振動の物理エンジン（Physics Layer）。
//
// 役割：境界条件（両端開管 / 一端閉管）に応じて波数k・固有振動数f_nを決定し、
// その結果をStandingWave.js（physics/wave/）の定常波の式に渡して変位・粒子速度を求める。
// 気柱固有の近似式をここで新たに作ることはしない（REQ-105の精神：
// 気柱の粒子表示・波形表示・矢印表示は、すべてこのファイルが返す同じ変位関数の
// 計算結果だけを使う）。
//
// 指示書§15の絶対条件：音源側(x=0)は常に開口。boundaryTypeは「反対側(x=L)」だけを表し、
// x=0側の扱いを選択できるパラメータはこのファイルのどの関数にも存在しない
// （StandingWave.calculateStandingWaveDisplacementの式の形自体が、x=0で自動的に
// 腹になることを保証しているため、境界条件モジュール側でx=0を特別扱いする必要もない）。
//
// 【開口端補正（end correction）Δx について（endCorrectionパラメータ）】
// 実際の気柱では、開口端の少し外側の空気も管内の空気と一緒に振動するため、
// 「変位の腹」は開口部ちょうどではなく、そこから距離Δxだけ外側にできる。
// この効果は2箇所に現れる：
//   1. 固有振動数の式：波数kの計算にL_eff(=L+Δx または L+2Δx)を使う
//      （OpenOpenTube.js / OpenClosedTube.js側で実装）。
//   2. 変位の空間分布：x=0を管の物理的な開口部としたまま、cos(kx)の引数に
//      x+Δxを渡すことで、「腹の位置が開口部よりΔxだけ外側にずれている」ことを
//      表現する。この+Δxのシフトがあることで、一端閉管の閉口端(x=L)では
//      k(L+Δx)=(2n-1)π/2 が厳密に成り立ち、Δxの値によらずu(L,t)=0が
//      常に厳密に満たされる（閉口端は硬い壁なので補正の影響を受けない、
//      という物理的な要請と一致する）。

import {
  calculateStandingWaveDisplacement,
  calculateStandingWaveParticleVelocity,
} from "../wave/StandingWave.js";
import * as OpenOpenTube from "./OpenOpenTube.js";
import * as OpenClosedTube from "./OpenClosedTube.js";
// 境界条件の種類を表す定数は、UI層（js/ui/acoustic/AirColumnControls.js等）も
// 同じ値を参照するため、utils/constants.js側で一元管理し、ここではimportするだけにする
// （同じ意味の定数を複数箇所で定義しない）。
import { BOUNDARY_TYPE_OPEN_CLOSED, BOUNDARY_TYPE_OPEN_OPEN } from "../../utils/constants.js";

// boundaryTypeの値から、対応する境界条件モジュール（OpenOpenTube.js / OpenClosedTube.js）を選ぶ。
// JavaScript構文メモ：`import * as OpenOpenTube from "..."` は、そのファイルがexportする
// 関数をまとめて1つのオブジェクトとして受け取る書き方。OpenOpenTube.calculateWaveNumberForMode
// のように、ファイル名をnamespaceとして関数を呼び出せる。
function selectTubeModule(boundaryType) {
  if (boundaryType === BOUNDARY_TYPE_OPEN_OPEN) {
    return OpenOpenTube;
  }
  if (boundaryType === BOUNDARY_TYPE_OPEN_CLOSED) {
    return OpenClosedTube;
  }
  throw new Error(`未対応の境界条件です: ${boundaryType}`);
}

/**
 * 境界条件・モード番号・気柱長・開口端補正から波数kを求める。
 *
 * @param {string} boundaryType - BOUNDARY_TYPE_OPEN_OPEN | BOUNDARY_TYPE_OPEN_CLOSED
 * @param {number} modeNumber - モード番号 n
 * @param {number} tubeLength - 気柱の長さ L [m]
 * @param {number} [endCorrection=0] - 開口端補正 Δx [m]
 * @returns {number} 波数 k [rad/m]
 */
export function calculateWaveNumber(boundaryType, modeNumber, tubeLength, endCorrection = 0) {
  return selectTubeModule(boundaryType).calculateWaveNumberForMode(modeNumber, tubeLength, endCorrection);
}

/**
 * 境界条件・モード番号・気柱長・音速・開口端補正から固有振動数f_nを求める。
 *
 * @param {string} boundaryType
 * @param {number} modeNumber
 * @param {number} soundSpeed - 音速 v [m/s]
 * @param {number} tubeLength - 気柱の長さ L [m]
 * @param {number} [endCorrection=0] - 開口端補正 Δx [m]
 * @returns {number} 固有振動数 f_n [Hz]
 */
export function calculateEigenfrequency(boundaryType, modeNumber, soundSpeed, tubeLength, endCorrection = 0) {
  return selectTubeModule(boundaryType).calculateEigenfrequency(modeNumber, soundSpeed, tubeLength, endCorrection);
}

/**
 * 境界条件・モード番号・気柱長・音速・開口端補正から角周波数ωを求める。
 *
 * 物理式: ω = 2π f_n
 *
 * @param {string} boundaryType
 * @param {number} modeNumber
 * @param {number} soundSpeed
 * @param {number} tubeLength
 * @param {number} [endCorrection=0] - 開口端補正 Δx [m]
 * @returns {number} 角周波数 ω [rad/s]
 */
export function calculateAngularFrequency(boundaryType, modeNumber, soundSpeed, tubeLength, endCorrection = 0) {
  return 2 * Math.PI * calculateEigenfrequency(boundaryType, modeNumber, soundSpeed, tubeLength, endCorrection);
}

/**
 * 位置x、時刻tにおける気柱内の変位u(x,t)を求める。
 *
 * 波数k・角周波数ωを境界条件から決定したうえで、実際の変位の式自体は
 * StandingWave.calculateStandingWaveDisplacement（定常波の一般式）に委譲する。
 * ただし、開口端補正Δxがある場合は、位置xをそのまま渡すのではなく x+Δx を渡す
 * （上部のコメント「開口端補正Δxについて」参照。管の物理的な開口部(x=0)から見て、
 * 実際の腹はΔxだけ外側にあるという物理的な意味を、この+Δxのシフトで表現している）。
 *
 * @param {number} x - 気柱内の位置 [m]（x=0が音源側の開口端）
 * @param {number} t - 時刻 [s]
 * @param {{amplitude:number, boundaryType:string, modeNumber:number, soundSpeed:number, tubeLength:number, endCorrection?:number}} parameters
 * @returns {number} 変位 u [m]
 */
export function calculateDisplacement(
  x,
  t,
  { amplitude, boundaryType, modeNumber, soundSpeed, tubeLength, endCorrection = 0 }
) {
  const waveNumber = calculateWaveNumber(boundaryType, modeNumber, tubeLength, endCorrection);
  const angularFrequency = calculateAngularFrequency(boundaryType, modeNumber, soundSpeed, tubeLength, endCorrection);
  return calculateStandingWaveDisplacement(x + endCorrection, t, { amplitude, waveNumber, angularFrequency });
}

/**
 * 位置x、時刻tにおける気柱内の粒子速度v_p(x,t)を求める。
 *
 * @param {number} x
 * @param {number} t
 * @param {{amplitude:number, boundaryType:string, modeNumber:number, soundSpeed:number, tubeLength:number, endCorrection?:number}} parameters
 * @returns {number} 粒子速度 v_p [m/s]
 */
export function calculateParticleVelocity(
  x,
  t,
  { amplitude, boundaryType, modeNumber, soundSpeed, tubeLength, endCorrection = 0 }
) {
  const waveNumber = calculateWaveNumber(boundaryType, modeNumber, tubeLength, endCorrection);
  const angularFrequency = calculateAngularFrequency(boundaryType, modeNumber, soundSpeed, tubeLength, endCorrection);
  return calculateStandingWaveParticleVelocity(x + endCorrection, t, { amplitude, waveNumber, angularFrequency });
}
